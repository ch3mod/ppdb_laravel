import { RegistrationForm } from "@/components/registration-form";
import { Head } from "@inertiajs/react";

export default function Create() {
	return (
		<>
			<Head title="Tambah Peserta PPDB" />

			<div className="mx-auto max-w-7xl space-y-6">
				<RegistrationForm
					mode="admin"
					submitUrl={route("ppdb.tambah.pendaftar")}
					title="Tambah Pendaftar Baru"
					description="Silahkan isi formulir pendaftaran peserta didik baru"
				/>
			</div>
		</>
	);
}
