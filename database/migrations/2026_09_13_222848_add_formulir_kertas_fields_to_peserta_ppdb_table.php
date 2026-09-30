<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            // A. Keterangan Siswa
            $table->after('nisn', function (Blueprint $table) {
                $table->string('nama_panggilan')->nullable();
                $table->string('agama')->nullable();
                $table->string('kewarganegaraan')->default('Indonesia');
                $table->unsignedTinyInteger('anak_ke')->nullable();
                $table->unsignedTinyInteger('jml_saudara_kandung')->nullable();
                $table->unsignedTinyInteger('jml_saudara_tiri')->nullable();
                $table->unsignedTinyInteger('jml_saudara_angkat')->nullable();
                $table->string('bahasa_sehari_hari')->nullable();
                $table->string('berat_badan', 10)->nullable();
                $table->string('tinggi_badan', 10)->nullable();
                $table->string('golongan_darah', 3)->nullable();
                $table->string('penyakit_diderita')->nullable();
                $table->string('tempat_tinggal')->nullable();
            });

            // B. Orang Tua / Wali
            $table->after('pekerjaan_ibu', function (Blueprint $table) {
                $table->string('pendidikan_ayah')->nullable();
                $table->string('pendidikan_ibu')->nullable();
                $table->string('nama_wali')->nullable();
                $table->string('pendidikan_wali')->nullable();
                $table->string('hubungan_wali')->nullable();
                $table->string('pekerjaan_wali')->nullable();
            });

            // C. Asal Mula Siswa
            $table->after('tahun_lulus', function (Blueprint $table) {
                $table->string('masuk_sebagai')->nullable();
                $table->string('asal_siswa')->nullable();
                $table->string('nama_tk')->nullable();
                $table->string('tk_lokasi')->nullable();
                $table->year('sttb_tahun')->nullable();
                $table->string('sttb_nomor')->nullable();
                $table->string('lama_belajar')->nullable();
                $table->string('pindahan_sekolah')->nullable();
                $table->string('pindahan_lokasi')->nullable();
                $table->date('pindahan_tanggal')->nullable();
                $table->string('pindahan_kelas')->nullable();
                $table->date('diterima_tanggal')->nullable();
                $table->string('diterima_kelas')->nullable();
            });

            // Alasan keputusan admin (diterima/ditolak)
            $table->after('diterima', function (Blueprint $table) {
                $table->text('alasan_status')->nullable();
            });

            // Checklist verifikasi berkas admin
            $table->after('alasan_status', function (Blueprint $table) {
                $table->boolean('berkas_akte')->default(false);
                $table->boolean('berkas_kk')->default(false);
                $table->boolean('berkas_ktp_ortu')->default(false);
                $table->boolean('berkas_ijazah')->default(false);
                $table->boolean('berkas_sktm_kip')->default(false);
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->dropColumn([
                'nama_panggilan',
                'agama',
                'kewarganegaraan',
                'anak_ke',
                'jml_saudara_kandung',
                'jml_saudara_tiri',
                'jml_saudara_angkat',
                'bahasa_sehari_hari',
                'berat_badan',
                'tinggi_badan',
                'golongan_darah',
                'penyakit_diderita',
                'tempat_tinggal',
                'pendidikan_ayah',
                'pendidikan_ibu',
                'nama_wali',
                'pendidikan_wali',
                'hubungan_wali',
                'pekerjaan_wali',
                'masuk_sebagai',
                'asal_siswa',
                'nama_tk',
                'tk_lokasi',
                'sttb_tahun',
                'sttb_nomor',
                'lama_belajar',
                'pindahan_sekolah',
                'pindahan_lokasi',
                'pindahan_tanggal',
                'pindahan_kelas',
                'diterima_tanggal',
                'diterima_kelas',
                'alasan_status',
                'berkas_akte',
                'berkas_kk',
                'berkas_ktp_ortu',
                'berkas_ijazah',
                'berkas_sktm_kip',
            ]);
        });
    }
};
