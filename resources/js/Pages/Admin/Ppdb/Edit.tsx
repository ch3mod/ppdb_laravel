import { RegistrationForm } from "@/components/registration-form";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";

interface Peserta {
	id: number;
	nama_lengkap: string;
	nama_panggilan: string;
	jenis_kelamin: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	agama: string;
	kewarganegaraan: string;
	anak_ke: number | null;
	jml_saudara_kandung: number | null;
	jml_saudara_tiri: number | null;
	jml_saudara_angkat: number | null;
	bahasa_sehari_hari: string;
	berat_badan: string;
	tinggi_badan: string;
	nik: string;
	alamat_lengkap: string;
	rt: string;
	rw: string;
	desa_kelurahan: string;
	kecamatan: string;
	kabupaten_kota: string;
	provinsi: string;
	kode_pos: string;
	tempat_tinggal: string;
	nisn: string;
	penerima_kip: string; // 'y' or 'n' or null
	no_kip: string;
	yatim_piatu: boolean;
	nama_ayah: string;
	pendidikan_ayah: string;
	no_hp_ayah: string;
	pekerjaan_ayah: string;
	nama_ibu: string;
	pendidikan_ibu: string;
	no_hp_ibu: string;
	pekerjaan_ibu: string;
	nama_wali: string;
	pendidikan_wali: string;
	hubungan_wali: string;
	pekerjaan_wali: string;
	asal_sekolah: string;
	tahun_lulus: string;
	asal_siswa: string;
	nama_tk: string;
	tk_lokasi: string;
	akademik: {
		kelas?: string;
		semester?: string;
		peringkat?: string;
	} | null;
	non_akademik: {
		jenis_lomba?: string;
		juara_ke?: string;
		juara_tingkat?: string;
	} | null;
	saran_dari: string;
}

interface Props {
	peserta: Peserta;
}

export default function Edit({ peserta }: Props) {
	const initialData = {
		nama_lengkap: peserta.nama_lengkap || "",
		nama_panggilan: peserta.nama_panggilan || "",
		jenis_kelamin: peserta.jenis_kelamin || "",
		tempat_lahir: peserta.tempat_lahir || "",
		tanggal_lahir: peserta.tanggal_lahir
			? format(new Date(peserta.tanggal_lahir), "yyyy-MM-dd")
			: "",
		agama: peserta.agama || "",
		kewarganegaraan: peserta.kewarganegaraan || "Indonesia",
		anak_ke: peserta.anak_ke?.toString() || "",
		jml_saudara_kandung: peserta.jml_saudara_kandung?.toString() || "",
		jml_saudara_tiri: peserta.jml_saudara_tiri?.toString() || "",
		jml_saudara_angkat: peserta.jml_saudara_angkat?.toString() || "",
		bahasa_sehari_hari: peserta.bahasa_sehari_hari || "",
		berat_badan: peserta.berat_badan || "",
		tinggi_badan: peserta.tinggi_badan || "",
		nik: peserta.nik || "",
		nisn: peserta.nisn || "",
		alamat_lengkap: peserta.alamat_lengkap || "",
		rt: peserta.rt || "",
		rw: peserta.rw || "",
		desa_kelurahan: peserta.desa_kelurahan || "",
		kecamatan: peserta.kecamatan || "",
		kabupaten_kota: peserta.kabupaten_kota || "",
		provinsi: peserta.provinsi || "",
		kode_pos: peserta.kode_pos || "",
		tempat_tinggal: peserta.tempat_tinggal || "",
		penerima_kip: peserta.penerima_kip === "y",
		no_kip: peserta.no_kip || "",
		yatim_piatu: !!peserta.yatim_piatu,

		// Data Orang Tua
		nama_ayah: peserta.nama_ayah || "",
		pendidikan_ayah: peserta.pendidikan_ayah || "",
		no_ayah: peserta.no_hp_ayah || "",
		pekerjaan_ayah: peserta.pekerjaan_ayah || "",
		nama_ibu: peserta.nama_ibu || "",
		pendidikan_ibu: peserta.pendidikan_ibu || "",
		no_ibu: peserta.no_hp_ibu || "",
		pekerjaan_ibu: peserta.pekerjaan_ibu || "",

		// Data Wali
		nama_wali: peserta.nama_wali || "",
		pendidikan_wali: peserta.pendidikan_wali || "",
		hubungan_wali: peserta.hubungan_wali || "",
		pekerjaan_wali: peserta.pekerjaan_wali || "",

		// Asal Mula Siswa
		asal_sekolah: peserta.asal_sekolah || "",
		tahun_lulus: peserta.tahun_lulus || "",
		asal_siswa: peserta.asal_siswa || "",
		nama_tk: peserta.nama_tk || "",
		tk_lokasi: peserta.tk_lokasi || "",

		// Prestasi
		peringkat:
			peserta.akademik?.kelas &&
			peserta.akademik?.semester &&
			peserta.akademik?.peringkat
				? `${peserta.akademik.kelas}/${peserta.akademik.semester}/${peserta.akademik.peringkat}`
				: "",
		jenis_lomba: peserta.non_akademik?.jenis_lomba || "",
		juara_ke: peserta.non_akademik?.juara_ke || "",
		juara_tingkat: peserta.non_akademik?.juara_tingkat || "",

		// Informasi
		saran_dari: peserta.saran_dari || "",
	};

	const handleDelete = () => {
		router.delete(route("ppdb.delete.peserta", peserta.id));
	};

	return (
		<>
			<Head title="Edit Peserta PPDB" />

			<div className="mx-auto max-w-7xl space-y-6">
				<RegistrationForm
					mode="admin"
					method="put"
					initialData={initialData}
					submitUrl={route("ppdb.edit.peserta", peserta.id)}
					showDelete={true}
					onDelete={handleDelete}
					title="Edit Data Pendaftar"
					description={`Mengedit data pendaftar: ${peserta.nama_lengkap}`}
				/>
			</div>
		</>
	);
}
