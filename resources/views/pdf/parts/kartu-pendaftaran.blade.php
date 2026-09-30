<!-- header -->
<div class="row p-1 px-3 m-1" style="border: 3px solid black; border-radius: 10px;">
    <div class="col-2 p-0">
        <img src="/img/logo.png" width="65%" height="75%" class="float-left" style="object-fit: contain;" />
    </div>

    <div class="col-10 p-0">
        <div class="text-center">
            <strong class="d-block" style="font-size: 14px;">FORMULIR PENDAFTARAN PESERTA DIDIK BARU</strong>
            <strong class="d-block" style="font-size: 12px;">SD NEGERI PANGAUBAN 02</strong>
            <span class="d-block" style="font-size: 12px;">Jl. Ceuri No. 32, Kec. Katapang, Kab. Bandung, Jawa Barat
                Jawa Tengah</span>
            <span style="font-size: 11px;">Penerimaan Peserta Didik Baru Kelas 1 (Lulusan TK/RA)</span>
        </div>
    </div>


</div>

<!-- header -->

<!-- heading -->
<div class="text-center">
    <strong style="font-weight: 900; font-size: 20px;">KARTU PENDAFTARAN SPMB TA
        {{ $peserta->created_at->format('Y') . '/' . $peserta->created_at->addYear()->format('Y') }}</strong>
</div>


<!-- table  -->

<table class="m-2" style="font-size: 16px;">
    <tr>
        <td class="p-1" width="37%">No. Pendaftaran</td>
        <td class="p-1" width="5%">:</td>
        <td class="">
            <span style="background-color: #059669; color: #FFFFFF; border: 2px solid #047857; border-radius: 5px; padding: 2px 5px; font-weight: bold; display: inline-block; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                {{ $peserta->no_pendaftaran }}
            </span>
        </td>
    </tr>
    <tr>
        <td class="p-1" width="37%">Nama Lengkap</td>
        <td class="p-1" width="5%">:</td>
        <td class="">{{ $peserta->nama_lengkap }}</td>
    </tr>
    <tr>
        <td class="p-1" width="37%">TTL</td>
        <td class="p-1" width="5%">:</td>
        <td class="">{{ $peserta->tempat_lahir }}, {{ $peserta->tanggal_lahir->translatedFormat('d F Y') }}</td>
    </tr>
    <tr>
        <td class="p-1" width="37%">Pendaftar</td>
        <td class="p-1" width="5%">:</td>
        <td class="">Kelas 1 SDN Pangauban 02</td>
    </tr>
</table>

<!-- photo adn ttd -->
<div class="row mt-2">
    <div class="col-md-6">
        <div
            style="width: 120px; height: 140px; border: 3px solid black; border-radius: 8px; margin: 5px; margin-left: 20px;">
        </div>
    </div>

    <div class="col-md-6 text-center">
        <span>Bandung, {{ $peserta->created_at->translatedFormat('d F Y') }}</span>
        <strong class="d-block" style="font-size: 16px;">Panitia Pendaftaran</strong>
        <div style="margin-top: 50px;">( {{ auth()->user()->name }} )</div>
    </div>
</div>
