<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Models\PesertaPPDB;
use App\Models\PpdbSetting;

class SuratController extends Controller
{
    public function showPeserta(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::query()
            ->whereDiterima(1)
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);
        $settingBody = optional(PpdbSetting::latest()->first())->body;
        $settings = [
            'no_surat' => $settingBody['no_surat'] ?? '-',
            'batas_akhir_ppdb' => $settingBody['batas_akhir_ppdb'] ?? null,
        ];

        return inertia('Admin/Document/Index', [
            'pesertappdb' => $pesertappdb,
            'tahun' => $tahun,
            'years' => $years,
            'title' => 'Surat Diterima Peserta PPDB',
            'printSingleRoute' => 'ppdb.cetak.surat',
            'printAllRoute' => 'ppdb.cetak.surat.semua',
            'showSettings' => true,
            'settings' => $settings,
        ]);
    }

    public function cetakSurat()
    {
        $pesertappdb = PesertaPPDB::query()
            ->whereDiterima(1)
            ->whereYear('created_at', now()->year)
            ->get();

        return view('pdf.cetak-surat', compact('pesertappdb'));
    }

    public function cetakSuratSingle($uuid)
    {
        $pesertappdb = PesertaPPDB::query()
            ->whereId($uuid)
            ->get();

        return view('pdf.cetak-surat', compact('pesertappdb'));
    }
}
