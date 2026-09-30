<?php

namespace App\Exports;

use App\Exports\Concerns\StyledExcelExport;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BeasiswaExport implements FromCollection, ShouldAutoSize, WithCustomStartCell, WithEvents, WithHeadings, WithMapping
{
    use StyledExcelExport;

    public $pesertappdb;

    protected $index = 0;

    public function __construct($pesertappdb)
    {
        $this->pesertappdb = $pesertappdb;
    }

    public function exportTitle(): string
    {
        return 'Data Penerima Beasiswa PPDB SDN Pangauban 02 Tahun '.now()->year;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        return $this->pesertappdb;
    }

    public function headings(): array
    {
        return [
            'No',
            'No. Pendaftaran',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Kelas',
            'Semester',
            'Peringkat',
            'Jenis Lomba',
            'Juara Ke',
            'Tingkat',
            'Penerima KIP',
            'No. KIP',
            'Yatim Piatu',
            'NIK',
            'Alamat Lengkap',
            'Asal TK',
        ];
    }

    public function map($row): array
    {
        $this->index++;

        $akademik = $row->akademik ?? [];
        $nonAkademik = $row->non_akademik ?? [];

        return [
            $this->index,
            $row->no_pendaftaran,
            $row->nama_lengkap,
            $row->jenis_kelamin === 'p' ? 'Perempuan' : 'Laki-laki',
            $row->tempat_lahir,
            $row->tanggal_lahir?->format('d F Y'),
            $akademik['kelas'] ?? '-',
            $akademik['semester'] ?? '-',
            $akademik['peringkat'] ?? '-',
            $nonAkademik['jenis_lomba'] ?? '-',
            $nonAkademik['juara_ke'] ?? '-',
            $nonAkademik['juara_tingkat'] ?? '-',
            $row->penerima_kip === 'y' ? 'Ya' : 'Tidak',
            $row->no_kip,
            $row->yatim_piatu ? 'Ya' : 'Tidak',
            '\''.$row->nik,
            $row->alamat_lengkap,
            $row->asal_sekolah,
        ];
    }
}
