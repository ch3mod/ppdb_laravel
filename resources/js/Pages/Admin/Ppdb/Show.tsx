import { AlertMessages } from "@/components/alert-messages";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/date";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
	Award,
	Baby,
	CheckCircle2,
	ClipboardList,
	GraduationCap,
	Hash,
	HeartHandshake,
	Home,
	IdCard,
	Languages,
	MapPin,
	Medal,
	Pencil,
	Phone,
	School,
	ShieldCheck,
	ArrowLeftRight,
	Trophy,
	User,
	UserCircle,
	Users,
	Weight,
	XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface Peserta {
	id: string;
	no_pendaftaran: string;
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
	golongan_darah: string;
	penyakit_diderita: string;
	nik: string;
	alamat_lengkap: string;
	dukuh: string;
	rt: string;
	rw: string;
	desa_kelurahan: string;
	kecamatan: string;
	kabupaten_kota: string;
	provinsi: string;
	kode_pos: string;
	tempat_tinggal: string;
	asal_sekolah: string;
	tahun_lulus: string;
	masuk_sebagai: string;
	asal_siswa: string;
	nama_tk: string;
	tk_lokasi: string;
	pindahan_sekolah: string;
	pindahan_lokasi: string;
	pindahan_tanggal: string;
	pindahan_kelas: string;
	nisn: string;
	penerima_kip: string;
	no_kip: string;
	no_hp: string;
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
	diterima: number;
	alasan_status: string | null;
	berkas_akte: boolean;
	berkas_kk: boolean;
	berkas_ktp_ortu: boolean;
	berkas_ijazah: boolean;
	berkas_sktm_kip: boolean;
}

interface Props {
	peserta: Peserta;
}

function StatusBadge({ status }: { status: number }) {
	switch (status) {
		case 1:
			return (
				<Badge className="bg-green-500 hover:bg-green-600">
					<CheckCircle2 className="size-3.5" />
					Diterima
				</Badge>
			);
		case 2:
			return (
				<Badge variant="destructive">
					<XCircle className="size-3.5" />
					Ditolak
				</Badge>
			);
		default:
			return (
				<Badge
					variant="secondary"
					className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-400"
				>
					<ClipboardList className="size-3.5" />
					Proses Seleksi
				</Badge>
			);
	}
}

function InfoItem({
	icon: Icon,
	label,
	value,
}: {
	icon?: LucideIcon;
	label: string;
	value: ReactNode;
}) {
	return (
		<div className="flex min-w-0 gap-2.5 rounded-md border border-transparent bg-muted/40 px-3 py-2.5">
			{Icon ? (
				<div className="mt-0.5 shrink-0 text-muted-foreground">
					<Icon className="size-4" />
				</div>
			) : null}
			<div className="min-w-0 space-y-0.5">
				<p className="text-xs font-medium text-muted-foreground">{label}</p>
				<div className="truncate text-sm font-medium leading-snug break-words whitespace-normal">
					{value || "-"}
				</div>
			</div>
		</div>
	);
}

function SectionCard({
	icon: Icon,
	title,
	description,
	children,
	className,
}: {
	icon: LucideIcon;
	title: string;
	description?: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<Card className={className}>
			<CardHeader className="border-b pb-4">
				<div className="flex items-start gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Icon className="size-4" />
					</div>
					<div className="min-w-0 space-y-1">
						<CardTitle className="text-base">{title}</CardTitle>
						{description ? (
							<CardDescription>{description}</CardDescription>
						) : null}
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>
			</CardContent>
		</Card>
	);
}

export default function Show({ peserta }: Props) {
	const { flash } = usePage<any>().props;
	const [alasanTolak, setAlasanTolak] = useState("");

	const handleStatusChange = (status: "y" | "n") => {
		router.post(route("ppdb.terima.peserta", { uuid: peserta.id }), {
			status,
			alasan: status === "n" ? alasanTolak : undefined,
		});
	};

	const handleBerkasChange = (field: string, checked: boolean) => {
		router.post(
			route("ppdb.berkas.update", { uuid: peserta.id }),
			{ [field]: checked },
			{
				preserveScroll: true,
				only: ["peserta", "flash"],
			},
		);
	};

	const berkasList = [
		{ field: "berkas_akte", label: "Fc Akte Kelahiran", value: peserta.berkas_akte },
		{ field: "berkas_kk", label: "Fc Kartu Keluarga", value: peserta.berkas_kk },
		{ field: "berkas_ktp_ortu", label: "Fc KTP Orang Tua", value: peserta.berkas_ktp_ortu },
		{ field: "berkas_ijazah", label: "Fc Ijazah TK/PAUD", value: peserta.berkas_ijazah },
		{ field: "berkas_sktm_kip", label: "Fc SKTM/KIP", value: peserta.berkas_sktm_kip },
	];

	return (
		<>
			<Head title={peserta.nama_lengkap} />

			<div className="mx-auto max-w-7xl space-y-6">
				<AlertMessages flash={flash} />

				{/* Header */}
				<Card>
					<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex min-w-0 items-start gap-3">
							<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<UserCircle className="size-6" />
							</div>
							<div className="min-w-0 space-y-1.5">
								<div className="flex flex-wrap items-center gap-2">
									<CardTitle className="text-xl">
										{peserta.nama_lengkap}
									</CardTitle>
									<StatusBadge status={peserta.diterima} />
								</div>
								<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
									<span className="inline-flex items-center gap-1.5">
										<Hash className="size-3.5" />
										{peserta.no_pendaftaran}
									</span>
									<span className="inline-flex items-center gap-1.5">
										<School className="size-3.5" />
										{peserta.asal_sekolah || "-"}
									</span>
								</div>
							</div>
						</div>
						<Button asChild className="w-full sm:w-auto">
							<Link href={route("ppdb.edit.peserta", peserta.id)}>
								<Pencil className="size-4" />
								Edit
							</Link>
						</Button>
					</CardHeader>
				</Card>

				{/* Content grid */}
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<SectionCard
						icon={User}
						title="Identitas Diri"
						description="Data pribadi peserta"
					>
						<InfoItem
							icon={Hash}
							label="No. Pendaftaran"
							value={<strong>{peserta.no_pendaftaran}</strong>}
						/>
						<InfoItem
							icon={User}
							label="Nama Lengkap"
							value={peserta.nama_lengkap}
						/>
						<InfoItem
							icon={UserCircle}
							label="Jenis Kelamin"
							value={
								peserta.jenis_kelamin === "l" ? "Laki-laki" : "Perempuan"
							}
						/>
					<InfoItem
						icon={IdCard}
						label="Tempat, Tanggal Lahir"
						value={`${peserta.tempat_lahir}, ${formatDate(peserta.tanggal_lahir)}`}
					/>
					<InfoItem icon={User} label="Nama Panggilan" value={peserta.nama_panggilan} />
					<InfoItem icon={IdCard} label="Agama" value={peserta.agama} />
					<InfoItem
						icon={IdCard}
						label="Kewarganegaraan"
						value={peserta.kewarganegaraan}
					/>
					<InfoItem
						icon={IdCard}
						label="Anak Ke (dari satu ibu)"
						value={peserta.anak_ke}
					/>
					<InfoItem icon={IdCard} label="NIK" value={peserta.nik} />
					<InfoItem icon={IdCard} label="NISN" value={peserta.nisn} />
				</SectionCard>

					<SectionCard
						icon={Baby}
						title="Data Tambahan Siswa"
						description="Keterangan tambahan formulir"
					>
						<InfoItem
							icon={Users}
							label="Jml Saudara Kandung"
							value={peserta.jml_saudara_kandung}
						/>
						<InfoItem
							icon={Users}
							label="Jml Saudara Tiri"
							value={peserta.jml_saudara_tiri}
						/>
						<InfoItem
							icon={Users}
							label="Jml Saudara Angkat"
							value={peserta.jml_saudara_angkat}
						/>
						<InfoItem
							icon={Languages}
							label="Bahasa Sehari-hari"
							value={peserta.bahasa_sehari_hari}
						/>
						<InfoItem icon={Weight} label="Berat Badan" value={peserta.berat_badan ? `${peserta.berat_badan} kg` : ""} />
						<InfoItem icon={Weight} label="Tinggi Badan" value={peserta.tinggi_badan ? `${peserta.tinggi_badan} cm` : ""} />
						<InfoItem
							icon={Home}
							label="Bertempat Tinggal Pada"
							value={
								peserta.tempat_tinggal === "orang_tua"
									? "Orang Tua"
									: peserta.tempat_tinggal === "saudara"
										? "Saudara"
										: peserta.tempat_tinggal === "wali"
											? "Wali"
											: peserta.tempat_tinggal === "menumpang"
												? "Menumpang"
												: peserta.tempat_tinggal === "asrama"
													? "Asrama"
													: ""
							}
						/>
					</SectionCard>

					<SectionCard
						icon={MapPin}
						title="Alamat"
						description="Domisili peserta"
					>
						<InfoItem
							icon={Home}
							label="Alamat Jalan"
							value={peserta.alamat_lengkap}
						/>
						<InfoItem icon={Hash} label="RT" value={peserta.rt} />
						<InfoItem icon={Hash} label="RW" value={peserta.rw} />
						<InfoItem
							icon={MapPin}
							label="Desa/Kelurahan"
							value={peserta.desa_kelurahan}
						/>
						<InfoItem
							icon={MapPin}
							label="Kecamatan"
							value={peserta.kecamatan}
						/>
						<InfoItem
							icon={MapPin}
							label="Kabupaten/Kota"
							value={peserta.kabupaten_kota}
						/>
						<InfoItem
							icon={MapPin}
							label="Provinsi"
							value={peserta.provinsi}
						/>
						<InfoItem
							icon={Hash}
							label="Kode Pos"
							value={peserta.kode_pos}
						/>
					</SectionCard>

				<SectionCard
					icon={Users}
					title="Identitas Orang Tua"
					description="Data ayah dan ibu"
				>
					<InfoItem
						icon={User}
						label="Nama Ayah"
						value={peserta.nama_ayah}
					/>
					<InfoItem
						icon={ClipboardList}
						label="Pekerjaan Ayah"
						value={peserta.pekerjaan_ayah}
					/>
					<InfoItem
						icon={GraduationCap}
						label="Pendidikan Ayah"
						value={peserta.pendidikan_ayah}
					/>
					<InfoItem
						icon={Phone}
						label="No. HP Ayah"
						value={peserta.no_hp_ayah}
					/>
					<InfoItem icon={User} label="Nama Ibu" value={peserta.nama_ibu} />
					<InfoItem
						icon={ClipboardList}
						label="Pekerjaan Ibu"
						value={peserta.pekerjaan_ibu}
					/>
					<InfoItem
						icon={GraduationCap}
						label="Pendidikan Ibu"
						value={peserta.pendidikan_ibu}
					/>
					<InfoItem
						icon={Phone}
						label="No. HP Ibu"
						value={peserta.no_hp_ibu}
					/>
					{peserta.nama_wali ? (
						<>
							<InfoItem icon={User} label="Nama Wali" value={peserta.nama_wali} />
							<InfoItem
								icon={User}
								label="Hubungan Wali"
								value={peserta.hubungan_wali}
							/>
							<InfoItem
								icon={GraduationCap}
								label="Pendidikan Wali"
								value={peserta.pendidikan_wali}
							/>
							<InfoItem
								icon={ClipboardList}
								label="Pekerjaan Wali"
								value={peserta.pekerjaan_wali}
							/>
						</>
					) : null}
				</SectionCard>

				<SectionCard
					icon={ArrowLeftRight}
					title="Asal Mula Siswa"
					description="Asal siswa sebelum masuk sekolah"
				>
					<InfoItem
						icon={School}
						label="Asal Siswa"
						value={
							peserta.asal_siswa === "rumah_tangga"
								? "Dari Rumah"
								: peserta.asal_siswa === "taman_kanak_kanak"
									? "Taman Kanak-Kanak"
									: ""
						}
					/>
					{peserta.asal_siswa === "taman_kanak_kanak" ? (
						<>
							<InfoItem
								icon={School}
								label="Asal TK"
								value={peserta.asal_sekolah || peserta.nama_tk}
							/>
							<InfoItem
								icon={Award}
								label="Tahun Lulus"
								value={peserta.tahun_lulus}
							/>
						</>
					) : null}
					{peserta.asal_siswa === "taman_kanak_kanak" ? (
						<InfoItem
							icon={MapPin}
							label="Lokasi TK"
							value={peserta.tk_lokasi}
						/>
					) : null}
				</SectionCard>

					<SectionCard
						icon={ShieldCheck}
						title="KIP & Beasiswa"
						description="Bantuan biaya pendidikan"
					>
						<InfoItem
							icon={IdCard}
							label="Penerima KIP"
							value={
								peserta.penerima_kip === "y"
									? "Penerima KIP/PIP"
									: "Bukan penerima KIP/PIP"
							}
						/>
						<InfoItem icon={Hash} label="No. KIP" value={peserta.no_kip} />
						<InfoItem
							icon={HeartHandshake}
							label="UPZ Baznas"
							value={peserta.yatim_piatu ? "Ya" : "Tidak"}
						/>
					</SectionCard>

					<SectionCard
						icon={Award}
						title="Beasiswa Akademik"
						description="Prestasi akademik"
					>
						<InfoItem
							icon={ClipboardList}
							label="Kelas"
							value={peserta.akademik?.kelas}
						/>
						<InfoItem
							icon={ClipboardList}
							label="Semester"
							value={peserta.akademik?.semester}
						/>
						<InfoItem
							icon={Medal}
							label="Peringkat"
							value={peserta.akademik?.peringkat}
						/>
					</SectionCard>

					<SectionCard
						icon={Trophy}
						title="Beasiswa Non Akademik"
						description="Prestasi lomba"
					>
						<InfoItem
							icon={Trophy}
							label="Jenis Lomba"
							value={peserta.non_akademik?.jenis_lomba}
						/>
						<InfoItem
							icon={Medal}
							label="Juara Ke"
							value={peserta.non_akademik?.juara_ke}
						/>
						<InfoItem
							icon={Award}
							label="Juara Tingkat"
							value={peserta.non_akademik?.juara_tingkat}
						/>
					</SectionCard>

					{/* Status + actions spans full width on large screens when alone, or sits in grid */}
					<Card className="lg:col-span-2">
						<CardHeader className="border-b pb-4">
							<div className="flex items-start gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<ClipboardList className="size-4" />
								</div>
								<div className="space-y-1">
									<CardTitle className="text-base">
										Status Penerimaan
									</CardTitle>
									<CardDescription>
										Kelola keputusan seleksi peserta
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					<CardContent className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2 lg:grid-cols-3">
						<InfoItem
							icon={CheckCircle2}
							label="Penerimaan"
							value={<StatusBadge status={peserta.diterima} />}
						/>
						<InfoItem
							icon={User}
							label="Saran Dari"
							value={peserta.saran_dari}
						/>
						<InfoItem
							icon={XCircle}
							label="Alasan Penolakan"
							value={peserta.alasan_status || "-"}
						/>
					</CardContent>

					{/* Checklist verifikasi berkas */}
					<CardContent className="pt-0">
						<div className="rounded-xl border bg-muted/30 p-4">
							<p className="mb-3 text-sm font-semibold">
								Verifikasi Kelengkapan Berkas
							</p>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{berkasList.map((berkas) => (
									<label
										key={berkas.field}
										className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
									>
										<Checkbox
											checked={berkas.value}
											onCheckedChange={(checked) =>
												handleBerkasChange(berkas.field, checked === true)
											}
										/>
										<span>{berkas.label}</span>
									</label>
								))}
							</div>
						</div>
					</CardContent>
						<CardFooter className="flex flex-col items-stretch gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-sm text-muted-foreground">
								Peserta yang dinyatakan diterima melakukan daftar ulang di menu
								kwitansi.
							</p>
							<div className="flex shrink-0 gap-2">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
											<CheckCircle2 className="size-4" />
											Terima
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Terima Peserta?</AlertDialogTitle>
											<AlertDialogDescription>
												Apakah Anda yakin ingin menerima peserta ini?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Batal</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => handleStatusChange("y")}
												className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
											>
												Terima
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive">
											<XCircle className="size-4" />
											Tolak
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Tolak Peserta?</AlertDialogTitle>
											<AlertDialogDescription>
												Apakah Anda yakin ingin menolak peserta ini? Tuliskan
												alasan penolakan yang akan ditampilkan kepada pendaftar.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<Textarea
											placeholder="Contoh: Berkas tidak lengkap, kuota penuh, usia tidak memenuhi syarat..."
											value={alasanTolak}
											onChange={(e) => setAlasanTolak(e.target.value)}
											className="min-h-[90px]"
										/>
										<AlertDialogFooter>
											<AlertDialogCancel>Batal</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => handleStatusChange("n")}
												className="bg-red-600 hover:bg-red-700"
											>
												Tolak
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
}
