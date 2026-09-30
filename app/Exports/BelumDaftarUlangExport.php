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

class BelumDaftarUlangExport implements FromCollection, ShouldAutoSize, WithCustomStartCell, WithEvents, WithHeadings, WithMapping
{
    use StyledExcelExport;

    protected $tahun;

    public function __construct($tahun = null)
    {
        $this->tahun = $tahun ?? now()->year;
    }

    public function exportTitle(): string
    {
        return 'Data Peserta Belum Daftar Ulang PPDB SDN Pangauban 02 Tahun '.$this->tahun;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        return PesertaPPDB::query()
            ->doesntHave('kwitansi')
            ->whereYear('created_at', $this->tahun)
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'No Pendaftaran',
            'Nama Lengkap',
            'Asal TK',
            'Tahun Lulus',
            'Status',
            'NIK',
            'Alamat Lengkap',
        ];
    }

    public function map($row): array
    {
        static $index = 0;
        $index++;

        return [
            $index,
            $row->no_pendaftaran,
            $row->nama_lengkap,
            $row->asal_sekolah,
            $row->tahun_lulus,
            $row->diterima == 1 ? 'Diterima' : ($row->diterima == 2 ? 'Ditolak' : 'Belum Diverifikasi'),
            '\''.$row->nik,
            $row->alamat_lengkap,
        ];
    }
}
