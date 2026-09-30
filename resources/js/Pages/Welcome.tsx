import { Head, Link } from "@inertiajs/react";
import { GraduationCap } from "lucide-react";

export default function Welcome() {
	return (
		<>
			<Head title="PPDB SDN Pangauban 02" />
			<div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex flex-col items-center justify-center p-6 text-center">
				<div className="max-w-lg w-full space-y-8">
					<div className="flex flex-col items-center gap-4">
						<div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl ring-4 ring-primary/20">
							<img
								src="/img/logo.png"
								alt="Logo SDN Pangauban 02"
								className="w-full h-full object-contain"
							/>
						</div>
						<div>
							<h1 className="text-3xl font-extrabold tracking-tight text-primary">
								SDN Pangauban 02
							</h1>
							<p className="text-muted-foreground text-sm mt-1">
								Kec. Katapang, Kab. Bandung
							</p>
						</div>
					</div>

					<div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg border border-primary/10 space-y-4">
						<div className="flex items-center justify-center gap-2 text-primary">
							<GraduationCap className="w-6 h-6" />
							<h2 className="text-xl font-bold">
								Penerimaan Peserta Didik Baru
							</h2>
						</div>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Tahun Ajaran {new Date().getFullYear()}/{new Date().getFullYear() + 1} — Kelas 1 SD
						</p>
						<Link
							href="/"
							className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:scale-105"
						>
							Kunjungi Halaman PPDB
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
