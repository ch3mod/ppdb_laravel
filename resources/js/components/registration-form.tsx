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
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { router, useForm as useInertiaForm, usePage } from "@inertiajs/react";
import confetti from "canvas-confetti";
import gsap from "gsap";
import {
	Award,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	GraduationCap,
	Home,
	IdCard,
	Info,
	MapPin,
	MessageSquare,
	PartyPopper,
	School,
	ShieldAlert,
	ShieldCheck,
	Trash2,
	Trophy,
	User,
	Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface RegistrationFormProps {
	initialData?: any;
	submitUrl?: string;
	method?: "post" | "put";
	mode?: "landing" | "admin";
	showDelete?: boolean;
	onDelete?: () => void;
	title?: string;
	description?: string;
}

const steps = [
	{ id: 1, title: "Identitas Diri", icon: User },
	{ id: 2, title: "Data Orang Tua", icon: Users },
	{ id: 3, title: "Prestasi", icon: Award },
	{ id: 4, title: "Informasi", icon: MessageSquare },
];

const tingkatOptions = [
	{ value: "Kecamatan", label: "Kecamatan" },
	{ value: "Kabupaten/Kota", label: "Kabupaten/Kota" },
	{ value: "Provinsi", label: "Provinsi" },
	{ value: "Nasional", label: "Nasional" },
];

const pendidikanOptions = [
	"Tidak Sekolah",
	"SD/Sederajat",
	"SMP/Sederajat",
	"SMA/Sederajat",
	"D1-D3",
	"S1",
	"S2",
	"S3",
];

const tempatTinggalOptions = [
	{ value: "orang_tua", label: "Orang Tua" },
	{ value: "menumpang", label: "Menumpang" },
	{ value: "asrama", label: "Asrama" },
];

function FormError({ error }: { error?: string }) {
	if (!error) return null;
	return <p className="mt-1 text-sm text-destructive">{error}</p>;
}

interface FormFieldProps {
	id: string;
	label: string;
	required?: boolean;
	error?: string;
	children: ReactNode;
	className?: string;
}

function FormField({
	id,
	label,
	required = false,
	error,
	children,
	className,
}: FormFieldProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={id} className={cn(error && "text-destructive")}>
				{label} {required && "*"}
			</Label>
			{children}
			<FormError error={error} />
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
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
			</CardContent>
		</Card>
	);
}

export function RegistrationForm({
	initialData,
	submitUrl = "/register",
	method = "post",
	mode = "landing",
	showDelete = false,
	onDelete,
	title,
	description,
}: RegistrationFormProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
	const [isSuccess, setIsSuccess] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [registrationNumber, setRegistrationNumber] = useState<string>("");

	const { flash } = usePage<any>().props;

	const isAdmin = mode === "admin";

	useEffect(() => {
		if (isAdmin) {
			return;
		}

		const noPendaftaranRegex = /([A-Z0-9]+-\d+-\d+-\d+)/;

		if (flash?.warning) {
			const match = flash.warning.match(noPendaftaranRegex);
			if (match) {
				setRegistrationNumber(match[1]);
			}
			setIsRejected(true);
			return;
		}

		if (flash?.success && flash.success.includes("berhasil mendaftar")) {
			const match = flash.success.match(noPendaftaranRegex);
			if (match) {
				setRegistrationNumber(match[1]);
			}
			setIsSuccess(true);
			setTimeout(() => {
				const count = 200;
				const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

				confetti({
					...defaults,
					spread: 26,
					startVelocity: 55,
					particleCount: Math.floor(count * 0.25),
				});
				confetti({
					...defaults,
					spread: 60,
					particleCount: Math.floor(count * 0.2),
				});
				confetti({
					...defaults,
					spread: 100,
					decay: 0.91,
					scalar: 0.8,
					particleCount: Math.floor(count * 0.35),
				});
				confetti({
					...defaults,
					spread: 120,
					startVelocity: 25,
					decay: 0.92,
					scalar: 1.2,
					particleCount: Math.floor(count * 0.1),
				});
				confetti({
					...defaults,
					spread: 120,
					startVelocity: 45,
					particleCount: Math.floor(count * 0.1),
				});

				setTimeout(() => {
					confetti({
						...defaults,
						particleCount: 50,
						angle: 60,
						spread: 55,
						origin: { x: 0, y: 0.6 },
					});
					confetti({
						...defaults,
						particleCount: 50,
						angle: 120,
						spread: 55,
						origin: { x: 1, y: 0.6 },
					});
				}, 150);
			}, 100);
		}
	}, [flash, isAdmin]);

	const {
		data,
		setData,
		post,
		put,
		processing,
		errors,
		reset,
		clearErrors: clearInertiaErrors,
	} = useInertiaForm({
		nama_lengkap: initialData?.nama_lengkap || "",
		nama_panggilan: initialData?.nama_panggilan || "",
		jenis_kelamin: initialData?.jenis_kelamin || "",
		tempat_lahir: initialData?.tempat_lahir || "",
		tanggal_lahir: initialData?.tanggal_lahir || "",
		agama: initialData?.agama || "",
		kewarganegaraan: initialData?.kewarganegaraan || "Indonesia",
		anak_ke: initialData?.anak_ke || "",
		jml_saudara_kandung: initialData?.jml_saudara_kandung || "",
		jml_saudara_tiri: initialData?.jml_saudara_tiri || "",
		jml_saudara_angkat: initialData?.jml_saudara_angkat || "",
		bahasa_sehari_hari: initialData?.bahasa_sehari_hari || "",
		berat_badan: initialData?.berat_badan || "",
		tinggi_badan: initialData?.tinggi_badan || "",
		golongan_darah: initialData?.golongan_darah || "",
		penyakit_diderita: initialData?.penyakit_diderita || "",
		nik: initialData?.nik || "",
		nisn: initialData?.nisn || "",
		alamat_lengkap: initialData?.alamat_lengkap || "",
		dukuh: initialData?.dukuh || "",
		rt: initialData?.rt || "",
		rw: initialData?.rw || "",
		desa_kelurahan: initialData?.desa_kelurahan || "",
		kecamatan: initialData?.kecamatan || "",
		kabupaten_kota: initialData?.kabupaten_kota || "",
		provinsi: initialData?.provinsi || "",
		kode_pos: initialData?.kode_pos || "",
		tempat_tinggal: initialData?.tempat_tinggal || "",
		no_hp: initialData?.no_hp || "",

		nama_ayah: initialData?.nama_ayah || "",
		pendidikan_ayah: initialData?.pendidikan_ayah || "",
		no_ayah: initialData?.no_hp_ayah || "",
		pekerjaan_ayah: initialData?.pekerjaan_ayah || "",
		nama_ibu: initialData?.nama_ibu || "",
		pendidikan_ibu: initialData?.pendidikan_ibu || "",
		no_ibu: initialData?.no_hp_ibu || "",
		pekerjaan_ibu: initialData?.pekerjaan_ibu || "",
		nama_wali: initialData?.nama_wali || "",
		pendidikan_wali: initialData?.pendidikan_wali || "",
		hubungan_wali: initialData?.hubungan_wali || "",
		pekerjaan_wali: initialData?.pekerjaan_wali || "",

		asal_sekolah: initialData?.asal_sekolah || "",
		tahun_lulus: initialData?.tahun_lulus || "",
		asal_siswa: initialData?.asal_siswa || "",
		nama_tk: initialData?.nama_tk || "",
		tk_lokasi: initialData?.tk_lokasi || "",

		penerima_kip: !!initialData?.penerima_kip,
		no_kip: initialData?.no_kip || "",
		yatim_piatu: !!initialData?.yatim_piatu,

		peringkat: initialData?.peringkat || "",

		jenis_lomba: initialData?.jenis_lomba || "",
		juara_ke: initialData?.juara_ke || "",
		juara_tingkat: initialData?.juara_tingkat || "",

		saran_dari: initialData?.saran_dari || "",
	});

	const formRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const getError = (field: string): string | undefined => {
		return clientErrors[field] || errors[field as keyof typeof errors];
	};

	const hasError = (field: string): boolean => {
		return !!getError(field);
	};

	const clearError = (field: string) => {
		if (clientErrors[field]) {
			const newErrors = { ...clientErrors };
			delete newErrors[field];
			setClientErrors(newErrors);
		}
	};

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				cardRef.current,
				{ opacity: 0, y: 40 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
			);
		});
		return () => ctx.revert();
	}, []);

	useEffect(() => {
		if (isAdmin) {
			return;
		}
		void currentStep;
		gsap.fromTo(
			formRef.current,
			{ opacity: 0, x: 20 },
			{ opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
		);
		if (cardRef.current) {
			cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, [currentStep, isAdmin]);

	const validateStep = (step: number) => {
		const newErrors: Record<string, string> = {};

		if (step === 1) {
			const requiredFields = [
				{ key: "nama_lengkap", label: "Nama Lengkap" },
				{ key: "jenis_kelamin", label: "Jenis Kelamin" },
				{ key: "tempat_lahir", label: "Tempat Lahir" },
				{ key: "tanggal_lahir", label: "Tanggal Lahir" },
				{ key: "nik", label: "NIK" },
			];

			if (
				data.asal_siswa === "taman_kanak_kanak"
			) {
				requiredFields.push(
					{ key: "asal_sekolah", label: "Asal TK" },
					{ key: "tahun_lulus", label: "Tahun Lulus" },
				);
			}

			for (const field of requiredFields) {
				// @ts-ignore - Dynamic field access
				if (!data[field.key]) {
					newErrors[field.key] = `${field.label} wajib diisi`;
				}
			}

			if (data.nik && data.nik.length !== 16) {
				newErrors.nik = "NIK harus terdiri dari 16 digit";
			}
		}

		if (step === 2) {
			if (!data.nama_ayah) {
				newErrors.nama_ayah = "Nama Ayah wajib diisi";
			}
			if (!data.nama_ibu) {
				newErrors.nama_ibu = "Nama Ibu wajib diisi";
			}
		}

		setClientErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			const firstError = Object.values(newErrors)[0];
			toast.error(firstError);
			return false;
		}

		return true;
	};

	const validateAll = () => {
		const newErrors: Record<string, string> = {};

		const requiredFields = [
			{ key: "nama_lengkap", label: "Nama Lengkap" },
			{ key: "jenis_kelamin", label: "Jenis Kelamin" },
			{ key: "tempat_lahir", label: "Tempat Lahir" },
			{ key: "tanggal_lahir", label: "Tanggal Lahir" },
			{ key: "nik", label: "NIK" },
			{ key: "nama_ayah", label: "Nama Ayah" },
			{ key: "nama_ibu", label: "Nama Ibu" },
		];

		if (data.asal_siswa === "taman_kanak_kanak") {
			requiredFields.push(
				{ key: "asal_sekolah", label: "Asal TK" },
				{ key: "tahun_lulus", label: "Tahun Lulus" },
			);
		}

		for (const field of requiredFields) {
			// @ts-ignore
			if (!data[field.key]) {
				newErrors[field.key] = `${field.label} wajib diisi`;
			}
		}

		if (data.nik && data.nik.length !== 16) {
			newErrors.nik = "NIK harus terdiri dari 16 digit";
		}

		setClientErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			toast.error(Object.values(newErrors)[0]);
			return false;
		}

		return true;
	};

	const nextStep = (e?: React.MouseEvent) => {
		if (e) e.preventDefault();
		if (validateStep(currentStep)) {
			if (currentStep < 4) setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) setCurrentStep(currentStep - 1);
	};

	const fireConfetti = useCallback(() => {
		const count = 200;
		const defaults = {
			origin: { y: 0.7 },
			zIndex: 9999,
		};

		function fire(particleRatio: number, opts: confetti.Options) {
			confetti({
				...defaults,
				...opts,
				particleCount: Math.floor(count * particleRatio),
			});
		}

		fire(0.25, { spread: 26, startVelocity: 55 });
		fire(0.2, { spread: 60 });
		fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
		fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
		fire(0.1, { spread: 120, startVelocity: 45 });

		setTimeout(() => {
			confetti({
				...defaults,
				particleCount: 50,
				angle: 60,
				spread: 55,
				origin: { x: 0, y: 0.6 },
			});
			confetti({
				...defaults,
				particleCount: 50,
				angle: 120,
				spread: 55,
				origin: { x: 1, y: 0.6 },
			});
		}, 150);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (isAdmin && !validateAll()) {
			return;
		}

		if (!isAdmin && !validateStep(4)) {
			return;
		}

		const action = method === "post" ? post : put;

		action(submitUrl, {
			onSuccess: (page) => {
				if (isAdmin) {
					toast.success(
						method === "post"
							? "Pendaftar berhasil ditambahkan"
							: "Data pendaftar berhasil diperbarui",
					);
					if (method === "post") {
						reset();
						setCurrentStep(1);
						clearInertiaErrors();
						setClientErrors({});
					}
					return;
				}

				const flashMessage = (page.props as { flash?: { success?: string } })
					.flash?.success;
				if (flashMessage) {
					const match = flashMessage.match(/([A-Z0-9]+-\d+-\d+-\d+)/);
					if (match) {
						setRegistrationNumber(match[1]);
					}
				}
				setIsSuccess(true);
				fireConfetti();
			},
		});
	};

	const inputClass = "h-11 rounded-lg";

	const identitasFields = (
		<>
			<FormField
				id="nama_lengkap"
				label="Nama Lengkap"
				required
				error={getError("nama_lengkap")}
				className="sm:col-span-2"
			>
				<Input
					id="nama_lengkap"
					placeholder="Nama lengkap sesuai yang tercantum di Akte Kelahiran"
					value={data.nama_lengkap}
					onChange={(e) => {
						setData("nama_lengkap", e.target.value);
						clearError("nama_lengkap");
					}}
					aria-invalid={hasError("nama_lengkap")}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="nama_panggilan"
				label="Nama Panggilan"
				error={getError("nama_panggilan")}
			>
				<Input
					id="nama_panggilan"
					placeholder="Nama panggilan sehari-hari"
					value={data.nama_panggilan}
					onChange={(e) => setData("nama_panggilan", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="agama"
				label="Agama"
				error={getError("agama")}
			>
				<Select
					value={data.agama}
					onValueChange={(value) => setData("agama", value)}
				>
					<SelectTrigger className={inputClass}>
						<SelectValue placeholder="Pilih Agama" />
					</SelectTrigger>
					<SelectContent>
						{["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"].map(
							(agama) => (
								<SelectItem key={agama} value={agama}>
									{agama}
								</SelectItem>
							),
						)}
					</SelectContent>
				</Select>
			</FormField>

			<FormField
				id="jenis_kelamin"
				label="Jenis Kelamin"
				required
				error={getError("jenis_kelamin")}
			>
				<RadioGroup
					className="mt-2 flex gap-4"
					value={data.jenis_kelamin}
					onValueChange={(value) => {
						setData("jenis_kelamin", value);
						clearError("jenis_kelamin");
					}}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="l" id="laki-laki" />
						<Label htmlFor="laki-laki" className="cursor-pointer font-normal">
							Laki-laki
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="p" id="perempuan" />
						<Label htmlFor="perempuan" className="cursor-pointer font-normal">
							Perempuan
						</Label>
					</div>
				</RadioGroup>
			</FormField>

			<FormField
				id="kewarganegaraan"
				label="Kewarganegaraan"
				error={getError("kewarganegaraan")}
			>
				<Input
					id="kewarganegaraan"
					placeholder="Indonesia"
					value={data.kewarganegaraan}
					onChange={(e) => setData("kewarganegaraan", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="tempat_lahir"
				label="Tempat Lahir"
				required
				error={getError("tempat_lahir")}
			>
				<Input
					id="tempat_lahir"
					placeholder="Tempat Lahir Peserta"
					value={data.tempat_lahir}
					onChange={(e) => {
						setData("tempat_lahir", e.target.value);
						clearError("tempat_lahir");
					}}
					aria-invalid={hasError("tempat_lahir")}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="tanggal_lahir"
				label="Tanggal Lahir"
				required
				error={getError("tanggal_lahir")}
			>
				<Input
					id="tanggal_lahir"
					type="date"
					value={data.tanggal_lahir}
					onChange={(e) => {
						setData("tanggal_lahir", e.target.value);
						clearError("tanggal_lahir");
					}}
					aria-invalid={hasError("tanggal_lahir")}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="anak_ke"
				label="Anak Nomor Ke (dari satu ibu)"
				error={getError("anak_ke")}
			>
				<Input
					id="anak_ke"
					type="number"
					min={1}
					placeholder="Contoh: 2"
					value={data.anak_ke}
					onChange={(e) => setData("anak_ke", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="jml_saudara_kandung"
				label="Banyak Saudara Kandung"
				error={getError("jml_saudara_kandung")}
			>
				<Input
					id="jml_saudara_kandung"
					type="number"
					min={0}
					placeholder="Contoh: 1"
					value={data.jml_saudara_kandung}
					onChange={(e) => setData("jml_saudara_kandung", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="jml_saudara_tiri"
				label="Banyak Saudara Tiri"
				error={getError("jml_saudara_tiri")}
			>
				<Input
					id="jml_saudara_tiri"
					type="number"
					min={0}
					placeholder="Contoh: 0"
					value={data.jml_saudara_tiri}
					onChange={(e) => setData("jml_saudara_tiri", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="jml_saudara_angkat"
				label="Banyak Saudara Angkat"
				error={getError("jml_saudara_angkat")}
			>
				<Input
					id="jml_saudara_angkat"
					type="number"
					min={0}
					placeholder="Contoh: 0"
					value={data.jml_saudara_angkat}
					onChange={(e) => setData("jml_saudara_angkat", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="bahasa_sehari_hari"
				label="Bahasa Sehari-hari"
				error={getError("bahasa_sehari_hari")}
			>
				<Input
					id="bahasa_sehari_hari"
					placeholder="Contoh: Indonesia, Sunda"
					value={data.bahasa_sehari_hari}
					onChange={(e) => setData("bahasa_sehari_hari", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="berat_badan"
				label="Berat Badan (kg)"
				error={getError("berat_badan")}
			>
				<Input
					id="berat_badan"
					type="number"
					placeholder="Contoh: 20"
					value={data.berat_badan}
					onChange={(e) => setData("berat_badan", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="tinggi_badan"
				label="Tinggi Badan (cm)"
				error={getError("tinggi_badan")}
			>
				<Input
					id="tinggi_badan"
					type="number"
					placeholder="Contoh: 110"
					value={data.tinggi_badan}
					onChange={(e) => setData("tinggi_badan", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="nik"
				label="NIK (16 digit)"
				required
				error={getError("nik")}
			>
				<Input
					id="nik"
					placeholder="16 angka NIK sesuai yang tercantum di KK"
					value={data.nik}
					onChange={(e) => {
						setData("nik", e.target.value);
						clearError("nik");
					}}
					aria-invalid={hasError("nik")}
					className={inputClass}
					maxLength={16}
				/>
			</FormField>

			<FormField id="nisn" label="NISN (Jika dari TK/RA)" error={getError("nisn")}>
				<Input
					id="nisn"
					placeholder="NISN Peserta"
					value={data.nisn}
					onChange={(e) => setData("nisn", e.target.value)}
					aria-invalid={hasError("nisn")}
					className={inputClass}
				/>
			</FormField>

			<FormField
				id="tempat_tinggal"
				label="Bertempat Tinggal Pada"
				error={getError("tempat_tinggal")}
			>
				<Select
					value={data.tempat_tinggal}
					onValueChange={(value) => setData("tempat_tinggal", value)}
				>
					<SelectTrigger className={inputClass}>
						<SelectValue placeholder="Pilih Tempat Tinggal" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="orang_tua">Orang Tua</SelectItem>
						<SelectItem value="saudara">Saudara</SelectItem>
						<SelectItem value="wali">Wali</SelectItem>
					</SelectContent>
				</Select>
			</FormField>
		</>
	);

	const alamatFields = (
		<>
			<FormField
				id="alamat_lengkap"
				label="Alamat Jalan"
				error={getError("alamat_lengkap")}
				className="sm:col-span-2"
			>
				<Textarea
					id="alamat_lengkap"
					placeholder="Contoh: Jl. Kutilang No. 12 atau Jl. Melati No. 25"
					value={data.alamat_lengkap}
					onChange={(e) => {
						setData("alamat_lengkap", e.target.value);
						clearError("alamat_lengkap");
					}}
					aria-invalid={hasError("alamat_lengkap")}
					className="min-h-[80px] rounded-lg"
				/>
				<p className="text-xs text-muted-foreground">
					Isi nama jalan/gang saja. Jika tidak diisi, akan otomatis digabungkan
					dari RT/RW, Desa, Kecamatan, Kabupaten, dan Provinsi.
				</p>
			</FormField>

			<div className="grid grid-cols-2 gap-4">
				<FormField id="rt" label="RT">
					<Input
						id="rt"
						placeholder="RT"
						value={data.rt}
						onChange={(e) => setData("rt", e.target.value)}
						className={inputClass}
					/>
				</FormField>
				<FormField id="rw" label="RW">
					<Input
						id="rw"
						placeholder="RW"
						value={data.rw}
						onChange={(e) => setData("rw", e.target.value)}
						className={inputClass}
					/>
				</FormField>
			</div>

			<FormField id="desa_kelurahan" label="Desa/Kelurahan">
				<Input
					id="desa_kelurahan"
					placeholder="Desa/Kelurahan"
					value={data.desa_kelurahan}
					onChange={(e) => setData("desa_kelurahan", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="kecamatan" label="Kecamatan">
				<Input
					id="kecamatan"
					placeholder="Kecamatan"
					value={data.kecamatan}
					onChange={(e) => setData("kecamatan", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="kabupaten_kota" label="Kabupaten/Kota">
				<Input
					id="kabupaten_kota"
					placeholder="Kabupaten/Kota"
					value={data.kabupaten_kota}
					onChange={(e) => setData("kabupaten_kota", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="provinsi" label="Provinsi">
				<Input
					id="provinsi"
					placeholder="Provinsi"
					value={data.provinsi}
					onChange={(e) => setData("provinsi", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="kode_pos" label="Kode Pos">
				<Input
					id="kode_pos"
					placeholder="Kode Pos"
					value={data.kode_pos}
					onChange={(e) => setData("kode_pos", e.target.value)}
					className={inputClass}
				/>
			</FormField>
		</>
	);

	const sekolahFields = (
		<>
					<FormField
						id="asal_siswa"
						label="Asal Siswa"
						error={getError("asal_siswa")}
					>
						<Select
							value={data.asal_siswa}
							onValueChange={(value) => {
								if (value === "taman_kanak_kanak") {
									setData("asal_siswa", value);
									return;
								}
								setData({
									...data,
									asal_siswa: value,
									asal_sekolah: "",
									tahun_lulus: "",
									tk_lokasi: "",
								});
							}}
						>
							<SelectTrigger className={inputClass}>
								<SelectValue placeholder="Pilih Asal" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="rumah_tangga">Dari Rumah</SelectItem>
								<SelectItem value="taman_kanak_kanak">
									Taman Kanak-Kanak
								</SelectItem>
							</SelectContent>
						</Select>
					</FormField>

					{data.asal_siswa === "taman_kanak_kanak" && (
						<>
							<FormField
								id="asal_sekolah"
								label="Asal TK"
								required
								error={getError("asal_sekolah")}
							>
								<Input
									id="asal_sekolah"
									placeholder="Nama TK"
									value={data.asal_sekolah}
									onChange={(e) => {
										setData("asal_sekolah", e.target.value);
										clearError("asal_sekolah");
									}}
									aria-invalid={hasError("asal_sekolah")}
									className={inputClass}
								/>
							</FormField>

							<FormField
								id="tahun_lulus"
								label="Tahun Lulus"
								required
								error={getError("tahun_lulus")}
							>
								<Input
									id="tahun_lulus"
									inputMode="numeric"
									placeholder="Contoh: 2026"
									value={data.tahun_lulus}
									onChange={(e) => {
										setData("tahun_lulus", e.target.value);
										clearError("tahun_lulus");
									}}
									aria-invalid={hasError("tahun_lulus")}
									className={inputClass}
								/>
							</FormField>

							<FormField
								id="tk_lokasi"
								label="Lokasi TK/RA"
								error={getError("tk_lokasi")}
							>
								<Input
									id="tk_lokasi"
									placeholder="Contoh: Desa/Kota lokasi TK"
									value={data.tk_lokasi}
									onChange={(e) => setData("tk_lokasi", e.target.value)}
									className={inputClass}
								/>
							</FormField>
						</>
					)}
				</>
	);

	const kipCatatanFields = (
		<>
			<div className="sm:col-span-2">
				<div className="flex items-center space-x-2">
					<Checkbox
						id="penerima_kip"
						checked={data.penerima_kip}
						onCheckedChange={(checked) =>
							setData("penerima_kip", checked as boolean)
						}
					/>
					<Label htmlFor="penerima_kip" className="cursor-pointer font-normal">
						Merupakan peserta Penerima KIP/PIP
					</Label>
				</div>
			</div>

			{data.penerima_kip && (
				<FormField id="no_kip" label="No. KIP" className="sm:col-span-2">
					<Input
						id="no_kip"
						placeholder="Nomor KIP/PIP"
						value={data.no_kip}
						onChange={(e) => setData("no_kip", e.target.value)}
						className={inputClass}
					/>
				</FormField>
			)}
		</>
	);

	const orangTuaFields = (
		<>
			<div className="sm:col-span-2">
				<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
					<span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
						A
					</span>
					Data Ayah
				</div>
			</div>

			<FormField
				id="nama_ayah"
				label="Nama Ayah"
				required
				error={getError("nama_ayah")}
				className="sm:col-span-2"
			>
				<Input
					id="nama_ayah"
					placeholder="Nama lengkap ayah"
					value={data.nama_ayah}
					onChange={(e) => {
						setData("nama_ayah", e.target.value);
						clearError("nama_ayah");
					}}
					aria-invalid={hasError("nama_ayah")}
					className={inputClass}
				/>
			</FormField>

			<FormField id="no_ayah" label="No. HP Ayah">
				<Input
					id="no_ayah"
					type="tel"
					placeholder="No. HP Ayah"
					value={data.no_ayah}
					onChange={(e) => setData("no_ayah", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="pekerjaan_ayah" label="Pekerjaan Ayah">
				<Input
					id="pekerjaan_ayah"
					placeholder="Tuliskan pekerjaan ayah"
					value={data.pekerjaan_ayah}
					onChange={(e) => setData("pekerjaan_ayah", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="pendidikan_ayah" label="Pendidikan Tertinggi Ayah">
				<Select
					value={data.pendidikan_ayah}
					onValueChange={(value) => setData("pendidikan_ayah", value)}
				>
					<SelectTrigger className={inputClass}>
						<SelectValue placeholder="Pilih Pendidikan" />
					</SelectTrigger>
					<SelectContent>
						{pendidikanOptions.map((p) => (
							<SelectItem key={p} value={p}>
								{p}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormField>

			<div className="sm:col-span-2">
				<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
					<span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
						I
					</span>
					Data Ibu
				</div>
			</div>

			<FormField
				id="nama_ibu"
				label="Nama Ibu"
				required
				error={getError("nama_ibu")}
				className="sm:col-span-2"
			>
				<Input
					id="nama_ibu"
					placeholder="Nama lengkap ibu"
					value={data.nama_ibu}
					onChange={(e) => {
						setData("nama_ibu", e.target.value);
						clearError("nama_ibu");
					}}
					aria-invalid={hasError("nama_ibu")}
					className={inputClass}
				/>
			</FormField>

			<FormField id="no_ibu" label="No. HP Ibu">
				<Input
					id="no_ibu"
					type="tel"
					placeholder="No. HP Ibu"
					value={data.no_ibu}
					onChange={(e) => setData("no_ibu", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="pekerjaan_ibu" label="Pekerjaan Ibu">
				<Input
					id="pekerjaan_ibu"
					placeholder="Tuliskan pekerjaan ibu"
					value={data.pekerjaan_ibu}
					onChange={(e) => setData("pekerjaan_ibu", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="pendidikan_ibu" label="Pendidikan Tertinggi Ibu">
				<Select
					value={data.pendidikan_ibu}
					onValueChange={(value) => setData("pendidikan_ibu", value)}
				>
					<SelectTrigger className={inputClass}>
						<SelectValue placeholder="Pilih Pendidikan" />
					</SelectTrigger>
					<SelectContent>
						{pendidikanOptions.map((p) => (
							<SelectItem key={p} value={p}>
								{p}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormField>

			<div className="sm:col-span-2">
				<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
					<span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
						W
					</span>
					Data Wali{" "}
					<span className="font-normal text-muted-foreground">
						(diisi jika siswa tinggal dengan wali)
					</span>
				</div>
			</div>

			<FormField id="nama_wali" label="Nama Wali">
				<Input
					id="nama_wali"
					placeholder="Nama lengkap wali"
					value={data.nama_wali}
					onChange={(e) => setData("nama_wali", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="hubungan_wali" label="Hubungan Terhadap Anak">
				<Input
					id="hubungan_wali"
					placeholder="Contoh: Kakek, Nenek, Paman, Bibi"
					value={data.hubungan_wali}
					onChange={(e) => setData("hubungan_wali", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="pendidikan_wali" label="Pendidikan Tertinggi Wali">
				<Select
					value={data.pendidikan_wali}
					onValueChange={(value) => setData("pendidikan_wali", value)}
				>
					<SelectTrigger className={inputClass}>
						<SelectValue placeholder="Pilih Pendidikan" />
					</SelectTrigger>
					<SelectContent>
						{pendidikanOptions.map((p) => (
							<SelectItem key={p} value={p}>
								{p}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormField>

			<FormField id="pekerjaan_wali" label="Pekerjaan Wali">
				<Input
					id="pekerjaan_wali"
					placeholder="Tuliskan pekerjaan wali"
					value={data.pekerjaan_wali}
					onChange={(e) => setData("pekerjaan_wali", e.target.value)}
					className={inputClass}
				/>
			</FormField>
		</>
	);

	const akademikFields = (
		<>
			<FormField
				id="peringkat"
				label="Peringkat Kelas (opsional)"
				className="sm:col-span-2"
			>
				<Input
					id="peringkat"
					placeholder="Contoh: Kelas / Semester / Peringkat"
					value={data.peringkat}
					onChange={(e) => setData("peringkat", e.target.value)}
					className={inputClass}
				/>
				<p className="text-xs text-muted-foreground">
					Diisi apabila peserta pernah mendapatkan peringkat 1, 2, atau 3 di
					TK/RA
				</p>
			</FormField>
		</>
	);

	const nonAkademikFields = (
		<>
			<FormField
				id="jenis_lomba"
				label="Jenis Lomba"
				className="sm:col-span-2"
			>
				<Input
					id="jenis_lomba"
					placeholder="Contoh: Lomba Mewarnai, Lomba Cerdas Cermat, dll"
					value={data.jenis_lomba}
					onChange={(e) => setData("jenis_lomba", e.target.value)}
					className={inputClass}
				/>
			</FormField>

			<FormField id="juara_ke" label="Juara ke">
				<Select
					value={data.juara_ke}
					onValueChange={(value) => setData("juara_ke", value)}
				>
					<SelectTrigger className={inputClass}>
						<SelectValue placeholder="Pilih Juara" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1">Juara 1</SelectItem>
						<SelectItem value="2">Juara 2</SelectItem>
						<SelectItem value="3">Juara 3</SelectItem>
					</SelectContent>
				</Select>
			</FormField>

			<FormField id="juara_tingkat" label="Tingkat">
				<Select
					value={data.juara_tingkat}
					onValueChange={(value) => setData("juara_tingkat", value)}
				>
					<SelectTrigger className={inputClass}>
						<SelectValue placeholder="Pilih Tingkat" />
					</SelectTrigger>
					<SelectContent>
						{tingkatOptions.map((t) => (
							<SelectItem key={t.value} value={t.value}>
								{t.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-xs text-muted-foreground">
					Kejuaraan minimal tingkat Kecamatan/Kabupaten
				</p>
			</FormField>
		</>
	);

	const rekomendasiFields = (
		<>
			{isAdmin && (
				<div className="sm:col-span-2 space-y-3">
					<div className="flex items-center space-x-2 rounded-lg bg-secondary/50 p-4">
						<Checkbox
							id="yatim_piatu"
							checked={data.yatim_piatu}
							onCheckedChange={(checked) =>
								setData("yatim_piatu", checked as boolean)
							}
						/>
						<Label
							htmlFor="yatim_piatu"
							className="cursor-pointer font-normal"
						>
							Mengajukan bantuan Program UPZ Baznas
						</Label>
					</div>
					<p className="pl-1 text-xs text-muted-foreground">
						Pilih jenis beasiswa yang sesuai untuk peserta ini.
					</p>
				</div>
			)}

			<FormField
				id="saran_dari"
				label="Saran Dari"
				className="sm:col-span-2"
			>
				<Input
					id="saran_dari"
					placeholder="Contoh: Guru, Teman, Sosial Media, dll"
					value={data.saran_dari}
					onChange={(e) => setData("saran_dari", e.target.value)}
					className={inputClass}
				/>
			</FormField>
		</>
	);

	const persyaratanInfo = (
		<div className="rounded-xl border border-primary/20 bg-primary/5 p-5 sm:col-span-2">
			<h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
				<ClipboardList className="size-4 text-primary" />
				Persyaratan Pendaftaran
			</h4>
			<ul className="space-y-2 text-sm text-muted-foreground">
				{[
					"Fotokopi (Fc) Akte Kelahiran",
					"Fotokopi (Fc) Kartu Keluarga (KK)",
					"Fotokopi (Fc) KTP Orang Tua",
					"Fotokopi (Fc) Ijazah TK/PAUD",
					"Fotokopi (Fc) SKTM/KIP (jika ada)",
									].map((item) => (
					<li key={item} className="flex items-start gap-2">
						<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
						{item}
					</li>
				))}
			</ul>
			<p className="mt-3 text-xs text-muted-foreground">
				Berkas asli dibawa saat verifikasi/daftar ulang untuk dicocokkan.
			</p>
		</div>
	);

	const deleteButton =
		isAdmin && showDelete ? (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="destructive" size="sm">
						<Trash2 className="size-4" />
						Hapus Peserta
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Hapus Peserta?</AlertDialogTitle>
						<AlertDialogDescription>
							Peserta akan dihapus dari pendaftar PPDB. Tindakan ini tidak
							dapat dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={onDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		) : null;

	const submitLabel = processing
		? "Mengirim..."
		: isAdmin && method === "put"
			? "Simpan Perubahan"
			: isAdmin
				? "Simpan Pendaftar"
				: "Kirim Pendaftaran";

	// ── Admin: grid card layout (all sections at once) ──────────────────────
	if (isAdmin) {
		return (
			<div ref={cardRef} className="mx-auto w-full max-w-7xl space-y-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Header */}
					<Card>
						<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex min-w-0 items-start gap-3">
								<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<User className="size-6" />
								</div>
								<div className="min-w-0 space-y-1">
									<CardTitle className="text-xl">
										{title || "Tambah Pendaftar Baru"}
									</CardTitle>
									<CardDescription>
										{description ||
											"Silahkan isi formulir pendaftaran peserta didik baru"}
									</CardDescription>
								</div>
							</div>
							{deleteButton}
						</CardHeader>
					</Card>

					{/* Grid sections */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<SectionCard
							icon={User}
							title="Identitas Diri"
							description="Data pribadi peserta"
						>
							{identitasFields}
						</SectionCard>

						<SectionCard
							icon={MapPin}
							title="Alamat"
							description="Domisili peserta"
						>
							{alamatFields}
						</SectionCard>

					<SectionCard
						icon={School}
						title="Asal Mula Siswa"
						description="Asal TK siswa"
					>
						{sekolahFields}
					</SectionCard>

					<SectionCard
						icon={IdCard}
						title="KIP"
						description="Bantuan biaya pendidikan"
					>
						{kipCatatanFields}
					</SectionCard>

						<SectionCard
							icon={Users}
							title="Identitas Orang Tua"
							description="Data ayah dan ibu"
						>
							{orangTuaFields}
						</SectionCard>

						<SectionCard
							icon={Award}
							title="Beasiswa Akademik"
							description="Prestasi akademik (opsional)"
						>
							{akademikFields}
						</SectionCard>

						<SectionCard
							icon={Trophy}
							title="Beasiswa Non Akademik"
							description="Prestasi lomba (opsional)"
						>
							{nonAkademikFields}
						</SectionCard>

						<SectionCard
							icon={ShieldCheck}
							title="Informasi Tambahan"
							description="Beasiswa & sumber informasi"
						>
							{rekomendasiFields}
							{persyaratanInfo}
						</SectionCard>
					</div>

					{/* Actions */}
					<Card>
						<div className="flex flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-end">
							<Button
								type="submit"
								disabled={processing}
								className="w-full sm:w-auto"
							>
								<CheckCircle2 className="size-4" />
								{submitLabel}
							</Button>
						</div>
					</Card>
				</form>
			</div>
		);
	}

	// ── Landing: multi-step wizard ──────────────────────────────────────────
	return (
		<div className="mx-auto w-full max-w-4xl px-4">
			{isRejected ? (
				<div className="py-16 text-center">
					<div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
						<ShieldAlert className="h-12 w-12 text-amber-600 dark:text-amber-400" />
					</div>
					<h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
						Pendaftaran Tercatat
					</h1>
					<p className="mx-auto mb-6 max-w-xl text-lg text-muted-foreground">
						Mohon maaf, berdasarkan ketentuan sekolah peserta tidak dapat
						diterima. Data Anda tetap kami simpan sebagai catatan.
					</p>

					{registrationNumber && (
						<div className="mb-8 inline-block rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
							<p className="mb-2 text-sm text-muted-foreground">
								Nomor Pendaftaran
							</p>
							<p className="text-3xl font-bold tracking-wider text-amber-700 dark:text-amber-300">
								{registrationNumber}
							</p>
						</div>
					)}

					<Card className="mx-auto max-w-lg overflow-hidden rounded-3xl border-0 shadow-xl">
						<CardContent className="p-8">
							<div className="space-y-4">
								<div className="flex items-start gap-3 text-left">
									<Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
									<p className="text-muted-foreground">
										Pendaftaran Anda telah tercatat di sistem kami, namun
										dinyatakan ditolak.
									</p>
								</div>
								<div className="flex items-start gap-3 text-left">
									<Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
									<p className="text-muted-foreground">
										Untuk informasi lebih lanjut, silakan hubungi panitia PPDB
										SDN Pangauban 02.
									</p>
								</div>
							</div>

							<Button
								className="mt-8 h-12 w-full rounded-xl text-base"
								variant="outline"
								onClick={() => router.visit("/")}
							>
								<Home className="mr-2 h-4 w-4" />
								Kembali ke Beranda
							</Button>
						</CardContent>
					</Card>
				</div>
			) : isSuccess ? (
				<div className="py-16 text-center">
					<div className="mb-6 inline-flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
						<PartyPopper className="h-12 w-12 text-green-600 dark:text-green-400" />
					</div>
					<h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
						Selamat! 🎉
					</h1>
					<p className="mb-6 text-xl text-muted-foreground">
						Pendaftaran Anda berhasil disubmit
					</p>

					{registrationNumber && (
						<div className="mb-8 inline-block rounded-2xl border border-primary/20 bg-primary/10 p-6">
							<p className="mb-2 text-sm text-muted-foreground">
								Nomor Pendaftaran Anda
							</p>
							<p className="text-3xl font-bold tracking-wider text-primary">
								{registrationNumber}
							</p>
						</div>
					)}

					<Card className="mx-auto max-w-lg overflow-hidden rounded-3xl border-0 shadow-xl">
						<CardContent className="p-8">
							<div className="space-y-4">
								<div className="flex items-start gap-3 text-left">
									<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
									<p className="text-muted-foreground">
										Simpan nomor pendaftaran Anda untuk keperluan daftar ulang
									</p>
								</div>
								<div className="flex items-start gap-3 text-left">
									<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
									<p className="text-muted-foreground">
										Siapkan berkas-berkas yang diperlukan untuk proses
										selanjutnya
									</p>
								</div>
								<div className="flex items-start gap-3 text-left">
									<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
									<p className="text-muted-foreground">
										Tim PPDB akan menghubungi Anda melalui No. HP yang terdaftar
									</p>
								</div>
							</div>

							<Button
								className="mt-8 h-12 w-full rounded-xl text-base"
								onClick={() => router.visit("/")}
							>
								<Home className="mr-2 h-4 w-4" />
								Kembali ke Beranda
							</Button>
						</CardContent>
					</Card>
				</div>
			) : (
				<>
					<div className="mb-10 text-center">
						<div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
							<GraduationCap className="h-10 w-10 text-primary" />
						</div>
						<h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
							Formulir Pendaftaran
						</h1>
						<p className="text-muted-foreground">
							PPDB, Penerimaan Murid Baru SDN Pangauban 02 Tahun Ajaran
							2026/2027
						</p>
					</div>

					{/* Progress Steps */}
					<div className="mb-8">
						<div className="relative flex items-center justify-between">
							<div className="absolute top-6 right-0 left-0 mx-12 h-1 rounded-full bg-border">
								<div
									className="h-full rounded-full bg-primary transition-all duration-500"
									style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
								/>
							</div>

							{steps.map((step) => (
								<div
									key={step.id}
									className="relative z-10 flex flex-col items-center gap-2"
								>
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
											step.id === currentStep
												? "scale-110 bg-primary text-white shadow-lg shadow-primary/30"
												: step.id < currentStep
													? "bg-primary/20 text-primary"
													: "border-2 border-border bg-white text-muted-foreground"
										}`}
									>
										{step.id < currentStep ? (
											<CheckCircle2 className="h-6 w-6" />
										) : (
											<step.icon className="h-5 w-5" />
										)}
									</div>
									<span
										className={`hidden text-xs font-medium sm:block ${
											step.id === currentStep
												? "text-primary"
												: "text-muted-foreground"
										}`}
									>
										{step.title}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Form Card */}
					<Card
						ref={cardRef}
						className="w-full overflow-hidden rounded-3xl border-0 shadow-2xl shadow-primary/5"
					>
						<CardHeader className="border-b bg-linear-gradient-to-r from-primary/5 to-accent/50">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-3 text-xl">
										{(() => {
											const StepIcon = steps[currentStep - 1].icon;
											return <StepIcon className="h-6 w-6 text-primary" />;
										})()}
										{steps[currentStep - 1].title}
									</CardTitle>
									<CardDescription>
										Langkah {currentStep} dari 4 - Isi formulir sesuai data
										anak Anda
									</CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent className="p-6 md:p-8">
							<form onSubmit={handleSubmit}>
								<div ref={formRef}>
									{currentStep === 1 && (
										<div className="space-y-6">
											<div className="grid gap-6 md:grid-cols-2">
												{identitasFields}
												{alamatFields}
												{sekolahFields}
												{kipCatatanFields}
											</div>
										</div>
									)}

									{currentStep === 2 && (
										<div className="grid gap-6 md:grid-cols-2">
											{orangTuaFields}
										</div>
									)}

									{currentStep === 3 && (
										<div className="space-y-8">
											<p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-muted-foreground dark:border-amber-800 dark:bg-amber-950/30">
												Prestasi peserta. Diisi jika peserta memiliki prestasi
												akademik atau non akademik.
											</p>
											<div className="grid gap-6 md:grid-cols-2">
												<div className="md:col-span-2">
													<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
														<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
															A
														</span>
														Akademik (opsional)
													</h3>
												</div>
												{akademikFields}
												<div className="md:col-span-2">
													<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
														<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
															N
														</span>
														Non Akademik (opsional)
													</h3>
												</div>
												{nonAkademikFields}
											</div>
										</div>
									)}

									{currentStep === 4 && (
										<div className="grid gap-6 md:grid-cols-2">
											{rekomendasiFields}
											{persyaratanInfo}
										</div>
									)}
								</div>

								<div className="mt-8 flex justify-between border-t pt-6">
									<Button
										type="button"
										variant="outline"
										onClick={prevStep}
										disabled={currentStep === 1}
										className="rounded-xl bg-transparent px-6"
									>
										<ChevronLeft className="mr-2 h-4 w-4" />
										Sebelumnya
									</Button>

									{currentStep < 4 ? (
										<Button
											type="button"
											onClick={nextStep}
											className="rounded-xl px-6"
										>
											Selanjutnya
											<ChevronRight className="ml-2 h-4 w-4" />
										</Button>
									) : (
										<Button
											type="submit"
											disabled={processing}
											className="rounded-xl bg-primary px-8 hover:bg-primary/90"
										>
											<CheckCircle2 className="mr-2 h-4 w-4" />
											{submitLabel}
										</Button>
									)}
								</div>
							</form>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
