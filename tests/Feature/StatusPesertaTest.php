<?php

namespace Tests\Feature;

use App\Models\PesertaPPDB;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatusPesertaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create();
    }

    public function test_tolak_peserta_wajib_alasan(): void
    {
        $peserta = PesertaPPDB::factory()->create(['diterima' => 0]);

        $response = $this->actingAs($this->admin)
            ->post(route('ppdb.terima.peserta', $peserta->id), [
                'status' => 'n',
                'alasan' => '',
            ]);

        $response->assertSessionHasErrors('alasan');

        $peserta->refresh();
        $this->assertEquals(0, $peserta->diterima);
        $this->assertNull($peserta->alasan_status);
    }

    public function test_tolak_peserta_menyimpan_alasan(): void
    {
        $peserta = PesertaPPDB::factory()->create();

        $this->actingAs($this->admin)
            ->post(route('ppdb.terima.peserta', $peserta->id), [
                'status' => 'n',
                'alasan' => 'Berkas tidak lengkap',
            ]);

        $peserta->refresh();

        $this->assertEquals(2, $peserta->diterima);
        $this->assertEquals('Berkas tidak lengkap', $peserta->alasan_status);
    }

    public function test_terima_peserta_menghapus_alasan(): void
    {
        $peserta = PesertaPPDB::factory()->create([
            'diterima' => 2,
            'alasan_status' => 'Berkas tidak lengkap',
        ]);

        $this->actingAs($this->admin)
            ->post(route('ppdb.terima.peserta', $peserta->id), [
                'status' => 'y',
            ]);

        $peserta->refresh();

        $this->assertEquals(1, $peserta->diterima);
        $this->assertNull($peserta->alasan_status);
    }

    public function test_update_berkas_checklist(): void
    {
        $peserta = PesertaPPDB::factory()->create([
            'berkas_akte' => false,
            'berkas_kk' => false,
            'berkas_ktp_ortu' => false,
            'berkas_ijazah' => false,
            'berkas_sktm_kip' => false,
        ]);

        $this->actingAs($this->admin)
            ->post(route('ppdb.berkas.update', $peserta->id), [
                'berkas_akte' => true,
                'berkas_kk' => true,
            ]);

        $peserta->refresh();

        $this->assertTrue($peserta->berkas_akte);
        $this->assertTrue($peserta->berkas_kk);
        $this->assertFalse($peserta->berkas_ktp_ortu);
        $this->assertFalse($peserta->berkas_ijazah);
        $this->assertFalse($peserta->berkas_sktm_kip);
    }

    public function test_cek_status_menampilkan_alasan(): void
    {
        $peserta = PesertaPPDB::factory()->create([
            'diterima' => 2,
            'alasan_status' => 'Kuota penuh',
        ]);

        $response = $this->post(route('ppdb.cek.status.submit'), [
            'no_pendaftaran' => $peserta->no_pendaftaran,
            'tanggal_lahir' => $peserta->tanggal_lahir->format('Y-m-d'),
        ]);

        $response->assertInertia(fn ($page) => $page
            ->component('CekStatus')
            ->where('hasil.alasan_status', 'Kuota penuh')
            ->where('hasil.diterima', 2));
    }

    public function test_cek_status_data_tidak_ditemukan(): void
    {
        $response = $this->post(route('ppdb.cek.status.submit'), [
            'no_pendaftaran' => 'SDNP02-999-09-26',
            'tanggal_lahir' => '2020-01-01',
        ]);

        $response->assertSessionHasErrors('no_pendaftaran');
    }
}
