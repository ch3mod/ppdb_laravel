<?php

namespace Database\Factories;

use App\Models\PesertaPPDB;
use Illuminate\Database\Eloquent\Factories\Factory;

class PesertaPPDBFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PesertaPPDB::class;

    /**
     * Nomor HP format Indonesia (08xxxxxxxxxx).
     */
    protected function noHpIndonesia(): string
    {
        $prefix = $this->faker->randomElement([
            '0812', '0813', '0815', '0816', '0817', '0818', '0819',
            '0821', '0822', '0823', '0851', '0852', '0853',
            '0855', '0856', '0857', '0858', '0859',
            '0877', '0878', '0881', '0882',
            '0895', '0896', '0897', '0898', '0899',
        ]);

        return $prefix.$this->faker->numerify('########');
    }

    /**
     * Define the model's default state.
     *
     * Data dummy dibatasi untuk wilayah sekitar sekolah
     * (Kec. Katapang, Kab. Bandung, Jawa Barat) agar realistis.
     *
     * @return array
     */
    public function definition()
    {
        $jenisKelamin = $this->faker->randomElement(['l', 'p']);

        $namaDepan = $jenisKelamin === 'l'
            ? $this->faker->firstNameMale()
            : $this->faker->firstNameFemale();
        $namaBelakang = $this->faker->lastName();

        // Lahir di sekitar Bandung (mayoritas), sebagian kecil kota lain di Jawa Barat.
        $tempatLahir = $this->faker->randomElement([
            'Bandung', 'Bandung', 'Bandung', 'Bandung', 'Bandung',
            'Soreang', 'Cimahi', 'Banjaran', 'Majalaya', 'Ciparay',
            'Garut', 'Sumedang', 'Tasikmalaya', 'Cianjur', 'Bogor',
        ]);

        // Komponen alamat khas siswa SDN Pangauban 02 (Kec. Katapang).
        $dukuh = $this->faker->randomElement([
            'Pangauban', 'Cangkuang', 'Cipeuteuy', 'Sukarasa', 'Bojong',
            'Cikalang', 'Sukarame', 'Cijagra',
        ]);
        $rt = str_pad((string) $this->faker->numberBetween(1, 20), 2, '0', STR_PAD_LEFT);
        $rw = str_pad((string) $this->faker->numberBetween(1, 10), 2, '0', STR_PAD_LEFT);
        $desa = $this->faker->randomElement([
            'Pangauban', 'Katapang', 'Sukamaju', 'Gandasoli', 'Sangkanhurip', 'Banyusari',
        ]);

        $alamatLengkap = "Dk. {$dukuh}, RT {$rt} / RW {$rw}, Desa {$desa}, Kec. Katapang, Kab. Bandung, Jawa Barat, Kode Pos 40921";

        // Asal sekolah: TK/RA di sekitar Katapang.
        $namaTk = $this->faker->randomElement([
            'TK Pertiwi Katapang',
            'TK Aisyiyah Katapang',
            'TK Al-Hidayah Pangauban',
            'TK Baiturrahman Katapang',
            'TK Nurul Huda Pangauban',
            'RA Al-Istiqomah Katapang',
            'TK Kasih Ibu Sukamaju',
            'TK Mekar Sari Gandasoli',
        ]);

        $penerimaKip = $this->faker->randomElement(['n', 'n', 'n', 'y']);

        $tempatTinggal = $this->faker->randomElement(['orang_tua', 'orang_tua', 'orang_tua', 'wali']);
        $isYatim = $this->faker->boolean(15);
        $isWali = $tempatTinggal === 'wali' || $isYatim;

        return [
            'nama_lengkap' => "{$namaDepan} {$namaBelakang}",
            'nama_panggilan' => $namaDepan,
            'jenis_kelamin' => $jenisKelamin,
            'tempat_lahir' => $tempatLahir,
            // Calon siswa kelas 1 SD: lahir sekitar 2019-2020 (usia 6-7 tahun).
            'tanggal_lahir' => $this->faker->dateTimeBetween('2019-06-01', '2020-12-31')->format('Y-m-d'),
            'agama' => $this->faker->randomElement(['Islam', 'Islam', 'Islam', 'Islam', 'Islam', 'Kristen', 'Katolik']),
            'kewarganegaraan' => 'Indonesia',
            'anak_ke' => $this->faker->numberBetween(1, 3),
            'jml_saudara_kandung' => $this->faker->numberBetween(0, 3),
            'jml_saudara_tiri' => 0,
            'jml_saudara_angkat' => 0,
            'bahasa_sehari_hari' => $this->faker->randomElement(['Indonesia', 'Indonesia', 'Sunda']),
            'berat_badan' => (string) $this->faker->numberBetween(16, 28),
            'tinggi_badan' => (string) $this->faker->numberBetween(105, 128),
            'golongan_darah' => $this->faker->randomElement(['A', 'B', 'AB', 'O']),
            'penyakit_diderita' => $this->faker->randomElement([null, null, null, null, null, 'Asma', 'Alergi dingin']),
            // NIK 16 digit diawali kode Kab. Bandung (32.04).
            'nik' => '3204'.$this->faker->numerify('############'),
            'nisn' => $this->faker->numerify('##########'),
            'asal_sekolah' => $namaTk,
            'nama_tk' => $namaTk,
            'tk_lokasi' => 'Katapang',
            'tahun_lulus' => now()->year,
            'sttb_tahun' => now()->year,
            'sttb_nomor' => $this->faker->numerify('###/STTB/####'),
            'lama_belajar' => (string) $this->faker->numberBetween(1, 3),
            'masuk_sebagai' => 'siswa_baru',
            'asal_siswa' => 'taman_kanak_kanak',
            'tempat_tinggal' => $tempatTinggal,
            'alamat_lengkap' => $alamatLengkap,
            'dukuh' => $dukuh,
            'rt' => $rt,
            'rw' => $rw,
            'desa_kelurahan' => $desa,
            'kecamatan' => 'Katapang',
            'kabupaten_kota' => 'Bandung',
            'provinsi' => 'Jawa Barat',
            'kode_pos' => '40921',
            'penerima_kip' => $penerimaKip,
            'no_kip' => $penerimaKip === 'y' ? 'KIP'.$this->faker->numerify('########') : null,
            'no_hp' => $this->noHpIndonesia(),
            'nama_ayah' => $this->faker->firstNameMale().' '.$this->faker->lastName(),
            'pendidikan_ayah' => $this->faker->randomElement(['SD/Sederajat', 'SMP/Sederajat', 'SMA/Sederajat', 'SMA/Sederajat', 'S1']),
            'pekerjaan_ayah' => $this->faker->randomElement([
                'Buruh Harian Lepas', 'Petani', 'Pedagang', 'Karyawan Swasta', 'Wiraswasta',
                'Sopir', 'Ojek Online', 'Tukang Bangunan', 'Guru',
            ]),
            'no_hp_ayah' => $this->noHpIndonesia(),
            'nama_ibu' => $this->faker->firstNameFemale().' '.$this->faker->lastName(),
            'pendidikan_ibu' => $this->faker->randomElement(['SD/Sederajat', 'SMP/Sederajat', 'SMP/Sederajat', 'SMA/Sederajat', 'SMA/Sederajat']),
            'pekerjaan_ibu' => $this->faker->randomElement([
                'Ibu Rumah Tangga', 'Ibu Rumah Tangga', 'Ibu Rumah Tangga',
                'Pedagang', 'Karyawan Swasta', 'Buruh Harian Lepas', 'Guru',
            ]),
            'no_hp_ibu' => $this->noHpIndonesia(),
            // Wali (untuk yatim piatu / tempat tinggal wali).
            'yatim_piatu' => $isYatim,
            'nama_wali' => $isWali ? $this->faker->firstNameMale().' '.$this->faker->lastName() : null,
            'pendidikan_wali' => $isWali ? $this->faker->randomElement(['SD/Sederajat', 'SMP/Sederajat', 'SMA/Sederajat', 'S1']) : null,
            'hubungan_wali' => $isWali ? $this->faker->randomElement(['Kakek', 'Nenek', 'Paman', 'Bibi', 'Wali']) : null,
            'pekerjaan_wali' => $isWali ? $this->faker->randomElement(['Petani', 'Pedagang', 'Karyawan Swasta', 'Wiraswasta', 'Buruh Harian Lepas']) : null,
            // TTD berkas dan status.
            'berkas_akte' => $this->faker->boolean(90),
            'berkas_kk' => $this->faker->boolean(90),
            'berkas_ktp_ortu' => $this->faker->boolean(90),
            'berkas_ijazah' => $this->faker->boolean(90),
            'berkas_sktm_kip' => $this->faker->boolean(70),
            // Status penerimaan & TTD fisik.
            'diterima' => $this->faker->randomElement([0, 1, 1]),
            'alasan_status' => null,
            'photo' => $this->faker->boolean(50) ? 'photos/ppdb/'.$this->faker->uuid().'.jpg' : null,
            'bertindik' => false,
            'bertato' => false,
        ];
    }
}
