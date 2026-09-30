<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePpdbSettingRequest;
use App\Models\PpdbSetting;

class PpdbSettingController extends Controller
{
    public function index()
    {
        $setting = PpdbSetting::latest()->first();

        return inertia('Admin/Settings/Ppdb', compact('setting'));
    }

    public function setBatasAkhir(UpdatePpdbSettingRequest $request)
    {
        $request->validated();

        $batas = PpdbSetting::latest()->first();

        // Create if not exists (handling edge case if table is empty, though view assumed it exists)
        if (! $batas) {
            $batas = PpdbSetting::create(['body' => []]);
        }

        $batas->update([
            'body' => [
                'batas_akhir_ppdb' => $request->input('batas_akhir_ppdb'),
                'no_surat' => $request->input('no_surat'),
                'hasil_seleksi' => $request->input('hasil_seleksi'),
                'email_kontak' => $request->input('email_kontak'),
                'no_telp' => $request->input('no_telp'),
                'alamat_sekolah' => $request->input('alamat_sekolah'),
                'jam_operasional' => $request->input('jam_operasional'),
            ],
        ]);

        session()->flash('success', 'Pengaturan PPDB telah di ubah');

        return back();
    }
}
