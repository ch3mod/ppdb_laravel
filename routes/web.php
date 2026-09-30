<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\BeasiswaController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ExtracurricularController;
use App\Http\Controllers\FormulirController;
use App\Http\Controllers\KartuPendaftaranController;
use App\Http\Controllers\KwitansiController;
use App\Http\Controllers\PendaftaranPPDB;
use App\Http\Controllers\PpdbSettingController;
use App\Http\Controllers\SuratController;
use App\Http\Controllers\UkuranSeragamController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// redirect /pendaftaran to /register
Route::redirect('/pendaftaran', '/register');

Route::get('/', function () {
    return inertia('Landing', [
        'extracurriculars' => \App\Models\Extracurricular::with('photos')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                $item->photos->each(fn ($photo) => $photo->setAttribute('url', \Storage::disk('public')->url($photo->path)));
                return $item;
            }),
    ]);
});
Route::get('/register', function () {
    return inertia('Pendaftaran');
})->name('ppdb.register');

Route::post('/register', [PendaftaranPPDB::class, 'mendaftar'])->name('ppdb.register.submit');

// cek status pendaftaran
Route::get('/cek-status', [PendaftaranPPDB::class, 'cekStatus'])->name('ppdb.cek.status');
Route::post('/cek-status', [PendaftaranPPDB::class, 'prosesCekStatus'])->name('ppdb.cek.status.submit');

Route::get('/inertia-test', function () {
    return inertia('Welcome');
});

Route::view('/formulir-old', 'formulir'); // Keeping old just in case

Route::prefix('/dashboard')->middleware('auth')->group(function () {
    // setting profile
    Route::get('setting/profile', [AdminController::class, 'pengaturanAkun'])->name('setting.profile');
    Route::put('setting/profile', [AdminController::class, 'setAkun'])->name('setting.profile');

    // ppdb setting
    Route::get('/setting/ppdb', [PpdbSettingController::class, 'index'])->name('ppdb.set.batas.akhir');
    Route::put('/setting/ppdb', [PpdbSettingController::class, 'setBatasAkhir'])->name('ppdb.set.batas.akhir');

    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    Route::get('/ekstrakurikuler', [ExtracurricularController::class, 'index'])->name('admin.extracurriculars.index');
    Route::post('/ekstrakurikuler', [ExtracurricularController::class, 'store'])->name('admin.extracurriculars.store');
    Route::put('/ekstrakurikuler/{extracurricular}', [ExtracurricularController::class, 'update'])->name('admin.extracurriculars.update');
    Route::delete('/ekstrakurikuler/{extracurricular}', [ExtracurricularController::class, 'destroy'])->name('admin.extracurriculars.destroy');
    Route::delete('/ekstrakurikuler-foto/{photo}', [ExtracurricularController::class, 'destroyPhoto'])->name('admin.extracurriculars.photos.destroy');

    // list pendaftar

    Route::get('/ppdb/list-pendaftar', [PendaftaranPPDB::class, 'listPendaftar'])->name('ppdb.list.pendaftar');

    // tanbah pendaftar

    Route::get('/ppdb/tambah-pendaftar', [PendaftaranPPDB::class, 'tambahPendaftar'])->name('ppdb.tambah.pendaftar');

    Route::post('/ppdb/tambah-pendaftar', [PendaftaranPPDB::class, 'submitPendaftar'])->name('ppdb.tambah.pendaftar');

    // -- lihat identias pendaftar

    Route::get('/ppdb/show/{id}', [PendaftaranPPDB::class, 'showPeserta'])->name('ppdb.show.peserta');

    // edit pendaftar
    Route::get('/ppdb/edit/{id}', [PendaftaranPPDB::class, 'edit'])->name('ppdb.edit.peserta');
    Route::put('/ppdb/edit/{id}', [PendaftaranPPDB::class, 'update'])->name('ppdb.edit.peserta');
    Route::delete('/ppdb/delete/{id}', [PendaftaranPPDB::class, 'hapusPeserta'])->name('ppdb.delete.peserta');

    // daftar ulanng

    Route::post('/ppdb/daftar-ulang/{uuid}', [PendaftaranPPDB::class, 'terimaPeserta'])->name('ppdb.terima.peserta');

    // verifikasi berkas
    Route::post('/ppdb/berkas/{uuid}', [PendaftaranPPDB::class, 'updateBerkas'])->name('ppdb.berkas.update');

    Route::get('/ppdb/list/terdaftar-ulang', [PendaftaranPPDB::class, 'listDaftarUlang'])->name('ppdb.daftar.ulang.list');
    Route::get('/ppdb/list/belum-daftar-ulang', [PendaftaranPPDB::class, 'listBelumDaftarUlang'])->name('ppdb.belum.daftar.ulang.list');

    Route::prefix('kwitansi')->group(function () {
        Route::get('show', [KwitansiController::class, 'showPesertaDiterima'])->name('ppdb.kwitansi.show');

        // tambah kwitansi
        Route::get('/tambah/{uuid}', [KwitansiController::class, 'tambahKwitansi'])->name('ppdb.kwitansi.tambah');
        Route::post('/tambah/{uuid}', [KwitansiController::class, 'storeKwitansi'])->name('ppdb.kwitansi.tambah');
        Route::delete('/hapus/{id}', [KwitansiController::class, 'hapusKwitansi'])->name('ppdb.kwitansi.hapus');

        // cetak
        Route::post('/cetak/kwitansi/{uuid}', [KwitansiController::class, 'cetakKwitansi'])->name('ppdb.cetak.kwitansi');
        Route::post('/cetak/kwitansi/{uuid}/{id}', [KwitansiController::class, 'cetakKwitansiSingle'])->name('ppdb.cetak.kwitansi.single');

        // rekap kwitansi
        Route::get('/rekap', [KwitansiController::class, 'rekapKwitansi'])->name('ppdb.rekap.kwitansi');
        Route::get('/rekap/cetak-dana', [KwitansiController::class, 'cetakRekapDanaKwitansi'])->name('ppdb.rekap.kwitansi-dana');
        Route::get('/rekap/cetak-riwayat', [KwitansiController::class, 'cetakRekapRiwayatKwitansi'])->name('ppdb.rekap.kwitansi-riwayat');
    });

    Route::prefix('ukuran-seragam')->group(function () {
        Route::get('show', [UkuranSeragamController::class, 'showPeserta'])->name('ppdb.seragam.show');

        Route::post('/ubah/seragam', [UkuranSeragamController::class, 'ubahUkuranSeragam'])->name('ppdb.ubah.seragam');
    });

    Route::prefix('surat')->group(function () {
        Route::get('show', [SuratController::class, 'showPeserta'])->name('ppdb.surat.show');

        Route::post('/cetak/surat', [SuratController::class, 'cetakSurat'])->name('ppdb.cetak.surat.semua');
        Route::post('/cetak/surat/{uuid}/single', [SuratController::class, 'cetakSuratSingle'])->name('ppdb.cetak.surat');
    });

    Route::prefix('formulir')->group(function () {
        Route::get('show', [FormulirController::class, 'showPeserta'])->name('ppdb.formulir.show');

        Route::post('/cetak/formulir', [FormulirController::class, 'cetakFormulir'])->name('ppdb.cetak.formulir.semua');
        Route::post('/cetak/formulir/{uuid}/single', [FormulirController::class, 'cetakFormulirSingle'])->name('ppdb.cetak.formulir');
    });

    Route::prefix('kartu-pendaftaran')->group(function () {
        Route::get('show', [KartuPendaftaranController::class, 'showPeserta'])->name('ppdb.kartu.show');

        Route::post('/cetak/kartu', [KartuPendaftaranController::class, 'cetakKartu'])->name('ppdb.cetak.kartu.semua');
        Route::post('/cetak/kartu/{uuid}/single', [KartuPendaftaranController::class, 'cetakKartuSingle'])->name('ppdb.cetak.kartu');
    });

    Route::prefix('export')->group(function () {
        // peserta ppdb
        Route::get('peserta-ppdb', [ExportController::class, 'exportPesertaPpdb'])->name('export.peserta.ppdb');

        // ukuran seragam
        Route::get('ukuran-seragam', [ExportController::class, 'exportSeragam'])->name('export.seragam');

        // export rekap sekolah
        Route::get('rekap-sekolah', [ExportController::class, 'exportRekapSekolah'])->name('export.rekap-sekolah');

        // export belum daftar ulang
        Route::get('belum-daftar-ulang', [ExportController::class, 'exportBelumDaftarUlang'])->name('export.belum.daftar.ulang');
    });

    // beasiswa route
    Route::prefix('beasiswa')->group(function () {
        // beasiswa akademik, non akademik, kip, yatim piatu
        Route::get('akademik', [BeasiswaController::class, 'beasiswaAkademik'])->name('ppdb.beasiswa.akademik');
        Route::get('non-akademik', [BeasiswaController::class, 'beasiswaNonAkademik'])->name('ppdb.beasiswa.non-akademik');
        Route::get('kip', [BeasiswaController::class, 'beasiswaKip'])->name('ppdb.beasiswa.kip');
        Route::get('yatim-piatu', [BeasiswaController::class, 'beasiswaYatimPiatu'])->name('ppdb.beasiswa.yatim-piatu');

        // cetak beasiswa
        Route::post('/cetak/{uuid}', [BeasiswaController::class, 'cetakBeasiswaSingle'])->name('ppdb.cetak.beasiswa');
        Route::post('/cetak-semua/{jenis}', [BeasiswaController::class, 'cetakBeasiswaSemua'])->name('ppdb.cetak.beasiswa.semua');
    });
});
