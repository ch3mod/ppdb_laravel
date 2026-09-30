import { LoginForm } from "@/components/login-form";
import { Head } from "@inertiajs/react";

export default function Login() {
	return (
		<div className="min-h-svh grid lg:grid-cols-2">
			<Head title="Login - PPDB SDN Pangauban 02" />

			{/* Panel kiri - Branding */}
			<div className="hidden lg:flex flex-col relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-sky-800">
				{/* Background decorative circles */}
				<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
				<div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-white/5" />
				<div className="absolute top-1/3 -left-10 w-48 h-48 rounded-full bg-sky-400/20" />

				<div className="relative z-10 flex flex-col items-center justify-center flex-1 px-12 text-white">
					<div className="flex flex-col items-center gap-6 text-center max-w-sm">
						<div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-4 ring-white/20">
							<img
								src="/img/logo.png"
								alt="Logo SDN Pangauban 02"
								className="w-full h-full object-contain"
							/>
						</div>
						<div>
							<h1 className="text-3xl font-bold leading-tight drop-shadow-md">
								SDN Pangauban 02
							</h1>
							<p className="text-sky-200 text-sm font-medium mt-1">
								Kec. Katapang, Kab. Bandung
							</p>
						</div>
						<div className="w-12 h-0.5 bg-white/30 rounded-full" />
						<p className="text-white/80 text-sm leading-relaxed">
							Sistem Penerimaan Peserta Didik Baru (PPDB) — Panel
							Administrasi Sekolah
						</p>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 mt-4 w-full">
							{[
								{ value: "200+", label: "Siswa" },
								{ value: "6", label: "Rombel" },
								{ value: "1970", label: "Berdiri" },
							].map((s) => (
								<div
									key={s.label}
									className="bg-white/10 backdrop-blur rounded-xl p-3 text-center"
								>
									<p className="font-bold text-lg leading-none">
										{s.value}
									</p>
									<p className="text-white/70 text-xs mt-1">{s.label}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Bottom credit */}
				<div className="relative z-10 px-12 pb-8 text-center">
					<p className="text-white/40 text-xs">
						&copy; {new Date().getFullYear()} SDN Pangauban 02. Hak Cipta
						Dilindungi.
					</p>
				</div>
			</div>

			{/* Panel kanan - Form */}
			<div className="flex flex-col items-center justify-center p-6 md:p-10 bg-background">
				{/* Mobile logo */}
				<div className="flex lg:hidden flex-col items-center gap-3 mb-8">
					<div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
						<img
							src="/img/logo.png"
							alt="Logo SDN Pangauban 02"
							className="w-full h-full object-contain"
						/>
					</div>
					<div className="text-center">
						<p className="font-bold text-lg text-foreground">
							SDN Pangauban 02
						</p>
						<p className="text-xs text-muted-foreground">
							Panel Administrasi PPDB
						</p>
					</div>
				</div>
				<div className="w-full max-w-sm">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
