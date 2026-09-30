<?php

namespace Database\Seeders;

use App\Models\Kwitansi;
use App\Models\PesertaPPDB;
use App\Models\UkuranSeragam;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class PesertaPPDBSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Hapus semua data lama (termasuk user) sebelum memasukkan
     * data dummy yang baru.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Kwitansi::truncate();
        UkuranSeragam::truncate();
        PesertaPPDB::truncate();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        // Buat admin utama.
        $admin = User::factory()->create();

        // Tambah beberapa staf/guru yang bisa menerima pembayaran.
        foreach (range(1, 3) as $i) {
            User::factory()->create(['name' => 'Staf Guru '.$i, 'niy' => 'STAFF'.$i]);
        }

        // User pertama adalah admin utama (penerima pembayaran).
        $penerima = User::first();

        $tahunIni = PesertaPPDB::factory(5)->create();

        // Data tahun lalu (untuk filter tahun & grafik).
        $tahunLalu = PesertaPPDB::factory(5)->create([
            'created_at' => now()->subYear(),
            'tahun_lulus' => now()->subYear()->year,
            'sttb_tahun' => now()->subYear()->year,
            'diterima' => 1,
        ]);

        // Sebagian peserta tahun ini sudah daftar ulang (punya kwitansi) + ukur seragam,
        // sisanya dibiarkan kosong agar halaman "Belum Daftar Ulang" juga ada isinya.
        foreach ($tahunIni->take(3) as $peserta) {
            $this->buatKwitansi($peserta, $penerima);
        }

        foreach ($tahunIni->take(2) as $peserta) {
            $this->buatUkuranSeragam($peserta);
        }

        // Peserta tahun lalu diasumsikan sudah selesai daftar ulang.
        foreach ($tahunLalu as $peserta) {
            $this->buatKwitansi($peserta, $penerima);
        }

        foreach ($tahunLalu->take(3) as $peserta) {
            $this->buatUkuranSeragam($peserta);
        }
    }

    protected function buatKwitansi(PesertaPPDB $peserta, User $penerima): Kwitansi
    {
        // SD Negeri biasanya gratis; yang dibayar cuma seragam.
        return Kwitansi::create([
            'peserta_ppdb_id' => $peserta->id,
            'jenis_pembayaran' => 'Seragam',
            'nominal' => fake()->randomElement([150000, 200000, 250000]),
            'user_id' => $penerima->id,
            'created_at' => $peserta->created_at->copy()->addDays(rand(1, 14)),
        ]);
    }

    protected function buatUkuranSeragam(PesertaPPDB $peserta): UkuranSeragam
    {
        // Ukuran anak usia 6-7 tahun.
        return UkuranSeragam::create([
            'peserta_ppdb_id' => $peserta->id,
            'baju' => (string) fake()->numberBetween(4, 8),
            'sepatu' => (string) fake()->numberBetween(28, 34),
            'baju_batik' => fake()->boolean(80),
            'seragam_olahraga' => fake()->boolean(80),
            'atribut' => fake()->boolean(80),
        ]);
    }
}
