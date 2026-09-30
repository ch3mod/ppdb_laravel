<style>
    .registration-number {
        border-radius: 5px;
        display: inline-block;
        font-size: 20px;
        padding: 2px 5px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .registration-number-sdn {
        background-color: #059669;
        border: 2px solid #047857;
        color: #ffffff;
    }

    .section-title {
        font-weight: bolder;
        text-decoration: underline;
    }
</style>

<!-- header -->
<div class="row">
    <div class="col-2 p-0">
        <img src="/img/logo.png" width="80%" height="90%" class="float-left" style="object-fit: contain;" />
    </div>

    <div class="col-10 p-0">
        <div class="text-center">
            <strong class="d-block" style="font-size: 26px;">SD NEGERI PANGAUBAN 02</strong>
            <span class="d-block" style="font-size: 18px;">Jl. Ceuri No. 32, Kec. Katapang, Kab. Bandung, Jawa Barat</span>
            <span style="font-size: 18px;">Penerimaan Peserta Didik Baru Kelas 1</span>
        </div>
    </div>
</div>

<!-- hr -->
<hr style="border: 2px solid black;">
<div class="text-center">
    <strong style="font-weight: bolder; font-size: 22px;"> FORMULIR PENDAFTARAN PESERTA DIDIK BARU TAHUN AJARAN
        {{ $peserta->created_at->format('Y') }} / {{ $peserta->created_at->addYear()->format('Y') }} </strong>
</div>
<hr style="border: 2px solid black;">

<!-- identitas sekolah -->
<div class="float-right">
    <strong class="registration-number registration-number-sdn">{{ $peserta->no_pendaftaran }}</strong>
</div>

<table style="margin-left: 22px; font-size: 19px;" width="100%">
    <tr>
        <td width="33%">Nama Sekolah</td>
        <td width="1%">:</td>
        <td>SD NEGERI PANGAUBAN 02</td>
    </tr>
    <tr>
        <td>Status Sekolah</td>
        <td>:</td>
        <td>Negeri</td>
    </tr>
    <tr>
        <td>Desa/Kelurahan</td>
        <td>:</td>
        <td>Pangauban</td>
    </tr>
    <tr>
        <td>Kecamatan</td>
        <td>:</td>
        <td>Katapang</td>
    </tr>
    <tr>
        <td>Kab./Kodya DATI II</td>
        <td>:</td>
        <td>Bandung</td>
    </tr>
    <tr>
        <td>Provinsi DATI I</td>
        <td>:</td>
        <td>Jawa Barat</td>
    </tr>
</table>

<div class="mt-3" style="font-size: 19px; margin-left: 22px">

    {{-- A. Keterangan Siswa --}}
    <span class="section-title">A.</span> &ensp; <span class="section-title">Keterangan Siswa</span>
    <table style="margin-left: 32px;" width="100%">
        <tr>
            <td width="40%">1. &ensp; Nama Lengkap</td>
            <td width="1%">:</td>
            <td>{{ $peserta->nama_lengkap }}</td>
        </tr>
        <tr>
            <td>2. &ensp; Nama Panggilan</td>
            <td>:</td>
            <td>{{ $peserta->nama_panggilan }}</td>
        </tr>
        <tr>
            <td>3. &ensp; Jenis Kelamin</td>
            <td>:</td>
            <td>{{ $peserta->jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan' }}</td>
        </tr>
        <tr>
            <td>4. &ensp; Tempat / Tanggal Lahir</td>
            <td>:</td>
            <td>{{ $peserta->tempat_lahir }}, {{ $peserta->tanggal_lahir->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td>5. &ensp; Agama</td>
            <td>:</td>
            <td>{{ $peserta->agama }}</td>
        </tr>
        <tr>
            <td>6. &ensp; Kewarganegaraan</td>
            <td>:</td>
            <td>{{ $peserta->kewarganegaraan }}</td>
        </tr>
        <tr>
            <td>7. &ensp; Anak nomor ke</td>
            <td>:</td>
            <td>{{ $peserta->anak_ke }} (Dari Satu Ibu)</td>
        </tr>
        <tr>
            <td>8. &ensp; Banyak Saudara Kandung</td>
            <td>:</td>
            <td>{{ $peserta->jml_saudara_kandung }}</td>
        </tr>
        <tr>
            <td>9. &ensp; Banyak Saudara Tiri</td>
            <td>:</td>
            <td>{{ $peserta->jml_saudara_tiri }}</td>
        </tr>
        <tr>
            <td>10. &ensp; Banyak Saudara Angkat</td>
            <td>:</td>
            <td>{{ $peserta->jml_saudara_angkat }}</td>
        </tr>
        <tr>
            <td>11. &ensp; Bahasa Sehari-hari</td>
            <td>:</td>
            <td>{{ $peserta->bahasa_sehari_hari }}</td>
        </tr>
        <tr>
            <td>12. &ensp; Berat Badan</td>
            <td>:</td>
            <td>{{ $peserta->berat_badan ? $peserta->berat_badan . ' kg' : '' }}</td>
        </tr>
        <tr>
            <td>13. &ensp; Tinggi Badan</td>
            <td>:</td>
            <td>{{ $peserta->tinggi_badan ? $peserta->tinggi_badan . ' cm' : '' }}</td>
        </tr>
        <tr>
            <td>14. &ensp; Alamat dan Tempat Tinggal</td>
            <td>:</td>
            <td>
                {{ $peserta->alamat_lengkap }}
                @if ($peserta->tempat_tinggal)
                    , Bertempat tinggal pada:
                    @if ($peserta->tempat_tinggal == 'orang_tua')
                        Orang Tua
                    @elseif ($peserta->tempat_tinggal == 'saudara')
                        Saudara
                    @elseif ($peserta->tempat_tinggal == 'wali')
                        Wali
                    @elseif ($peserta->tempat_tinggal == 'menumpang')
                        Menumpang
                    @else
                        Asrama
                    @endif
                @endif
            </td>
        </tr>
    </table>

    {{-- B. Orang Tua / Wali --}}
    <span class="section-title">B.</span> &ensp; <span class="section-title">Orang Tua / Wali</span>
    <table style="margin-left: 32px;" width="100%">
        <tr>
            <td width="40%">18. &ensp; Nama - Ayah Kandung / Ibu Kandung</td>
            <td width="1%">:</td>
            <td>{{ $peserta->nama_ayah }} / {{ $peserta->nama_ibu }}</td>
        </tr>
        <tr>
            <td>19. &ensp; Pendidikan Tertinggi - Ayah / Ibu Kandung</td>
            <td>:</td>
            <td>{{ $peserta->pendidikan_ayah }} / {{ $peserta->pendidikan_ibu }}</td>
        </tr>
        <tr>
            <td>20. &ensp; Pekerjaan / Jabatan - Ayah / Ibu</td>
            <td>:</td>
            <td>{{ $peserta->pekerjaan_ayah }} / {{ $peserta->pekerjaan_ibu }}</td>
        </tr>
        @if ($peserta->nama_wali)
            <tr>
                <td>21. &ensp; Nama Wali Siswa</td>
                <td>:</td>
                <td>{{ $peserta->nama_wali }}</td>
            </tr>
            <tr>
                <td>22. &ensp; Pendidikan Tertinggi Wali</td>
                <td>:</td>
                <td>{{ $peserta->pendidikan_wali }}</td>
            </tr>
            <tr>
                <td>23. &ensp; Hubungan Terhadap Anak</td>
                <td>:</td>
                <td>{{ $peserta->hubungan_wali }}</td>
            </tr>
            <tr>
                <td>24. &ensp; Pekerjaan / Jabatan Wali</td>
                <td>:</td>
                <td>{{ $peserta->pekerjaan_wali }}</td>
            </tr>
        @endif
    </table>

    {{-- C. Asal Mula Siswa --}}
    <span class="section-title">C.</span> &ensp; <span class="section-title">Asal Mula Siswa</span>
    <table style="margin-left: 32px;" width="100%">
        <tr>
                <td>26a. &ensp; Asal Siswa</td>
                <td>:</td>
                <td>{{ $peserta->asal_siswa == 'rumah_tangga' ? 'Dari Rumah' : 'Taman Kanak-Kanak' }}</td>
            </tr>
            @if ($peserta->asal_siswa == 'taman_kanak_kanak')
                <tr>
                    <td>26b. &ensp; Asal TK</td>
                    <td>:</td>
                    <td>{{ $peserta->nama_tk ?: $peserta->asal_sekolah }}{{ $peserta->tk_lokasi ? ' di ' . $peserta->tk_lokasi : '' }}</td>
                </tr>
                <tr>
                    <td>26c. &ensp; Tahun Lulus</td>
                    <td>:</td>
                    <td>{{ $peserta->tahun_lulus }}</td>
                </tr>
            @endif
        <tr>
            <td>28. &ensp; Diterima di Sekolah Ini - Tanggal / Di Kelas</td>
            <td>:</td>
            <td>
                {{ $peserta->diterima_tanggal ? $peserta->diterima_tanggal->translatedFormat('d F Y') : '' }}
                / {{ $peserta->diterima_kelas }}
            </td>
        </tr>
    </table>

    {{-- D. Data Tambahan --}}
    <span class="section-title">D.</span> &ensp; <span class="section-title">Data Tambahan</span>
    <table style="margin-left: 32px;" width="100%">
        <tr>
            <td width="40%">29. &ensp; NIK</td>
            <td width="1%">:</td>
            <td>{{ $peserta->nik }}</td>
        </tr>
        <tr>
            <td>30. &ensp; NISN</td>
            <td>:</td>
            <td>{{ $peserta->nisn }}</td>
        </tr>
        <tr>
            <td>31. &ensp; Penerima KIP / No. KIP</td>
            <td>:</td>
            <td>{{ $peserta->penerima_kip == 'y' ? 'Ya / ' . $peserta->no_kip : 'Tidak' }}</td>
        </tr>
        <tr>
            <td>32. &ensp; Yatim Piatu</td>
            <td>:</td>
            <td>{{ $peserta->yatim_piatu ? 'Ya' : 'Tidak' }}</td>
        </tr>
        <tr>
            <td>33. &ensp; Saran Mendaftar Dari</td>
            <td>:</td>
            <td>{{ $peserta->saran_dari }}</td>
        </tr>
    </table>
</div>

<div class="row">
    <div class="col-8">
    </div>
    <div class="col-4">
        <div class="text-center mt-3 pr-8">
            <strong>Bandung, {{ $peserta->created_at->translatedFormat('d F Y') }}</strong>
        </div>
    </div>

    <div class="col-4 text-center"> Panitia SPMB</div>
    <div class="col-4 text-center float-right">
        <div
            style="border: 1px solid black;width:2.79cm;height:3.8cm; flex: content ;justify-content: end; align-items: center; float: right;">
            pas foto </div>
    </div>
    <div class="col-4 text-center"> Calon Peserta Didik </div>
    <div class="col-4 text-center"> ( {{ auth()->user()->name }} )</div>
    <div class="col-4 text-center"> </div>
    <div class="col-4 text-center"> ( {{ $peserta->nama_lengkap }} ) </div>
</div>
