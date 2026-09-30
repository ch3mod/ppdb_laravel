<?php

namespace Tests\Feature;

use App\Models\PesertaPPDB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormulirPendaftaranTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Data dasar pendaftaran lengkap dengan field formulir kertas.
     *
     * @return array<string, mixed>
     */
    private function formData(array $overrides = []): array
    {
        return array_merge([
            'nama_lengkap' => 'Ahmad Fauzi',
            'nama_panggilan' => 'Fauzi',
            'jenis_kelamin' => 'l',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '2020-05-10',
            'agama' => 'Islam',
            'kewarganegaraan' => 'Indonesia',
            'anak_ke' => 1,
            'jml_saudara_kandung' => 2,
            'jml_saudara_tiri' => 0,
            'jml_saudara_angkat' => 0,
            'bahasa_sehari_hari' => 'Indonesia',
            'berat_badan' => '20',
            'tinggi_badan' => '110',
            'golongan_darah' => 'A',
            'penyakit_diderita' => '',
            'nik' => '1234567890123456',
            'alamat_lengkap' => 'Jl. Ceuri No. 32',
            'tempat_tinggal' => 'orang_tua',
            'no_hp' => '08123456789',
            'nama_ayah' => 'Ayah Ahmad',
            'pendidikan_ayah' => 'S1',
            'pekerjaan_ayah' => 'Karyawan',
            'no_ayah' => '08111111111',
            'nama_ibu' => 'Ibu Ahmad',
            'pendidikan_ibu' => 'SMA/Sederajat',
            'pekerjaan_ibu' => 'Ibu Rumah Tangga',
            'no_ibu' => '08222222222',
            'nama_wali' => '',
            'pendidikan_wali' => '',
            'hubungan_wali' => '',
            'pekerjaan_wali' => '',
            'asal_sekolah' => 'TK PERTIWI KATAPANG',
            'tahun_lulus' => 2026,
            'masuk_sebagai' => 'siswa_baru',
            'asal_siswa' => 'taman_kanak_kanak',
            'tk_lokasi' => 'Katapang',
            'sttb_tahun' => 2026,
            'sttb_nomor' => '',
            'lama_belajar' => '2',
            'saran_dari' => 'Teman',
        ], $overrides);
    }

    public function test_pendaftaran_menyimpan_field_formulir_kertas(): void
    {
        $this->post('/register', $this->formData());

        $peserta = PesertaPPDB::where('nik', '1234567890123456')->first();

        $this->assertNotNull($peserta);
        $this->assertEquals('Fauzi', $peserta->nama_panggilan);
        $this->assertEquals('Islam', $peserta->agama);
        $this->assertEquals(1, $peserta->anak_ke);
        $this->assertEquals(2, $peserta->jml_saudara_kandung);
        $this->assertEquals('20', $peserta->berat_badan);
        $this->assertEquals('110', $peserta->tinggi_badan);
        $this->assertEquals('A', $peserta->golongan_darah);
        $this->assertEquals('orang_tua', $peserta->tempat_tinggal);
        $this->assertEquals('S1', $peserta->pendidikan_ayah);
        $this->assertEquals('SMA/Sederajat', $peserta->pendidikan_ibu);
        $this->assertEquals('siswa_baru', $peserta->masuk_sebagai);
        $this->assertEquals('TK PERTIWI KATAPANG', $peserta->nama_tk);
        $this->assertEquals(2026, (int) $peserta->sttb_tahun);
    }

    public function test_pendaftaran_pindahan_menyimpan_data_sekolah_asal(): void
    {
        $this->post('/register', $this->formData([
            'nik' => '9999999999999999',
            'masuk_sebagai' => 'pindahan',
            'pindahan_sekolah' => 'SDN Contoh 01',
            'pindahan_lokasi' => 'Bandung',
            'pindahan_tanggal' => '2026-07-01',
            'pindahan_kelas' => 'Kelas 1',
        ]));

        $peserta = PesertaPPDB::where('nik', '9999999999999999')->first();

        $this->assertNotNull($peserta);
        $this->assertEquals('pindahan', $peserta->masuk_sebagai);
        $this->assertEquals('SDN Contoh 01', $peserta->pindahan_sekolah);
        $this->assertEquals('Kelas 1', $peserta->pindahan_kelas);
    }

    public function test_pendaftaran_wali_opsional(): void
    {
        $this->post('/register', $this->formData([
            'nik' => '8888888888888888',
            'nama_wali' => 'Wali Ahmad',
            'pendidikan_wali' => 'SMP/Sederajat',
            'hubungan_wali' => 'Kakek',
            'pekerjaan_wali' => 'Petani',
        ]));

        $peserta = PesertaPPDB::where('nik', '8888888888888888')->first();

        $this->assertNotNull($peserta);
        $this->assertEquals('Wali Ahmad', $peserta->nama_wali);
        $this->assertEquals('Kakek', $peserta->hubungan_wali);
    }
}
