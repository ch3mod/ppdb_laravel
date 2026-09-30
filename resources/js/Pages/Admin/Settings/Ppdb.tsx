import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, useForm, usePage } from "@inertiajs/react";

interface PpdbSetting {
	id: number;
	body: {
		batas_akhir_ppdb: string;
		no_surat: string;
		hasil_seleksi: string;
		email_kontak?: string;
		no_telp?: string;
		alamat_sekolah?: string;
		jam_operasional?: string;
	};
}

interface Props {
	setting: PpdbSetting;
}

export default function Ppdb({ setting }: Props) {
	const { data, setData, put, processing, errors } = useForm({
		batas_akhir_ppdb: setting?.body?.batas_akhir_ppdb || "",
		no_surat: setting?.body?.no_surat || "",
		hasil_seleksi: setting?.body?.hasil_seleksi || "",
		email_kontak: setting?.body?.email_kontak || "",
		no_telp: setting?.body?.no_telp || "",
		alamat_sekolah: setting?.body?.alamat_sekolah || "",
		jam_operasional: setting?.body?.jam_operasional || "",
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		put(route("ppdb.set.batas.akhir"));
	};

	const { flash } = usePage<any>().props;

	// Helper to format date for display (visual confirmation for user)
	const formatDate = (dateString: string) => {
		if (!dateString) return "-";
		try {
			// Check if format is dd-mm-yyyy (from inputmask)
			// The inputmask format is dd-mm-yyyy, but we might save it as such or parse it.
			// Assuming it's saved as string dd-mm-yyyy for now based on the previous controller logic.
			// Wait, the previous view used Carbon parse.
			// If the input is dd-mm-yyyy, Carbon might struggle if not configured for standard format.
			// Let's assume input is standard text for now.
			return dateString;
		} catch (e) {
			return dateString;
		}
	};

	return (
		<>
			<Head title="Pengaturan PPDB" />

			<div className="space-y-6 mx-auto max-w-7xl">
				<AlertMessages flash={flash} />

				<Card className="lg:min-w-3xl">
					<CardHeader>
						<CardTitle>Pengaturan PPDB</CardTitle>
						<CardDescription>
							Atur batas akhir pendaftaran, nomor surat, dan tanggal pengumuman.
						</CardDescription>
					</CardHeader>
					<form onSubmit={submit}>
						<CardContent className="space-y-4">
							<div className="gap-4 grid grid-cols-2 bg-muted mb-4 p-4 rounded">
								<div>
									<strong className="block font-medium text-sm">
										No. Surat
									</strong>
									<span className="text-sm">{data.no_surat || "-"}</span>
								</div>
								<div>
									<strong className="block font-medium text-sm">
								Batas Akhir PPDB
									</strong>
									<span className="text-sm">
										{data.batas_akhir_ppdb || "-"}
									</span>
								</div>
								<div>
									<strong className="block font-medium text-sm">
										Pengumuman Seleksi
									</strong>
									<span className="text-sm">{data.hasil_seleksi || "-"}</span>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="no_surat">No. Surat</Label>
								<Input
									id="no_surat"
									value={data.no_surat}
									onChange={(e) => setData("no_surat", e.target.value)}
									placeholder="No. Surat"
									required
								/>
								{errors.no_surat && (
									<div className="text-destructive text-sm">
										{errors.no_surat}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="batas_akhir_ppdb">
									Batas Akhir PPDB (dd-mm-yyyy)
								</Label>
								<Input
									id="batas_akhir_ppdb"
									value={data.batas_akhir_ppdb}
									onChange={(e) => setData("batas_akhir_ppdb", e.target.value)}
									placeholder="dd-mm-yyyy"
									required
								/>
								{errors.batas_akhir_ppdb && (
									<div className="text-red-500 text-sm">
										{errors.batas_akhir_ppdb}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="hasil_seleksi">
									Pengumuman Hasil Seleksi (dd-mm-yyyy)
								</Label>
								<Input
									id="hasil_seleksi"
									value={data.hasil_seleksi}
									onChange={(e) => setData("hasil_seleksi", e.target.value)}
									placeholder="dd-mm-yyyy"
									required
								/>
								{errors.hasil_seleksi && (
									<div className="text-red-500 text-sm">
										{errors.hasil_seleksi}
									</div>
								)}
							</div>

							<div className="border-t border-border pt-4">
								<h3 className="mb-1 font-semibold font-medium text-base">
									Kontak Sekolah
								</h3>
								<p className="mb-4 text-sm text-muted-foreground">
									Informasi kontak yang tampil di halaman website.
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email_kontak">Email</Label>
								<Input
									id="email_kontak"
									type="email"
									value={data.email_kontak}
									onChange={(e) => setData("email_kontak", e.target.value)}
									placeholder="contoh@sekolah.id"
								/>
								{errors.email_kontak && (
									<div className="text-red-500 text-sm">
										{errors.email_kontak}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="no_telp">No. HP/Telepon</Label>
								<Input
									id="no_telp"
									value={data.no_telp}
									onChange={(e) => setData("no_telp", e.target.value)}
									placeholder="08xx-xxxx-xxxx"
								/>
								{errors.no_telp && (
									<div className="text-red-500 text-sm">
										{errors.no_telp}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="alamat_sekolah">Alamat</Label>
								<Input
									id="alamat_sekolah"
									value={data.alamat_sekolah}
									onChange={(e) => setData("alamat_sekolah", e.target.value)}
									placeholder="Jl. Ceuri No. 32, Kec. Katapang, Kab. Bandung, Prov. Jawa Barat"
								/>
								{errors.alamat_sekolah && (
									<div className="text-red-500 text-sm">
										{errors.alamat_sekolah}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="jam_operasional">Jam Operasional</Label>
								<Input
									id="jam_operasional"
									value={data.jam_operasional}
									onChange={(e) => setData("jam_operasional", e.target.value)}
									placeholder="Senin - Sabtu: 07:00 - 13:00"
								/>
								{errors.jam_operasional && (
									<div className="text-red-500 text-sm">
										{errors.jam_operasional}
									</div>
								)}
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={processing}>
								{processing ? "Menyimpan..." : "Atur"}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</>
	);
}
