import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import {
    Medal,
    Settings,
    UserCheck,
    Users,
    UserX,
    Wallet,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface DashboardProps {
	stats?: {
		total?: number;
		total_pendaftar?: number;
		diterima: number;
		ditolak: number;
		seleksi: number;
		daftar_ulang: number;
		belum_daftar_ulang: number;
	};
	gender?: { l: number; p: number };
	monthlyTrend?: { bulan?: string; month?: string; jumlah?: number; total?: number }[];
	topSekolah?: {
		asal_sekolah?: string;
		sekolah?: string;
		as_count?: number;
		total?: number;
	}[];
	beasiswa?: { kip: number };
	tahun: number;
	years?: number[];
	[key: string]: any;
}

const COLORS = ["#0ea5e9", "#38bdf8", "#0284c7", "#7dd3fc", "#0369a1", "#bae6fd"];

export default function Dashboard({
	stats,
	gender,
	monthlyTrend,
	topSekolah,
	beasiswa,
	tahun,
	years,
}: DashboardProps) {
	const currentYear = new Date().getFullYear();
	const yearList: number[] =
		years && years.length > 0 ? years : [tahun || currentYear];

	const handleYearChange = (value: string) => {
		router.visit(route("dashboard", { tahun: value }), {
			preserveState: true,
			preserveScroll: true,
		});
	};

	const stat = {
		total_pendaftar: stats?.total_pendaftar ?? stats?.total ?? 0,
		diterima: stats?.diterima ?? 0,
		ditolak: stats?.ditolak ?? 0,
		seleksi: stats?.seleksi ?? 0,
		daftar_ulang: stats?.daftar_ulang ?? 0,
		belum_daftar_ulang: stats?.belum_daftar_ulang ?? 0,
	};

	const genderData = [
		{ name: "Laki-laki", value: gender?.l ?? 0 },
		{ name: "Perempuan", value: gender?.p ?? 0 },
	];

	const monthlyTrendData = (monthlyTrend || []).map((item) => ({
		name: item.bulan ?? item.month ?? "",
		jumlah: item.jumlah ?? item.total ?? 0,
	}));

	const topSchoolsData = (topSekolah || []).slice(0, 10).map((item) => ({
		name: item.asal_sekolah ?? item.sekolah ?? "",
		jumlah: item.as_count ?? item.total ?? 0,
	}));

	const beasiswaStat = {
		kip: beasiswa?.kip ?? 0,
	};

	return (
		<>
			<Head title="Dashboard" />

			<div className="space-y-6">
				{/* Header with Year Filter */}
				<div className="flex flex-wrap justify-between items-center gap-4">
					<h1 className="font-bold text-2xl">Dashboard</h1>
					<div className="flex items-center gap-2">
						<Label htmlFor="year-filter">Data Tahun:</Label>
						<Select
							value={String(tahun || currentYear)}
							onValueChange={handleYearChange}
						>
							<SelectTrigger className="w-[120px]" id="year-filter">
								<SelectValue placeholder="Pilih Tahun" />
							</SelectTrigger>
							<SelectContent>
								{yearList.map((year) => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Ringkasan Utama */}
				<section>
					<h3 className="mb-4 font-semibold text-xl">Ringkasan Utama</h3>
					<div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
						<StatsCard
							title="Total Pendaftar"
							value={stat.total_pendaftar}
							icon={Users}
							iconClassName="bg-amber-500"
						/>
						<StatsCard
							title="Total Peserta Diterima"
							value={stat.diterima}
							icon={UserCheck}
							iconClassName="bg-emerald-500"
						/>
						<StatsCard
							title="Total Peserta Ditolak"
							value={stat.ditolak}
							icon={UserX}
							iconClassName="bg-red-500"
						/>
						<StatsCard
							title="Peserta Proses Seleksi"
							value={stat.seleksi}
							icon={Settings}
							iconClassName="bg-slate-500"
						/>
						<StatsCard
							title="Sudah Daftar Ulang"
							value={stat.daftar_ulang}
							icon={UserCheck}
							iconClassName="bg-sky-500"
						/>
						<StatsCard
							title="Belum Daftar Ulang"
							value={stat.belum_daftar_ulang}
							icon={UserX}
							iconClassName="bg-orange-500"
						/>
					</div>
				</section>

				{/* Analisis Pendaftar */}
				<section>
					<h3 className="mb-4 font-medium text-lg">Analisis Pendaftar</h3>
					<div className="gap-4 grid md:grid-cols-2">
						{/* Gender pie */}
						<Card>
							<CardHeader>
								<CardTitle>Perbandingan Jenis Kelamin Pendaftar</CardTitle>
							</CardHeader>
							<CardContent className="px-1">
								{stat.total_pendaftar > 0 ? (
									<ResponsiveContainer width="100%" height={300}>
										<PieChart>
											<Pie
												data={genderData}
												cx="50%"
												cy="50%"
												labelLine={false}
												label={({ name, percent }) =>
													`${name} ${(percent * 100).toFixed(0)}%`
												}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
											>
												{genderData.map((entry, index) => (
													<Cell
														key={`cell-${entry.name}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								) : (
									<p className="text-muted-foreground">Belum ada data</p>
								)}
							</CardContent>
						</Card>

						{/* Monthly trend */}
						<Card>
							<CardHeader>
								<CardTitle>Tren Pendaftar Per Bulan</CardTitle>
							</CardHeader>
							<CardContent className="px-1">
								{monthlyTrendData.length > 0 ? (
									<ResponsiveContainer width="100%" height={300}>
										<BarChart data={monthlyTrendData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis allowDecimals={false} />
											<Tooltip />
											<Legend />
											<Bar dataKey="jumlah" fill="#0ea5e9" name="Pendaftar" radius={[4, 4, 0, 0]} />
										</BarChart>
									</ResponsiveContainer>
								) : (
									<p className="text-muted-foreground">Belum ada data</p>
								)}
							</CardContent>
						</Card>
					</div>
				</section>

				{/* Analisis Asal TK */}
				<section>
					<h3 className="mb-4 font-medium text-lg">Analisis Asal TK</h3>
					<div className="gap-4 grid md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Top 10 Asal TK Pendaftar</CardTitle>
							</CardHeader>
							<CardContent className="px-1">
								{topSchoolsData.length > 0 ? (
									<ResponsiveContainer width="100%" height={320}>
										<BarChart data={topSchoolsData} layout="vertical">
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis type="number" allowDecimals={false} />
											<YAxis
												dataKey="name"
												type="category"
												width={180}
												tick={{ fontSize: 11 }}
											/>
											<Tooltip />
											<Bar dataKey="jumlah" fill="#38bdf8" radius={[0, 4, 4, 0]} />
										</BarChart>
									</ResponsiveContainer>
								) : (
									<p className="text-muted-foreground">Belum ada data</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row justify-between items-center">
								<CardTitle>Statistik Penerima Beasiswa</CardTitle>
								<Button asChild variant="outline" size="sm" className="hover:bg-background cursor-default">
									<a href={route("ppdb.beasiswa.kip")}>Lihat Detail</a>
								</Button>
							</CardHeader>
							<CardContent>
								<div className="gap-4 grid grid-cols-2">
									<StatsCard
										title="PIP"
										value={beasiswaStat.kip}
										icon={Wallet}
										iconClassName="bg-teal-500"
									/>
									<StatsCard
										title="UPZ Baznas"
										value={0}
										icon={Medal}
										iconClassName="bg-violet-500"
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				</section>
			</div>
		</>
	);
}

function StatsCard({
	title,
	value,
	icon: Icon,
	iconClassName,
}: {
	title: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	iconClassName?: string;
}) {
	return (
		<Card className="py-4">
			<div className="flex items-center px-4 gap-4">
				<div className={cn("p-3 rounded-lg shrink-0", iconClassName)}>
					<Icon className="w-6 h-6 text-white" />
				</div>
				<div>
					<div className="text-2xl font-bold leading-none">{value}</div>
					<div className="text-sm font-medium text-muted-foreground mt-1">
						{title}
					</div>
				</div>
			</div>
		</Card>
	);
}
