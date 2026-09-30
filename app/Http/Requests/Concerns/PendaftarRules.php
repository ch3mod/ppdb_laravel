<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Validation\Rule;

trait PendaftarRules
{
    /**
     * Shared validation rules for storing/updating a pendaftar.
     *
     * @return array<string, array<int, string>|string>
     */
    private function pendaftarRules(): array
    {
        return [
            // A. Keterangan Siswa
            'nama_lengkap' => 'required',
            'nama_panggilan' => 'nullable|max:100',
            'jenis_kelamin' => 'required',
            'tempat_lahir' => 'required',
            'tanggal_lahir' => 'required',
            'agama' => 'nullable|max:50',
            'kewarganegaraan' => 'nullable|max:50',
            'anak_ke' => 'nullable|integer|min:1',
            'jml_saudara_kandung' => 'nullable|integer|min:0',
            'jml_saudara_tiri' => 'nullable|integer|min:0',
            'jml_saudara_angkat' => 'nullable|integer|min:0',
            'bahasa_sehari_hari' => 'nullable|max:100',
            'berat_badan' => 'nullable|max:10',
            'tinggi_badan' => 'nullable|max:10',
            'golongan_darah' => 'nullable',
            'penyakit_diderita' => 'nullable|max:255',
            'nik' => 'required',
            'nisn' => 'nullable',
            'alamat_lengkap' => 'nullable',
            'dukuh' => 'nullable',
            'rt' => 'nullable',
            'rw' => 'nullable',
            'desa_kelurahan' => 'nullable',
            'kecamatan' => 'nullable',
            'kabupaten_kota' => 'nullable',
            'provinsi' => 'nullable',
            'kode_pos' => 'nullable',
            'tempat_tinggal' => 'nullable|max:100',
            'no_hp' => 'nullable',

            // B. Orang Tua / Wali
            'nama_ayah' => 'required',
            'pendidikan_ayah' => 'nullable|max:100',
            'no_ayah' => 'nullable',
            'pekerjaan_ayah' => 'nullable',
            'nama_ibu' => 'required',
            'pendidikan_ibu' => 'nullable|max:100',
            'no_ibu' => 'nullable',
            'pekerjaan_ibu' => 'nullable',
            'nama_wali' => 'nullable|max:255',
            'pendidikan_wali' => 'nullable|max:100',
            'hubungan_wali' => 'nullable|max:100',
            'pekerjaan_wali' => 'nullable|max:255',

            // C. Asal Mula Siswa
            'asal_sekolah' => [
                'nullable',
                Rule::requiredIf(function () {
                    return $this->input('masuk_sebagai') === 'siswa_baru'
                        && $this->input('asal_siswa') === 'taman_kanak_kanak';
                }),
            ],
            'tahun_lulus' => [
                'nullable',
                Rule::requiredIf(function () {
                    return $this->input('masuk_sebagai') === 'siswa_baru'
                        && $this->input('asal_siswa') === 'taman_kanak_kanak';
                }),
            ],
            'masuk_sebagai' => 'nullable|max:50',
            'asal_siswa' => 'nullable|max:100',
            'nama_tk' => 'nullable|max:255',
            'tk_lokasi' => 'nullable|max:255',
            'pindahan_sekolah' => 'nullable|max:255',
            'pindahan_lokasi' => 'nullable|max:255',
            'pindahan_tanggal' => 'nullable',
            'pindahan_kelas' => 'nullable|max:50',
            'diterima_tanggal' => 'nullable',
            'diterima_kelas' => 'nullable|max:50',

            // KIP / beasiswa / prestasi / info
            'penerima_kip' => 'nullable',
            'no_kip' => 'nullable',
            'yatim_piatu' => 'nullable|boolean',
            'peringkat' => 'nullable',
            'jenis_lomba' => 'nullable',
            'juara_ke' => 'nullable',
            'juara_tingkat' => 'nullable',
            'saran_dari' => 'nullable',
        ];
    }
}
