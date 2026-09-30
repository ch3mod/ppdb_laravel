<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Models\PesertaPPDB;

class FormulirController extends Controller
{
    public function showPeserta(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::query()
            // ->whereDiterima(1)
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Document/Index', [
            'pesertappdb' => $pesertappdb,
            'tahun' => $tahun,
            'years' => $years,
            'title' => 'Formulir Pendaftaran Peserta PPDB',
            'printSingleRoute' => 'ppdb.cetak.formulir',
            'printAllRoute' => 'ppdb.cetak.formulir.semua',
            'showSettings' => false,
        ]);
    }

    public function cetakFormulir()
    {
        $pesertappdb = PesertaPPDB::query()
            // ->whereDiterima(1)
            ->whereYear('created_at', now()->year)
            ->get();

        return view('pdf.cetak-formulir', compact('pesertappdb'));
    }

    public function cetakFormulirSingle($uuid)
    {
        $pesertappdb = PesertaPPDB::query()
            ->whereId($uuid)
            ->get();

        return view('pdf.cetak-formulir', compact('pesertappdb'));
    }
}
