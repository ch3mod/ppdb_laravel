<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentFilterRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\PesertaPPDB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard(DocumentFilterRequest $request)
    {
        $tahun = (int) ($request->validated('tahun') ?? now()->year);

        $stats = [
            'total' => PesertaPPDB::whereYear('created_at', $tahun)->count(),
            'diterima' => PesertaPPDB::whereYear('created_at', $tahun)->where('diterima', 1)->count(),
            'ditolak' => PesertaPPDB::whereYear('created_at', $tahun)->where('diterima', 2)->count(),
            'seleksi' => PesertaPPDB::whereYear('created_at', $tahun)->where('diterima', 0)->count(),
            'daftar_ulang' => PesertaPPDB::has('kwitansi')->whereYear('created_at', $tahun)->count(),
            'belum_daftar_ulang' => PesertaPPDB::doesntHave('kwitansi')->whereYear('created_at', $tahun)->count(),
        ];

        $gender = [
            'l' => PesertaPPDB::whereYear('created_at', $tahun)->where('jenis_kelamin', 'l')->count(),
            'p' => PesertaPPDB::whereYear('created_at', $tahun)->where('jenis_kelamin', 'p')->count(),
        ];

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        // Tren pendaftar per bulan pada tahun terpilih
        $monthExpr = match (DB::connection()->getDriverName()) {
            'pgsql' => 'EXTRACT(MONTH FROM created_at)',
            'sqlite' => "CAST(strftime('%m', created_at) AS INTEGER)",
            default => 'MONTH(created_at)',
        };

        $monthlyTrend = PesertaPPDB::select(DB::raw("{$monthExpr} as bulan, count(*) as jumlah"))
            ->whereYear('created_at', $tahun)
            ->groupBy(DB::raw($monthExpr))
            ->orderBy('bulan')
            ->get()
            ->map(fn ($item) => [
                'bulan' => $months[$item->bulan - 1],
                'jumlah' => $item->jumlah,
            ]);

        // 10 asal sekolah teratas
        $topSekolah = PesertaPPDB::select(DB::raw('asal_sekolah, count(asal_sekolah) as as_count'))
            ->whereYear('created_at', $tahun)
            ->groupBy('asal_sekolah')
            ->orderByDesc('as_count')
            ->limit(10)
            ->get();

        $beasiswa = [
            'kip' => PesertaPPDB::whereYear('created_at', $tahun)->where('penerima_kip', 'y')->count(),
            'yatim_piatu' => PesertaPPDB::whereYear('created_at', $tahun)->where('yatim_piatu', 1)->count(),
            'prestasi' => PesertaPPDB::whereYear('created_at', $tahun)
                ->whereNotNull('non_akademik')
                ->where('non_akademik->jenis_lomba', '!=', '')
                ->count(),
        ];

        // Get oldest year for the year filter dropdown
        $oldestYear = Cache::remember('oldest_year', 60 * 24 * 28, function () {
            $oldest = PesertaPPDB::oldest('created_at')->first();

            return $oldest ? $oldest->created_at->year : date('Y');
        });

        return inertia('Admin/Dashboard', compact(
            'stats',
            'gender',
            'monthlyTrend',
            'topSekolah',
            'beasiswa',
            'tahun',
            'oldestYear'
        ));
    }

    public function pengaturanAkun()
    {
        $user = request()->user();

        return inertia('Admin/Profile', compact('user'));
    }

    public function setAkun(UpdateProfileRequest $request)
    {
        $request->validated();

        request()->user()->update([
            'name' => $request->input('name'),
            'password' => bcrypt($request->input('password')),
        ]);

        session()->flash('success', 'Data user dan password berhasil di ganti');

        return back();
    }
}
