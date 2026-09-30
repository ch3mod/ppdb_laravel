import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	Award,
	BookOpen,
	Building,
	CheckCircle,
	Dumbbell,
	GraduationCap,
	HeartPulse,
	Monitor,
	Users,
	Utensils,
} from "lucide-react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const advantages = [
	{
		icon: GraduationCap,
		title: "Guru Berkualitas",
		description: "Guru berpengalaman dan tersertifikasi di bidangnya",
	},
	{
		icon: Award,
		title: "Pembelajaran Menyenangkan",
		description: "Pendekatan pembelajaran aktif yang ramah bagi anak",
	},
	{
		icon: Users,
		title: "Pendampingan Individual",
		description: "Pendampingan belajar yang sesuai dengan kebutuhan setiap siswa",
	},
	{
		icon: HeartPulse,
		title: "Pendampingan Penuh Perhatian",
		description: "Lingkungan belajar yang aman, nyaman, dan mendukung tumbuh kembang anak",
	},
];

const facilities = [
	{
		icon: Building,
		name: "Ruang Kelas",
		description: "Ruang kelas nyaman & kondusif",
	},
	{
		icon: BookOpen,
		name: "Perpustakaan",
		description: "Koleksi buku lengkap",
	},
	{
		icon: HeartPulse,
		name: "UKS",
		description: "Unit Kesehatan Sekolah",
	},
	{
		icon: Dumbbell,
		name: "Lapangan Olahraga",
		description: "Voli, Futsal, Basket",
	},
	{
		icon: Utensils,
		name: "Kantin Sekolah",
		description: "Makanan sehat & terjangkau",
	},
	{
		icon: Building,
		name: "Tempat Ibadah",
		description: "Tempat ibadah yang representatif",
	},
	{
		icon: Users,
		name: "Ruang Guru & Kepala Sekolah",
		description: "Layanan administrasi sekolah",
	},
	{
		icon: Monitor,
		name: "Labkom",
		description: "Laboratorium komputer",
	},
];

export function FacilitiesSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const leftRef = useRef<HTMLDivElement>(null);
	const rightRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				titleRef.current,
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
				},
			);

			gsap.fromTo(
				leftRef.current,
				{ opacity: 0, x: -60 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					scrollTrigger: { trigger: leftRef.current, start: "top 80%" },
				},
			);

			gsap.fromTo(
				rightRef.current,
				{ opacity: 0, x: 60 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					scrollTrigger: { trigger: rightRef.current, start: "top 80%" },
				},
			);
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="fasilitas"
			className="py-24 md:py-32 bg-background relative overflow-hidden"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div ref={titleRef} className="text-center mb-16">
					<span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
						Fasilitas Lengkap
					</span>
					<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
						Keunggulan & Fasilitas
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Fasilitas sekolah yang lengkap dan memadai untuk mendukung kegiatan
						belajar mengajar.
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-12 items-start">
					<div ref={leftRef}>
						<h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
							<div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
								<CheckCircle className="w-5 h-5 text-primary" />
							</div>
							Mengapa Memilih Kami?
						</h3>
						<div className="grid sm:grid-cols-2 gap-4">
							{advantages.map((item, index) => (
								<div
									key={index}
									className="p-6 bg-secondary/50 rounded-2xl hover:bg-secondary hover:shadow-lg transition-all duration-300 group cursor-default"
								>
									<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
										<item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
									</div>
									<h4 className="font-bold text-foreground mb-2">
										{item.title}
									</h4>
									<p className="text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
							))}
						</div>
					</div>

					<div ref={rightRef}>
						<h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
							<div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
								<Building className="w-5 h-5 text-primary" />
							</div>
							Fasilitas Sekolah
						</h3>
						<div className="grid sm:grid-cols-2 gap-3">
							{facilities.map((facility, index) => (
								<div
									key={index}
									className="flex items-start gap-3 p-4 bg-accent/30 rounded-2xl hover:bg-accent hover:shadow-lg transition-all duration-300 group"
								>
									<div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300 border border-border">
										<facility.icon className="w-5 h-5 text-primary" />
									</div>
									<div>
										<h4 className="font-bold text-foreground text-sm">
											{facility.name}
										</h4>
										<p className="text-xs text-muted-foreground">
											{facility.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
