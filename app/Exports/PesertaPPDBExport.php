<?php

namespace App\Exports;

use App\Exports\Concerns\StyledExcelExport;
use App\Models\PesertaPPDB;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PesertaPPDBExport implements FromCollection, ShouldAutoSize, WithCustomStartCell, WithEvents, WithHeadings, WithMapping
{
    use StyledExcelExport;

    public $tahun;

    public $status;

    protected $index = 0;

    public function __construct($tahun, $status = 'semua')
    {
        $this->tahun = $tahun;
        $this->status = $status;
    }

    public function exportTitle(): string
    {
        return 'Data Peserta PPDB SDN Pangauban 02 Tahun '.$this->tahun;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        return PesertaPPDB::query()
            ->whereYear('created_at', $this->tahun)
            ->when($this->status === 'diterima', function ($query) {
                $query->whereDiterima(1);
            })
            ->when($this->status === 'sudah_du', function ($query) {
                $query->whereDiterima(1)->has('kwitansi');
            })
            ->when($this->status === 'belum_du', function ($query) {
                $query->doesntHave('kwitansi');
            })
            ->get();
    }

    // heading
    public function headings(): array
    {
        return [
            'No',
            'No. Pendaftaran',
            'Nama Lengkap',
            'Nama Panggilan',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Agama',
            'Kewarganegaraan',
            'Anak Ke',
            'Jml Saudara Kandung',
            'Jml Saudara Tiri',
            'Jml Saudara Angkat',
            'Bahasa Sehari-hari',
            'Berat Badan (kg)',
            'Tinggi Badan (cm)',
            'Tempat Tinggal',
            'NIK',
            'NISN',
            'Alamat Lengkap',
            'rt',
            'rw',
            'desa_kelurahan',
            'kecamatan',
            'kabupaten_kota',
            'provinsi',
            'kode_pos',
            'Asal TK',
            'Tahun Lulus',
            'Masuk Sebagai',
            'Penerima KIP',
            'No. KIP',
            'Yatim Piatu',
            'Nama Ayah',
            'Pendidikan Ayah',
            'Pekerjaan Ayah',
            'Nomor Telepon Ayah',
            'Nama Ibu',
            'Pendidikan Ibu',
            'Pekerjaan Ibu',
            'Nomor Telepon Ibu',
            'Nama Wali',
            'Hubungan Wali',
            'Pekerjaan Wali',
            'Akademik Kelas / Semster / Peringkat',
            'Non Akademik Jenis Lomba',
            'Non Akademik Juara ke',
            'Non Akademik Tingkat',
            'Saran Dari',
            'Status',
            'Alasan Status',
        ];
    }

    // map
    public function map($peserta): array
    {
        $this->index++;

        $akademik = $peserta->akademik ?? [];
        $nonAkademik = $peserta->non_akademik ?? [];

        $status = match ($peserta->diterima) {
            1 => 'Diterima',
            2 => 'Ditolak',
            default => 'Proses Seleksi',
        };

        $tempatTinggal = match ($peserta->tempat_tinggal) {
            'orang_tua' => 'Orang Tua',
            'saudara' => 'Saudara',
            'wali' => 'Wali',
            'menumpang' => 'Menumpang',
            'asrama' => 'Asrama',
            default => '',
        };

        return [
            $this->index,
            $peserta->no_pendaftaran,
            $peserta->nama_lengkap,
            $peserta->nama_panggilan,
            $peserta->jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan',
            $peserta->tempat_lahir,
            $peserta->tanggal_lahir->format('d F Y'),
            $peserta->agama,
            $peserta->kewarganegaraan,
            $peserta->anak_ke,
            $peserta->jml_saudara_kandung,
            $peserta->jml_saudara_tiri,
            $peserta->jml_saudara_angkat,
            $peserta->bahasa_sehari_hari,
            $peserta->berat_badan,
            $peserta->tinggi_badan,
            $tempatTinggal,
            '\''.$peserta->nik,
            '\''.$peserta->nisn,
            $peserta->alamat_lengkap,
            $peserta->rt,
            $peserta->rw,
            $peserta->desa_kelurahan,
            $peserta->kecamatan,
            $peserta->kabupaten_kota,
            $peserta->provinsi,
            $peserta->kode_pos,
            $peserta->asal_sekolah,
            $peserta->tahun_lulus,
            $peserta->masuk_sebagai == 'pindahan' ? 'Pindahan' : 'Siswa Baru',
            $peserta->penerima_kip == 'y' ? 'Ya' : 'Tidak',
            '\''.$peserta->no_kip,
            $peserta->yatim_piatu ? 'Ya' : 'Tidak',
            $peserta->nama_ayah,
            $peserta->pendidikan_ayah,
            $peserta->pekerjaan_ayah,
            '\''.$peserta->no_hp_ayah,
            $peserta->nama_ibu,
            $peserta->pendidikan_ibu,
            $peserta->pekerjaan_ibu,
            '\''.$peserta->no_hp_ibu,
            $peserta->nama_wali,
            $peserta->hubungan_wali,
            $peserta->pekerjaan_wali,
            ($akademik['kelas'] ?? '').' / '.($akademik['semester'] ?? '').' / '.($akademik['peringkat'] ?? ''),
            $nonAkademik['jenis_lomba'] ?? '',
            $nonAkademik['juara_ke'] ?? '',
            $nonAkademik['juara_tingkat'] ?? '',
            $peserta->saran_dari,
            $status,
            $peserta->alasan_status,
        ];
    }
}
