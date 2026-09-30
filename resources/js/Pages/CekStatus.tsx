import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
	CheckCircle2,
	ClipboardList,
	Hash,
	HelpCircle,
	Info,
	Search,
	School,
	User,
	XCircle,
} from "lucide-react";

interface Hasil {
	no_pendaftaran: string;
	nama_lengkap: string;
	asal_sekolah: string;
	diterima: number;
	alasan_status: string | null;
}

interface Props {
	hasil?: Hasil;
}

export default function CekStatusPage({ hasil }: Props) {
	const { errors } = usePage<any>().props;

	const { data, setData, post, processing, reset } = useForm({
		no_pendaftaran: "",
		tanggal_lahir: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("ppdb.cek.status.submit"), {
			onSuccess: () => reset("tanggal_lahir"),
		});
	};

	return (
		<>
			<Head title="Cek Status Pendaftaran | PPDB SDN Pangauban 02" />
			<Navbar />
			<main className="min-h-screen bg-gradient-to-b from-secondary via-background to-accent pt-24 pb-16">
				<div className="mx-auto w-full max-w-2xl px-4">
					<div className="mb-10 text-center">
						<div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
							<HelpCircle className="h-10 w-10 text-primary" />
						</div>
						<h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
							Cek Status Pendaftaran
						</h1>
						<p className="text-muted-foreground">
							Masukkan nomor pendaftaran dan tanggal lahir untuk melihat
							status pendaftaran Anda
						</p>
					</div>

					<Card className="w-full overflow-hidden rounded-3xl border-0 shadow-2xl shadow-primary/5">
						<CardHeader className="border-b bg-linear-gradient-to-r from-primary/5 to-accent/50">
							<CardTitle className="flex items-center gap-3 text-xl">
								<Search className="h-6 w-6 text-primary" />
								Cari Pendaftaran
							</CardTitle>
							<CardDescription>
								Nomor pendaftaran tercantum pada bukti pendaftaran Anda
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6 md:p-8">
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="no_pendaftaran">
										Nomor Pendaftaran <span className="text-destructive">*</span>
									</Label>
									<Input
										id="no_pendaftaran"
										placeholder="Contoh: SDNP02-001-09-26"
										value={data.no_pendaftaran}
										onChange={(e) =>
											setData("no_pendaftaran", e.target.value.toUpperCase())
										}
										aria-invalid={!!errors.no_pendaftaran}
									/>
									{errors.no_pendaftaran && (
										<p className="text-sm text-destructive">
											{errors.no_pendaftaran}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="tanggal_lahir">
										Tanggal Lahir <span className="text-destructive">*</span>
									</Label>
									<Input
										id="tanggal_lahir"
										type="date"
										value={data.tanggal_lahir}
										onChange={(e) => setData("tanggal_lahir", e.target.value)}
										aria-invalid={!!errors.tanggal_lahir}
									/>
									{errors.tanggal_lahir && (
										<p className="text-sm text-destructive">
											{errors.tanggal_lahir}
										</p>
									)}
								</div>
								<Button type="submit" disabled={processing} className="w-full">
									<Search className="mr-2 h-4 w-4" />
									{processing ? "Mencari..." : "Cek Status"}
								</Button>
							</form>

							{hasil && (
								<div className="mt-8 space-y-4 border-t pt-6">
									{hasil.diterima === 1 ? (
										<div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
											<div className="mb-3 flex items-center gap-2">
												<CheckCircle2 className="h-6 w-6 text-green-600" />
												<h2 className="text-lg font-bold text-green-700 dark:text-green-400">
													Selamat, Pendaftaran Diterima!
												</h2>
											</div>
											<p className="text-sm text-muted-foreground">
												Peserta dinyatakan <strong>DITERIMA</strong>. Silakan
												lakukan daftar ulang ke sekolah dengan membawa berkas
												persyaratan.
											</p>
										</div>
									) : hasil.diterima === 2 ? (
										<div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
											<div className="mb-3 flex items-center gap-2">
												<XCircle className="h-6 w-6 text-red-600" />
												<h2 className="text-lg font-bold text-red-700 dark:text-red-400">
													Pendaftaran Ditolak
												</h2>
											</div>
											<p className="mb-3 text-sm text-muted-foreground">
												Mohon maaf, pendaftaran peserta tidak dapat diterima
												dengan alasan berikut:
											</p>
											<div className="rounded-lg bg-background p-3 text-sm">
												{hasil.alasan_status || "Tidak ada keterangan."}
											</div>
										</div>
									) : (
										<div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5">
											<div className="mb-3 flex items-center gap-2">
												<ClipboardList className="h-6 w-6 text-yellow-600" />
												<h2 className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
													Masih Proses Seleksi
												</h2>
											</div>
											<p className="text-sm text-muted-foreground">
												Pendaftaran Anda sedang dalam proses seleksi oleh
												panitia. Silakan cek kembali di lain waktu.
											</p>
										</div>
									)}

									<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										<div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
											<Hash className="size-4 shrink-0 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">
													Nomor Pendaftaran
												</p>
												<p className="text-sm font-bold">
													{hasil.no_pendaftaran}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
											<User className="size-4 shrink-0 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">Nama</p>
												<p className="text-sm font-bold">
													{hasil.nama_lengkap}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 sm:col-span-2">
											<School className="size-4 shrink-0 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">
													Asal TK
												</p>
												<p className="text-sm font-bold">
													{hasil.asal_sekolah || "-"}
												</p>
											</div>
										</div>
									</div>

									<div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
										<Info className="mt-0.5 size-4 shrink-0" />
										<p>
											Ada pertanyaan? Hubungi panitia PPDB SDN Pangauban 02
											melalui nomor yang tertera di beranda.
										</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
			<Footer />
		</>
	);
}
