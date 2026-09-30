import { AlertMessages } from "@/components/alert-messages";
import { ExportStatusDialog } from "@/components/export-status-dialog";
import { type Column, DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
	Hash,
	Pencil,
	Settings2,
	Shirt,
	User,
	UserRound,
} from "lucide-react";
import { useState } from "react";

interface UkuranSeragam {
	id: number;
	baju: string | null;
	sepatu: string | null;
	baju_batik: boolean;
	seragam_olahraga: boolean;
	atribut: boolean;
}

interface Peserta {
	id: string;
	no_pendaftaran: string;
	nama_lengkap: string;
	jenis_kelamin: "l" | "p";
	ukuran_seragam: UkuranSeragam | null;
}

interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

interface Props {
	pesertappdb: {
		data: Peserta[];
		links: PaginationLink[];
		current_page: number;
		last_page: number;
		total: number;
	};
	tahun: number;
	years: number[];
}

export default function Index({ pesertappdb, tahun, years }: Props) {
	const { flash } = usePage<any>().props;

	// Edit Modal State
	const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
	const [open, setOpen] = useState(false);

	const {
		data: formData,
		setData,
		post,
		processing,
		errors,
		reset,
	} = useForm({
		uuid: "",
		baju: "",
		sepatu: "",
		baju_batik: false,
		seragam_olahraga: false,
		atribut: false,
	});

	const handleEdit = (peserta: Peserta) => {
		setSelectedPeserta(peserta);
		setData({
			uuid: peserta.id,
			baju: peserta.ukuran_seragam?.baju || "",
			sepatu: peserta.ukuran_seragam?.sepatu || "",
			baju_batik: peserta.ukuran_seragam?.baju_batik || false,
			seragam_olahraga: peserta.ukuran_seragam?.seragam_olahraga || false,
			atribut: peserta.ukuran_seragam?.atribut || false,
		});
		setOpen(true);
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("ppdb.ubah.seragam"), {
			onSuccess: () => {
				setOpen(false);
				reset();
			},
		});
	};

	const columns: Column<Peserta>[] = [
		{
			accessorKey: "no_pendaftaran",
			header: "No. Pendaftaran",
			icon: Hash,
			cell: ({ row }) => (
				<div className="inline-flex items-center gap-1.5 font-medium text-primary">
					<Hash className="size-3.5 shrink-0 text-muted-foreground" />
					{row.getValue("no_pendaftaran")}
				</div>
			),
		},
		{
			accessorKey: "nama_lengkap",
			header: "Nama Lengkap",
			icon: User,
			cell: ({ row }) => (
				<Link
					href={route("ppdb.show.peserta", row.original.id)}
					className="inline-flex items-center gap-1.5 font-medium hover:underline"
				>
					<User className="size-3.5 shrink-0 text-muted-foreground" />
					{row.getValue("nama_lengkap")}
				</Link>
			),
		},
		{
			accessorKey: "jenis_kelamin",
			header: "L/P",
			icon: UserRound,
			cell: ({ row }) => (
				<Badge variant="outline" className="gap-1">
					<UserRound className="size-3" />
					{row.getValue("jenis_kelamin") === "l" ? "L" : "P"}
				</Badge>
			),
		},
		{
			id: "baju",
			header: "Baju",
			icon: Shirt,
			cell: ({ row }) => (
				<span className="inline-flex items-center gap-1.5">
					<Shirt className="size-3.5 shrink-0 text-muted-foreground" />
					{row.original.ukuran_seragam?.baju || "-"}
				</span>
			),
		},
		{
			id: "sepatu",
			header: "Sepatu",
			icon: Shirt,
			cell: ({ row }) => (
				<span className="inline-flex items-center gap-1.5">
					<Shirt className="size-3.5 shrink-0 text-muted-foreground" />
					{row.original.ukuran_seragam?.sepatu || "-"}
				</span>
			),
		},
		{
			id: "actions",
			header: "Aksi",
			icon: Settings2,
			cell: ({ row }) => (
				<Button size="sm" onClick={() => handleEdit(row.original)}>
					<Pencil className="size-3.5" />
					Ubah
				</Button>
			),
		},
	];

	const handleYearChange = (value: string) => {
		router.get(
			route("ppdb.seragam.show"),
			{ tahun: value },
			{ preserveState: true },
		);
	};

	return (
		<>
			<Head title="Ukuran Seragam Siswa" />

			<div className="space-y-6">
				<AlertMessages flash={flash} />

				<div className="flex sm:flex-row flex-col justify-between gap-4">
					<div className="w-full sm:w-1/4">
						<Select value={String(tahun)} onValueChange={handleYearChange}>
							<SelectTrigger>
								<SelectValue placeholder="Pilih Tahun" />
							</SelectTrigger>
							<SelectContent>
								{years.map((y) => (
									<SelectItem key={y} value={String(y)}>
										{y}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<ExportStatusDialog
							routeName="export.seragam"
							params={{ tahun }}
							defaultStatus="diterima"
						/>
					</div>
				</div>

				<DataTable
					columns={columns}
					data={pesertappdb.data}
					pagination={{ links: pesertappdb.links }}
					searchPlaceholder="Cari nama, no pend..."
				/>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Ubah Ukuran Seragam</DialogTitle>
							<DialogDescription>
								{selectedPeserta?.nama_lengkap}
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={submit} className="space-y-6">
							<div className="gap-4 grid grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="baju">Ukuran Baju</Label>
									<Input
										id="baju"
										value={formData.baju}
										onChange={(e) => setData("baju", e.target.value)}
									/>
									{errors.baju && (
										<p className="text-sm text-destructive">{errors.baju}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="sepatu">Ukuran Sepatu</Label>
									<Input
										id="sepatu"
										value={formData.sepatu}
										onChange={(e) => setData("sepatu", e.target.value)}
									/>
									{errors.sepatu && (
										<p className="text-sm text-destructive">{errors.sepatu}</p>
									)}
								</div>
							</div>

							<div className="space-y-4">
								<Label className="text-base font-semibold">Ceklist Kelengkapan</Label>
								<div className="gap-4 grid grid-cols-2">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="baju_batik"
											checked={formData.baju_batik}
											onCheckedChange={(checked) =>
												setData("baju_batik", !!checked)
											}
										/>
										<Label htmlFor="baju_batik">Baju Batik</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="seragam_olahraga"
											checked={formData.seragam_olahraga}
											onCheckedChange={(checked) =>
												setData("seragam_olahraga", !!checked)
											}
										/>
										<Label htmlFor="seragam_olahraga">Seragam Olahraga</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="atribut"
											checked={formData.atribut}
											onCheckedChange={(checked) =>
												setData("atribut", !!checked)
											}
										/>
										<Label htmlFor="atribut">Atribut</Label>
									</div>
								</div>
							</div>

							<DialogFooter>
								<Button type="submit" disabled={processing}>
									Simpan Perubahan
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
