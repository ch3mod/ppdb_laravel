<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Http\Requests\StorePendaftarRequest;
use App\Http\Requests\UpdatePendaftarRequest;
use App\Http\Requests\UpdatePesertaStatusRequest;
use App\Models\PesertaPPDB;
use Illuminate\Http\Request;

class PendaftaranPPDB extends Controller
{
    public function listPendaftar(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListPendaftar', compact('pesertappdb', 'tahun', 'years'));
    }

    public function tambahPendaftar()
    {
        return inertia('Admin/Ppdb/Create');
    }

    public function submitPendaftar(StorePendaftarRequest $request)
    {
        PesertaPPDB::create($this->buildPesertaData($request));

        session()->flash('success', 'peserta ppdb di tambahkan');

        return back();
    }

    // show daftar ulang

    public function listDaftarUlang(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::has('kwitansi')
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListDaftarUlang', compact('pesertappdb', 'tahun', 'years'));
    }

    public function listBelumDaftarUlang(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::doesntHave('kwitansi')
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListBelumDaftarUlang', compact('pesertappdb', 'tahun', 'years'));
    }

    public function showPeserta($id)
    {
        $peserta = PesertaPPDB::findOrFail($id);

        return inertia('Admin/Ppdb/Show', compact('peserta'));
    }

    /*
    * Edit data peserta
    */
    public function edit($id)
    {
        $peserta = PesertaPPDB::findOrFail($id);

        return inertia('Admin/Ppdb/Edit', compact('peserta'));
    }

    public function update(UpdatePendaftarRequest $request, $id)
    {
        $data = $this->buildPesertaData($request);

        $ppdb = PesertaPPDB::findOrFail($id);

        $ppdb->update($data);

        session()->flash('success', 'Data peserta telah di ubah');

        return redirect()->route('ppdb.show.peserta', $ppdb->id);
    }

    // formulir section
    public function mendaftar(StorePendaftarRequest $request)
    {
        $ppdb = PesertaPPDB::create($this->buildPesertaData($request));

        $message = 'Terima kasih, anda berhasil mendaftar dengan nomor pendaftaran '.$ppdb->no_pendaftaran;

        session()->flash('success', $message);

        return redirect()->route('ppdb.register');
    }

    /*
     * Halaman cek status pendaftaran untuk pendaftar
     */
    public function cekStatus()
    {
        return inertia('CekStatus');
    }

    /*
     * Proses cek status pendaftaran via nomor pendaftaran + tanggal lahir
     */
    public function prosesCekStatus(Request $request)
    {
        $validated = $request->validate([
            'no_pendaftaran' => ['required'],
            'tanggal_lahir' => ['required', 'date_format:Y-m-d'],
        ], [
            'no_pendaftaran.required' => 'Nomor pendaftaran wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date_format' => 'Tanggal lahir tidak valid.',
        ]);

        $peserta = PesertaPPDB::where('no_pendaftaran', $validated['no_pendaftaran'])
            ->whereDate('tanggal_lahir', $validated['tanggal_lahir'])
            ->first();

        if (! $peserta) {
            return back()->withErrors([
                'no_pendaftaran' => 'Data pendaftar tidak ditemukan. Periksa kembali nomor pendaftaran dan tanggal lahir.',
            ]);
        }

        return inertia('CekStatus', [
            'hasil' => [
                'no_pendaftaran' => $peserta->no_pendaftaran,
                'nama_lengkap' => $peserta->nama_lengkap,
                'asal_sekolah' => $peserta->asal_sekolah,
                'diterima' => $peserta->diterima,
                'alasan_status' => $peserta->alasan_status,
            ],
        ]);
    }

    public function terimaPeserta(UpdatePesertaStatusRequest $request, $uuid)
    {
        $validated = $request->validated();

        $peserta = PesertaPPDB::with(['kwitansi'])->findOrFail($uuid);

        $peserta->diterima = $validated['status'] == 'y' ? 1 : 2;
        $peserta->alasan_status = $validated['status'] == 'y' ? null : $validated['alasan'];
        $peserta->save();

        $msg = $validated['status'] == 'y' ? 'Peserta Diterima' : 'Peserta Ditolak';

        session()->flash('success', $msg);

        return back();
    }

    public function updateBerkas(Request $request, $uuid)
    {
        $validated = $request->validate([
            'berkas_akte' => ['nullable', 'boolean'],
            'berkas_kk' => ['nullable', 'boolean'],
            'berkas_ktp_ortu' => ['nullable', 'boolean'],
            'berkas_ijazah' => ['nullable', 'boolean'],
            'berkas_sktm_kip' => ['nullable', 'boolean'],
        ]);

        $peserta = PesertaPPDB::findOrFail($uuid);
        $peserta->update($validated);

        return back();
    }

    public function hapusPeserta($uuid)
    {
        $peserta = PesertaPPDB::findOrFail($uuid);

        $peserta->delete();

        session()->flash('success', 'Peserta telah dihapus');

        return redirect()->route('ppdb.list.pendaftar');
    }

    /**
     * Build the PesertaPPDB attribute bag from a validated pendaftar request.
     *
     * @param  StorePendaftarRequest|UpdatePendaftarRequest  $request
     * @return array<string, mixed>
     */
    private function buildPesertaData($request): array
    {
        $data = $request->validated();

        $data['penerima_kip'] = $request->boolean('penerima_kip') ? 'y' : 'n';
        $data['yatim_piatu'] = $request->boolean('yatim_piatu') ? 1 : 0;

        $data['no_hp_ayah'] = $request->input('no_ayah');
        $data['no_hp_ibu'] = $request->input('no_ibu');

        // Gabungkan alamat jika alamat_lengkap tidak diisi
        if (empty($data['alamat_lengkap'])) {
            $alamatParts = array_filter([
                $data['rt'] || $data['rw'] ? "RT {$data['rt']} / RW {$data['rw']}" : '',
                $data['desa_kelurahan'],
                $data['kecamatan'],
                $data['kabupaten_kota'],
                $data['provinsi'],
                $data['kode_pos'] ? "Kode Pos {$data['kode_pos']}" : '',
            ]);

            $data['alamat_lengkap'] = implode(', ', $alamatParts);
        }

        $peringkatParts = explode('/', (string) $request->input('peringkat'));

        $data['akademik'] = [
            'kelas' => $peringkatParts[0] ?? '',
            'semester' => $peringkatParts[1] ?? '',
            'peringkat' => $peringkatParts[2] ?? '',
        ];

        $data['non_akademik'] = [
            'jenis_lomba' => $request->input('jenis_lomba') ?? '',
            'juara_ke' => $request->input('juara_ke') ?? '',
            'juara_tingkat' => $request->input('juara_tingkat') ?? '',
        ];

        // C. Asal Mula Siswa: asal_sekolah TK/RA dipakai sebagai nama TK
        if (empty($data['nama_tk']) && ! empty($data['asal_sekolah'])) {
            $data['nama_tk'] = $data['asal_sekolah'];
        }

        // Default masuk sebagai siswa baru TK
        if (empty($data['masuk_sebagai'])) {
            $data['masuk_sebagai'] = 'siswa_baru';
        }

        unset($data['peringkat'], $data['jenis_lomba'], $data['juara_ke'], $data['juara_tingkat'], $data['no_ayah'], $data['no_ibu']);

        return $data;
    }
}
