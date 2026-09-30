import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HandHeart, Wallet } from "lucide-react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const scholarships = [
	{
		icon: Wallet,
		title: "Program Indonesia Pintar (PIP)",
		description:
			"Bantuan tunai pendidikan dari pemerintah bagi keluarga kurang mampu atau pemegang KIP/PKH. Sekolah siap membantu pendataan & pengusulan ke dinas.",
		benefits: [
			{ rank: "Program PIP", reward: "Bantuan Pendidikan dari Pemerintah" },
		],
		color: "from-teal-500 to-cyan-600",
		requirement: "Fotokopi KIP/KKS/PKH & SKTM dari Desa",
	},
	{
		icon: HandHeart,
		title: "Program UPZ Baznas",
		description:
			"Program Unit Pengumpulan Zakat (UPZ) Baznas untuk membantu siswa kurang mampu, santunan, bantuan pendidikan, dan kegiatan sosial.",
		benefits: [
			{ rank: "Siswa Kurang Mampu", reward: "Bantuan Pendidikan" },
			{ rank: "Kegiatan Sosial", reward: "Santunan" },
		],
		color: "from-violet-500 to-purple-600",
		requirement: "Data siswa dan dokumen pendukung sesuai ketentuan program",
	},
];

export function ScholarshipSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

			cardsRef.current.forEach((card, index) => {
				if (card) {
					gsap.fromTo(
						card,
						{ opacity: 0, y: 60, scale: 0.95 },
						{
							opacity: 1,
							y: 0,
							scale: 1,
							duration: 0.6,
							delay: index * 0.1,
							ease: "power3.out",
							scrollTrigger: { trigger: card, start: "top 85%" },
						},
					);
				}
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="beasiswa"
			className="py-24 md:py-32 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden"
		>
			<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div ref={titleRef} className="text-center mb-16">
					<span className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-semibold rounded-full mb-4">
						Kesempatan Emas
					</span>
					<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
						Program Beasiswa
					</h2>
				<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
					SDN Pangauban 02 menyediakan berbagai program beasiswa untuk
					meringankan biaya pendidikan.
				</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					{scholarships.map((scholarship, index) => (
						<div
							key={index}
							ref={(el) => {
								cardsRef.current[index] = el;
							}}
							className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-border"
						>
							<div className={`h-2 bg-gradient-to-r ${scholarship.color}`} />
							<div className="p-6">
								<div className="flex items-center gap-4 mb-4">
									<div
										className={`w-14 h-14 bg-gradient-to-br ${scholarship.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
									>
										<scholarship.icon className="w-7 h-7 text-white" />
									</div>
									<div>
										<h3 className="font-bold text-foreground text-lg">
											{scholarship.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{scholarship.description}
										</p>
									</div>
								</div>

								<div className="space-y-2 mb-4">
									{scholarship.benefits.map((benefit, i) => (
										<div
											key={i}
											className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl"
										>
											<span className="text-sm text-foreground font-medium">
												{benefit.rank}
											</span>
											<span className="text-sm text-primary font-bold">
												{benefit.reward}
											</span>
										</div>
									))}
								</div>

								<p className="text-xs text-muted-foreground italic border-t pt-3">
									*{scholarship.requirement}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
