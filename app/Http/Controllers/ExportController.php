<?php

namespace App\Http\Controllers;

use App\Exports\PesertaPPDBExport;
use App\Exports\RekapSekolahExport;
use App\Exports\SeragamExport;
use App\Http\Requests\ExportPesertaRequest;
use App\Http\Requests\ExportSeragamRequest;
use App\Models\PesertaPPDB;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function exportPesertaPpdb(ExportPesertaRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $status = $request->input('status', 'semua');

        $label = match ($status) {
            'diterima' => 'diterima_',
            'sudah_du' => 'sudah_daftar_ulang_',
            'belum_du' => 'belum_daftar_ulang_',
            default => '',
        };

        $filename = 'peserta_ppdb_'.$label.'SDNP02-'.$tahun.'.xlsx';

        return Excel::download(new PesertaPPDBExport($tahun, $status), $filename);
    }

    public function exportSeragam(ExportSeragamRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $status = $request->input('status', 'diterima');

        $label = match ($status) {
            'sudah_du' => 'sudah_daftar_ulang_',
            'semua' => 'semua_',
            default => 'diterima_',
        };

        $filename = 'Ukuran-seragam-'.$label.'SDNP02-'.$tahun.'.xlsx';

        return Excel::download(new SeragamExport($tahun, $status), $filename);
    }

    public function exportRekapSekolah(ExportPesertaRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $status = $request->input('status', 'semua');

        $pendaftarPerSekolah = PesertaPPDB::select(DB::raw('asal_sekolah, count(asal_sekolah) as as_count'))
            ->whereYear('created_at', $tahun)
            ->when($status === 'diterima', function ($query) {
                $query->whereDiterima(1);
            })
            ->when($status === 'sudah_du', function ($query) {
                $query->whereDiterima(1)->has('kwitansi');
            })
            ->when($status === 'belum_du', function ($query) {
                $query->doesntHave('kwitansi');
            })
            ->groupBy('asal_sekolah')
            ->orderByDesc('as_count')
            ->get();

        $label = match ($status) {
            'diterima' => 'diterima_',
            'sudah_du' => 'sudah_daftar_ulang_',
            'belum_du' => 'belum_daftar_ulang_',
            default => '',
        };

        return Excel::download(new RekapSekolahExport($tahun, $pendaftarPerSekolah), 'Rekap-sekolah-'.$label.$tahun.'.xlsx');
    }

    public function exportBelumDaftarUlang(ExportPesertaRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $status = $request->input('status', 'belum_du');

        $filename = 'peserta_ppdb_belum_daftar_ulang_SDNP02-'.$tahun.'.xlsx';

        return Excel::download(new PesertaPPDBExport($tahun, $status), $filename);
    }
}
