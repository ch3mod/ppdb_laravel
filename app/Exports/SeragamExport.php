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

class SeragamExport implements FromCollection, ShouldAutoSize, WithCustomStartCell, WithEvents, WithHeadings, WithMapping
{
    use StyledExcelExport;

    public $tahun;

    public $status;

    protected $index = 0;

    public function __construct($tahun, $status = 'diterima')
    {
        $this->tahun = $tahun;
        $this->status = $status;
    }

    public function exportTitle(): string
    {
        return 'Data Ukuran Seragam Peserta PPDB SDN Pangauban 02 Tahun '.$this->tahun;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        return PesertaPPDB::with('ukuranSeragam')
            ->whereYear('created_at', $this->tahun)
            ->when($this->status === 'sudah_du', function ($query) {
                return $query->whereDiterima(1)->has('kwitansi');
            })
            ->when($this->status === 'diterima', function ($query) {
                return $query->whereDiterima(1);
            })
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'No Pendaftaran',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tgl Lahir',
            'Baju',
            'Sepatu',
            'Baju Batik',
            'Seragam Olahraga',
            'Atribut',
        ];
    }

    public function map($row): array
    {
        $this->index++;

        return [
            $this->index,
            $row->no_pendaftaran,
            $row->nama_lengkap,
            $row->jenis_kelamin === 'p' ? 'Perempuan' : 'Laki-laki',
            $row->tempat_lahir,
            $row->tanggal_lahir?->format('d-m-Y'),
            $row->ukuranSeragam?->baju ?? '-',
            $row->ukuranSeragam?->sepatu ?? '-',
            ($row->ukuranSeragam?->baju_batik ?? false) ? 'Ya' : 'Tidak',
            ($row->ukuranSeragam?->seragam_olahraga ?? false) ? 'Ya' : 'Tidak',
            ($row->ukuranSeragam?->atribut ?? false) ? 'Ya' : 'Tidak',
        ];
    }
}
