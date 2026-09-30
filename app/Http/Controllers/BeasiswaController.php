<?php

namespace App\Http\Controllers;

use App\Exports\BeasiswaExport;
use App\Http\Requests\BeasiswaFilterRequest;
use App\Models\PesertaPPDB;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BeasiswaController extends Controller
{
    private function getKeteranganBeasiswa(string $jenis): string
    {
        return match ($jenis) {
            'akademik' => 'Beasiswa Akademik diberikan kepada calon peserta didik baru yang mempunyai Peringkat 1/2/3 pada waktu duduk di bangku SD/MI Sederajat. Dibuktikan raport asli/fotokopi yang dilegalisir oleh Kepala Sekolah SD/MI Asal. Peringkat I: 1,5 Tahun, Peringkat II: 1 Tahun, Peringkat III: 1 Semester.',
            'non-akademik' => 'Beasiswa Non Akademik diberikan kepada calon peserta didik baru yang mempunyai prestasi di bidang Non Akademik (Olahraga, Seni). Dibuktikan fotokopi Sertifikat/Piagam penghargaan. Juara I Kabupaten: 1,5 Tahun, Karesidenan: 2 Tahun, Provinsi: 3 Tahun.',
            'kip' => 'Beasiswa KIP diberikan kepada calon peserta didik baru yang merupakan penerima Kartu Indonesia Pintar (KIP). Dibuktikan dengan fotokopi kartu KIP.',
            'yatim-piatu' => 'Program Unit Pengumpulan Zakat (UPZ) Baznas ditujukan untuk bantuan siswa kurang mampu, santunan, bantuan pendidikan, dan kegiatan sosial.',
            default => '-',
        };
    }

    private function getJenisTitle(string $jenis): string
    {
        return match ($jenis) {
            'akademik' => 'Akademik',
            'non-akademik' => 'Non Akademik',
            'kip' => 'KIP',
            'yatim-piatu' => 'UPZ Baznas',
            default => '-',
        };
    }

    private function getInertiaProps(array $compact, string $jenis): array
    {
        return $compact + [
            'printSingleRoute' => 'ppdb.cetak.beasiswa',
            'printAllRoute' => 'ppdb.cetak.beasiswa.semua',
            'jenis' => $jenis,
            'defaultKeterangan' => $this->getKeteranganBeasiswa($jenis),
        ];
    }

    /**
     * @return Builder<PesertaPPDB>
     */
    private function baseBeasiswaQuery(BeasiswaFilterRequest $request, string $jenis)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $query = match ($jenis) {
            'akademik' => PesertaPPDB::query()
                ->where('akademik->kelas', '!=', '')
                ->where('akademik->semester', '!=', '')
                ->where('akademik->peringkat', '!=', ''),
            'non-akademik' => PesertaPPDB::query()
                ->where('non_akademik->jenis_lomba', '!=', '')
                ->where('non_akademik->juara_ke', '!=', '')
                ->where('non_akademik->juara_tingkat', '!=', ''),
            'kip' => PesertaPPDB::query()->where('penerima_kip', 'y'),
            'yatim-piatu' => PesertaPPDB::query()->whereYatimPiatu(1),
            default => null,
        };

        if (! $query) {
            abort(404);
        }

        return $query->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest();
    }

    public function beasiswaAkademik(BeasiswaFilterRequest $request)
    {
        return $this->renderBeasiswa($request, 'akademik', 'Beasiswa Akademik');
    }

    public function beasiswaNonAkademik(BeasiswaFilterRequest $request)
    {
        return $this->renderBeasiswa($request, 'non-akademik', 'Beasiswa Non Akademik');
    }

    public function beasiswaKip(BeasiswaFilterRequest $request)
    {
        return $this->renderBeasiswa($request, 'kip', 'Program Indonesia Pintar (PIP)');
    }

    public function beasiswaYatimPiatu(BeasiswaFilterRequest $request)
    {
        return $this->renderBeasiswa($request, 'yatim-piatu', 'Program UPZ Baznas');
    }

    /**
     * @return Response|BinaryFileResponse
     */
    private function renderBeasiswa(BeasiswaFilterRequest $request, string $jenis, string $title)
    {
        $tahun = $request->input('tahun', now()->year);

        $query = $this->baseBeasiswaQuery($request, $jenis);

        if ($request->has('export')) {
            $pesertappdb = $query->get();

            return Excel::download(new BeasiswaExport($pesertappdb), $tahun.'-beasiswa-'.str($jenis)->slug().'.xlsx');
        }

        $pesertappdb = $query->paginate($request->input('per_page', 10))->withQueryString();
        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Beasiswa/Index', $this->getInertiaProps(
            compact('pesertappdb', 'title', 'tahun', 'years'), $jenis
        ));
    }

    public function cetakBeasiswaSingle($uuid)
    {
        $peserta = PesertaPPDB::findOrFail($uuid);
        $jenis = request('jenis', $this->resolveJenis($peserta));
        $defaultKeterangan = $this->getKeteranganBeasiswa($jenis);
        $keterangan = request('keterangan', $defaultKeterangan);
        $user = auth()->user();

        return view('pdf.cetak-beasiswa', compact('peserta', 'keterangan', 'jenis', 'user'));
    }

    public function cetakBeasiswaSemua($jenis)
    {
        $query = match ($jenis) {
            'akademik' => PesertaPPDB::query()
                ->where('akademik->kelas', '!=', '')
                ->where('akademik->semester', '!=', '')
                ->where('akademik->peringkat', '!=', ''),
            'non-akademik' => PesertaPPDB::query()
                ->where('non_akademik->jenis_lomba', '!=', '')
                ->where('non_akademik->juara_ke', '!=', '')
                ->where('non_akademik->juara_tingkat', '!=', ''),
            'kip' => PesertaPPDB::query()->where('penerima_kip', 'y'),
            'yatim-piatu' => PesertaPPDB::query()->whereYatimPiatu(1),
            default => null,
        };

        if (! $query) {
            abort(404);
        }

        $pesertas = $query->whereYear('created_at', now()->year)->latest()->get();
        $defaultKeterangan = $this->getKeteranganBeasiswa($jenis);
        $keterangan = request('keterangan', $defaultKeterangan);
        $user = auth()->user();

        return view('pdf.cetak-beasiswa', compact('pesertas', 'keterangan', 'jenis', 'user'));
    }

    private function resolveJenis(PesertaPPDB $peserta): string
    {
        if ($peserta->penerima_kip === 'y') {
            return 'kip';
        }

        if ($peserta->yatim_piatu) {
            return 'yatim-piatu';
        }

        $akademik = $peserta->akademik ?? [];
        if (! empty($akademik['kelas']) && ! empty($akademik['semester']) && ! empty($akademik['peringkat'])) {
            return 'akademik';
        }

        $nonAkademik = $peserta->non_akademik ?? [];
        if (! empty($nonAkademik['jenis_lomba']) && ! empty($nonAkademik['juara_ke']) && ! empty($nonAkademik['juara_tingkat'])) {
            return 'non-akademik';
        }

        return 'akademik';
    }
}
