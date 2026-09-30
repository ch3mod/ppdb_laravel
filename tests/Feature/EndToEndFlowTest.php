<?php

namespace Tests\Feature;

use App\Models\PesertaPPDB;
use App\Models\PpdbSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EndToEndFlowTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private array $registrantData;

    private string $pesertaId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'name' => 'Admin Utama',
            'niy' => '2222222',
            'password' => bcrypt('password'),
        ]);

        $this->registrantData = [
            'nama_lengkap' => 'Budi Santoso',
            'nama_panggilan' => 'Budi',
            'jenis_kelamin' => 'l',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '2020-03-15',
            'agama' => 'Islam',
            'kewarganegaraan' => 'Indonesia',
            'anak_ke' => 2,
            'jml_saudara_kandung' => 1,
            'jml_saudara_tiri' => 0,
            'jml_saudara_angkat' => 0,
            'bahasa_sehari_hari' => 'Sunda',
            'berat_badan' => '22',
            'tinggi_badan' => '115',
            'golongan_darah' => 'O',
            'penyakit_diderita' => '',
            'nik' => '3204121503200001',
            'alamat_lengkap' => 'Jl. Raya Katapang No. 10',
            'tempat_tinggal' => 'orang_tua',
            'no_hp' => '081234567890',
            'nama_ayah' => 'Ahmad Santoso',
            'pendidikan_ayah' => 'SMA/Sederajat',
            'pekerjaan_ayah' => 'Buruh',
            'no_ayah' => '081111222233',
            'nama_ibu' => 'Siti Santoso',
            'pendidikan_ibu' => 'SMP/Sederajat',
            'pekerjaan_ibu' => 'Ibu Rumah Tangga',
            'no_ibu' => '082233445566',
            'nama_wali' => '',
            'pendidikan_wali' => '',
            'hubungan_wali' => '',
            'pekerjaan_wali' => '',
            'asal_sekolah' => 'TK Pertiwi Katapang',
            'tahun_lulus' => 2026,
            'masuk_sebagai' => 'siswa_baru',
            'asal_siswa' => 'taman_kanak_kanak',
            'tk_lokasi' => 'Katapang',
            'sttb_tahun' => 2026,
            'sttb_nomor' => '',
            'lama_belajar' => '2',
            'saran_dari' => 'Tetangga',
            'penerima_kip' => '',
            'no_kip' => '',
            'yatim_piatu' => false,
            'peringkat' => '',
            'jenis_lomba' => '',
            'juara_ke' => '',
            'juara_tingkat' => '',
        ];
    }

    private function loginAsAdmin(): void
    {
        $this->post('/login', [
            'niy' => '2222222',
            'password' => 'password',
        ])->assertRedirect();
    }

    /**
     * Form data siap disimpan langsung ke DB (kolom DB yang asli),
     * bukan field form (no_ayah/no_ibu dipetakan controller jadi no_hp_ayah/no_hp_ibu,
     * peringkat → akademik, jenis_lomba → non_akademik).
     */
    private function dbRegistrantData(array $overrides = []): array
    {
        $data = array_merge($this->registrantData, $overrides);
        $data['no_hp_ayah'] = $data['no_ayah'] ?? '';
        $data['no_hp_ibu'] = $data['no_ibu'] ?? '';

        $peringkatParts = explode('/', (string) ($data['peringkat'] ?? ''));
        $data['akademik'] = [
            'kelas' => $peringkatParts[0] ?? '',
            'semester' => $peringkatParts[1] ?? '',
            'peringkat' => $peringkatParts[2] ?? '',
        ];

        $data['non_akademik'] = [
            'jenis_lomba' => $data['jenis_lomba'] ?? '',
            'juara_ke' => $data['juara_ke'] ?? '',
            'juara_tingkat' => $data['juara_tingkat'] ?? '',
        ];

        unset($data['no_ayah'], $data['no_ibu'], $data['peringkat'], $data['jenis_lomba'], $data['juara_ke'], $data['juara_tingkat']);

        return $data;
    }

    // ─────────────────────────────────────────────────────
    // 1. PUBLIC REGISTRATION
    // ─────────────────────────────────────────────────────

    public function test_1_pendaftaran_publik(): void
    {
        $response = $this->post('/register', $this->registrantData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $peserta = PesertaPPDB::where('nik', '3204121503200001')->first();
        $this->assertNotNull($peserta);
        $this->assertEquals('Budi Santoso', $peserta->nama_lengkap);
        $this->assertEquals('Budi', $peserta->nama_panggilan);
        $this->assertEquals('l', $peserta->jenis_kelamin);
        $this->assertEquals(0, $peserta->diterima);
        $this->assertNotNull($peserta->no_pendaftaran);
        $this->assertStringStartsWith('SDNP02-', $peserta->no_pendaftaran);

        $this->pesertaId = $peserta->id;
    }

    // ─────────────────────────────────────────────────────
    // 2. CEK STATUS SEBELUM DITERIMA
    // ─────────────────────────────────────────────────────

    public function test_2_cek_status_sebelum_diterima(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData());

        $response = $this->post('/cek-status', [
            'no_pendaftaran' => $peserta->no_pendaftaran,
            'tanggal_lahir' => '2020-03-15',
        ]);

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('CekStatus')
            ->where('hasil.diterima', 0)
            ->where('hasil.no_pendaftaran', $peserta->no_pendaftaran)
        );

        $this->pesertaId = $peserta->id;
    }

    public function test_2b_cek_status_data_tidak_ditemukan(): void
    {
        $response = $this->post('/cek-status', [
            'no_pendaftaran' => 'SDNP02-999-09-26',
            'tanggal_lahir' => '2020-01-01',
        ]);

        $response->assertSessionHasErrors('no_pendaftaran');
    }

    // ─────────────────────────────────────────────────────
    // 3. LOGIN ADMIN
    // ─────────────────────────────────────────────────────

    public function test_3_login_admin(): void
    {
        $response = $this->post('/login', [
            'niy' => '2222222',
            'password' => 'password',
        ]);

        $response->assertRedirect();
        $this->assertAuthenticatedAs($this->admin);
    }

    public function test_3b_login_admin_salah_password(): void
    {
        $response = $this->post('/login', [
            'niy' => '2222222',
            'password' => 'wrong_password',
        ]);

        $response->assertSessionHasErrors();
    }

    // ─────────────────────────────────────────────────────
    // 4. ADMIN DASHBOARD
    // ─────────────────────────────────────────────────────

    public function test_4_dashboard_admin(): void
    {
        PesertaPPDB::create($this->dbRegistrantData());

        $this->loginAsAdmin();

        $response = $this->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->has('stats')
            ->has('gender')
            ->has('monthlyTrend')
        );
    }

    // ─────────────────────────────────────────────────────
    // 5. LIST PENDAFTAR
    // ─────────────────────────────────────────────────────

    public function test_5_list_pendaftar(): void
    {
        PesertaPPDB::create($this->dbRegistrantData());

        $this->loginAsAdmin();

        $response = $this->get('/dashboard/ppdb/list-pendaftar');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Ppdb/ListPendaftar')
            ->has('pesertappdb')
        );
    }

    // ─────────────────────────────────────────────────────
    // 6. SHOW PESERTA
    // ─────────────────────────────────────────────────────

    public function test_6_show_peserta(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData());

        $this->loginAsAdmin();

        $response = $this->get("/dashboard/ppdb/show/{$peserta->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Ppdb/Show')
            ->where('peserta.nama_lengkap', 'Budi Santoso')
        );
    }

    // ─────────────────────────────────────────────────────
    // 7. EDIT PESERTA
    // ─────────────────────────────────────────────────────

    public function test_7_edit_peserta(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData());

        $this->loginAsAdmin();

        $response = $this->put("/dashboard/ppdb/edit/{$peserta->id}", array_merge($this->registrantData, [
            'nama_lengkap' => 'Budi Santoso Updated',
            'no_hp' => '089988776655',
        ]));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $peserta->refresh();
        $this->assertEquals('Budi Santoso Updated', $peserta->nama_lengkap);
    }

    // ─────────────────────────────────────────────────────
    // 8. VERIFIKASI BERKAS
    // ─────────────────────────────────────────────────────

    public function test_8_verifikasi_berkas(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData());

        $this->loginAsAdmin();

        $response = $this->post("/dashboard/ppdb/berkas/{$peserta->id}", [
            'berkas_akte' => true,
            'berkas_kk' => true,
            'berkas_ktp_ortu' => true,
            'berkas_ijazah' => false,
            'berkas_sktm_kip' => false,
        ]);

        $response->assertRedirect();

        $peserta->refresh();
        $this->assertTrue($peserta->berkas_akte);
        $this->assertTrue($peserta->berkas_kk);
        $this->assertTrue($peserta->berkas_ktp_ortu);
        $this->assertFalse($peserta->berkas_ijazah);
        $this->assertFalse($peserta->berkas_sktm_kip);
    }

    // ─────────────────────────────────────────────────────
    // 9. TERIMA PESERTA
    // ─────────────────────────────────────────────────────

    public function test_9_terima_peserta(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData([
            'diterima' => 0,
        ]));

        $this->loginAsAdmin();

        $response = $this->post("/dashboard/ppdb/daftar-ulang/{$peserta->id}", [
            'status' => 'y',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Peserta Diterima');

        $peserta->refresh();
        $this->assertEquals(1, $peserta->diterima);
    }

    public function test_9b_tolak_peserta(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData([
            'nik' => '3204121503200099',
            'diterima' => 0,
        ]));

        $this->loginAsAdmin();

        $response = $this->post("/dashboard/ppdb/daftar-ulang/{$peserta->id}", [
            'status' => 'n',
            'alasan' => 'Berkas tidak lengkap',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Peserta Ditolak');

        $peserta->refresh();
        $this->assertEquals(2, $peserta->diterima);
        $this->assertEquals('Berkas tidak lengkap', $peserta->alasan_status);
    }

    // ─────────────────────────────────────────────────────
    // 10. TAMBAH KWITANSI
    // ─────────────────────────────────────────────────────

    public function test_10_tambah_kwitansi(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData([
            'diterima' => 1,
        ]));

        $this->loginAsAdmin();

        $response = $this->post("/dashboard/kwitansi/tambah/{$peserta->id}", [
            'jenis_pembayaran' => 'Seragam',
            'nominal' => 150000,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Kwitansi Berhasil di Tambahkan');

        $peserta->refresh();
        $this->assertNotNull($peserta->kwitansi()->first());
        $this->assertEquals('Seragam', $peserta->kwitansi()->first()->jenis_pembayaran);
        $this->assertEquals(150000, $peserta->kwitansi()->first()->nominal);
    }

    // ─────────────────────────────────────────────────────
    // 11. UKURAN SERAGAM
    // ─────────────────────────────────────────────────────

    public function test_11_ubah_ukuran_seragam(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData([
            'diterima' => 1,
        ]));

        $this->loginAsAdmin();

        $response = $this->post('/dashboard/ukuran-seragam/ubah/seragam', [
            'uuid' => $peserta->id,
            'baju' => 'M',
            'sepatu' => '35',
            'baju_batik' => true,
            'seragam_olahraga' => true,
            'atribut' => false,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'data ukuran di ubah');

        $seragam = $peserta->ukuranSeragam;
        $this->assertNotNull($seragam);
        $this->assertEquals('M', $seragam->baju);
        $this->assertEquals('35', $seragam->sepatu);
        $this->assertTrue($seragam->baju_batik);
        $this->assertTrue($seragam->seragam_olahraga);
        $this->assertFalse($seragam->atribut);
    }

    // ─────────────────────────────────────────────────────
    // 12. LIST DAFTAR ULANG
    // ─────────────────────────────────────────────────────

    public function test_12_list_daftar_ulang(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData([
            'diterima' => 1,
        ]));
        $peserta->kwitansi()->create([
            'jenis_pembayaran' => 'Seragam',
            'nominal' => 150000,
            'user_id' => $this->admin->id,
        ]);

        $this->loginAsAdmin();

        $response = $this->get('/dashboard/ppdb/list/terdaftar-ulang');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Ppdb/ListDaftarUlang')
            ->has('pesertappdb')
        );
    }

    public function test_12b_list_belum_daftar_ulang(): void
    {
        PesertaPPDB::create($this->dbRegistrantData());

        $this->loginAsAdmin();

        $response = $this->get('/dashboard/ppdb/list/belum-daftar-ulang');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Ppdb/ListBelumDaftarUlang')
            ->has('pesertappdb')
        );
    }

    // ─────────────────────────────────────────────────────
    // 13. CEK STATUS SETELAH DITERIMA
    // ─────────────────────────────────────────────────────

    public function test_13_cek_status_setelah_diterima(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData([
            'diterima' => 1,
        ]));

        $response = $this->post('/cek-status', [
            'no_pendaftaran' => $peserta->no_pendaftaran,
            'tanggal_lahir' => '2020-03-15',
        ]);

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('CekStatus')
            ->where('hasil.diterima', 1)
        );
    }

    // ─────────────────────────────────────────────────────
    // 14. SURAT / FORMULIR / KARTU PENDAFTARAN PAGES
    // ─────────────────────────────────────────────────────

    public function test_14_surat_index_page(): void
    {
        $this->loginAsAdmin();

        $response = $this->get('/dashboard/surat/show');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Document/Index')
            ->where('title', 'Surat Diterima Peserta PPDB')
        );
    }

    public function test_14b_formulir_index_page(): void
    {
        $this->loginAsAdmin();

        $response = $this->get('/dashboard/formulir/show');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Document/Index')
            ->where('title', 'Formulir Pendaftaran Peserta PPDB')
        );
    }

    public function test_14c_kartu_pendaftaran_index_page(): void
    {
        $this->loginAsAdmin();

        $response = $this->get('/dashboard/kartu-pendaftaran/show');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Document/Index')
            ->where('title', 'Kartu Pendaftaran Peserta PPDB')
        );
    }

    // ─────────────────────────────────────────────────────
    // 15. BEASISWA PAGES
    // ─────────────────────────────────────────────────────

    public function test_15_beasiswa_kip_page(): void
    {
        PesertaPPDB::create($this->dbRegistrantData([
            'penerima_kip' => 'y',
        ]));

        $this->loginAsAdmin();

        $response = $this->get('/dashboard/beasiswa/kip');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Beasiswa/Index')
            ->where('jenis', 'kip')
        );
    }

    public function test_15b_beasiswa_yatim_piatu_page(): void
    {
        PesertaPPDB::create($this->dbRegistrantData([
            'yatim_piatu' => true,
            'tempat_tinggal' => 'wali',
            'nama_wali' => 'Pak Wali',
            'pendidikan_wali' => 'SMA',
            'hubungan_wali' => 'Paman',
            'pekerjaan_wali' => 'Pedagang',
        ]));

        $this->loginAsAdmin();

        $response = $this->get('/dashboard/beasiswa/yatim-piatu');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Beasiswa/Index')
            ->where('jenis', 'yatim-piatu')
        );
    }

    public function test_15c_beasiswa_akademik_page(): void
    {
        PesertaPPDB::create($this->dbRegistrantData([
            'peringkat' => '1/1/1',
        ]));

        $this->loginAsAdmin();

        $response = $this->get('/dashboard/beasiswa/akademik');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Beasiswa/Index')
            ->where('jenis', 'akademik')
        );
    }

    public function test_15d_beasiswa_non_akademik_page(): void
    {
        PesertaPPDB::create($this->dbRegistrantData([
            'jenis_lomba' => 'Lomba Tari',
            'juara_ke' => '1',
            'juara_tingkat' => 'Kabupaten',
        ]));

        $this->loginAsAdmin();

        $response = $this->get('/dashboard/beasiswa/non-akademik');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Beasiswa/Index')
            ->where('jenis', 'non-akademik')
        );
    }

    // ─────────────────────────────────────────────────────
    // 16. PROFILE SETTING
    // ─────────────────────────────────────────────────────

    public function test_16_update_profile(): void
    {
        $this->loginAsAdmin();

        $response = $this->put('/dashboard/setting/profile', [
            'name' => 'Admin Updated',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->admin->refresh();
        $this->assertEquals('Admin Updated', $this->admin->name);
    }

    // ─────────────────────────────────────────────────────
    // 17. PPDB SETTING
    // ─────────────────────────────────────────────────────

    public function test_17_update_ppdb_setting(): void
    {
        $this->loginAsAdmin();

        $response = $this->put('/dashboard/setting/ppdb', [
            'batas_akhir_ppdb' => '2026-09-30',
            'no_surat' => '001/PPDB/2026',
            'hasil_seleksi' => 'Lolos',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $setting = PpdbSetting::latest()->first();
        $this->assertNotNull($setting);
        $this->assertEquals('2026-09-30', $setting->body['batas_akhir_ppdb']);
        $this->assertEquals('001/PPDB/2026', $setting->body['no_surat']);
    }

    // ─────────────────────────────────────────────────────
    // 18. ADMIN TAMBAH PENDAFTAR
    // ─────────────────────────────────────────────────────

    public function test_18_admin_tambah_pendaftar(): void
    {
        $this->loginAsAdmin();

        $response = $this->post('/dashboard/ppdb/tambah-pendaftar', array_merge($this->registrantData, [
            'nik' => '3204121503200002',
            'nama_lengkap' => 'Siti Aminah',
        ]));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $peserta = PesertaPPDB::where('nik', '3204121503200002')->first();
        $this->assertNotNull($peserta);
        $this->assertEquals('Siti Aminah', $peserta->nama_lengkap);
    }

    // ─────────────────────────────────────────────────────
    // 19. HAPUS PESERTA
    // ─────────────────────────────────────────────────────

    public function test_19_hapus_peserta(): void
    {
        $peserta = PesertaPPDB::create($this->dbRegistrantData([
            'nik' => '3204121503200003',
        ]));

        $this->loginAsAdmin();

        $response = $this->delete("/dashboard/ppdb/delete/{$peserta->id}");

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Peserta telah dihapus');

        $this->assertSoftDeleted('peserta_ppdb', ['id' => $peserta->id]);
    }

    // ─────────────────────────────────────────────────────
    // 20. HALAMAN PUBLIK
    // ─────────────────────────────────────────────────────

    public function test_20_landing_page(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Landing'));
    }

    public function test_20b_register_page(): void
    {
        $response = $this->get('/register');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Pendaftaran'));
    }

    public function test_20c_cek_status_page(): void
    {
        $response = $this->get('/cek-status');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('CekStatus'));
    }

    // ─────────────────────────────────────────────────────
    // 21. UNAUTHENTICATED ACCESS
    // ─────────────────────────────────────────────────────

    public function test_21_admin_routes_require_auth(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
        $this->get('/dashboard/ppdb/list-pendaftar')->assertRedirect('/login');
    }

    // ─────────────────────────────────────────────────────
    // 22. FULL JOURNEY: DAFTAR → DITERIMA → KWITANSI → SERAGAM → CEK STATUS
    // ─────────────────────────────────────────────────────

    public function test_22_full_journey(): void
    {
        // Step 1: Public register
        $this->post('/register', $this->registrantData);
        $peserta = PesertaPPDB::where('nik', '3204121503200001')->first();
        $this->assertNotNull($peserta);
        $this->assertEquals(0, $peserta->diterima);

        // Step 2: Cek status → still pending
        $this->post('/cek-status', [
            'no_pendaftaran' => $peserta->no_pendaftaran,
            'tanggal_lahir' => '2020-03-15',
        ])->assertInertia(fn ($page) => $page->where('hasil.diterima', 0));

        // Step 3: Login as admin
        $this->loginAsAdmin();
        $this->assertAuthenticatedAs($this->admin);

        // Step 4: Admin dashboard shows 1 total
        $this->get('/dashboard')->assertInertia(
            fn ($page) => $page->where('stats.total', 1)
        );

        // Step 5: Verifikasi berkas
        $this->post("/dashboard/ppdb/berkas/{$peserta->id}", [
            'berkas_akte' => true,
            'berkas_kk' => true,
            'berkas_ktp_ortu' => true,
            'berkas_ijazah' => true,
            'berkas_sktm_kip' => true,
        ]);
        $peserta->refresh();
        $this->assertTrue($peserta->berkas_akte);

        // Step 6: Terima peserta
        $this->post("/dashboard/ppdb/daftar-ulang/{$peserta->id}", [
            'status' => 'y',
        ]);
        $peserta->refresh();
        $this->assertEquals(1, $peserta->diterima);

        // Step 7: Tambah kwitansi seragam
        $this->post("/dashboard/kwitansi/tambah/{$peserta->id}", [
            'jenis_pembayaran' => 'Seragam',
            'nominal' => 150000,
        ]);
        $this->assertNotNull($peserta->kwitansi()->first());

        // Step 8: Ubah ukuran seragam
        $this->post('/dashboard/ukuran-seragam/ubah/seragam', [
            'uuid' => $peserta->id,
            'baju' => 'S',
            'sepatu' => '33',
            'baju_batik' => true,
            'seragam_olahraga' => true,
            'atribut' => false,
        ]);
        $this->assertNotNull($peserta->ukuranSeragam);

        // Step 9: Cek status → diterima
        $this->post('/cek-status', [
            'no_pendaftaran' => $peserta->no_pendaftaran,
            'tanggal_lahir' => '2020-03-15',
        ])->assertInertia(fn ($page) => $page->where('hasil.diterima', 1));

        // Step 10: Dashboard shows 1 diterima, 1 daftar_ulang
        $this->get('/dashboard')->assertInertia(fn ($page) => $page
            ->where('stats.diterima', 1)
            ->where('stats.daftar_ulang', 1)
        );
    }
}
