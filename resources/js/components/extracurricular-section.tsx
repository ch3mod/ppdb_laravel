"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Dumbbell, Maximize2, Shield, Star, Tent, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const icons = { book: BookOpen, "book-open": BookOpen, dumbbell: Dumbbell, shield: Shield, star: Star, swords: Shield, tent: Tent };
type Photo = { id: number; path: string; url?: string };
type Item = { id: number; name: string; description: string | null; icon: string; color: string; photos: Photo[] };

export function ExtracurricularSection({ extracurriculars }: { extracurriculars: Item[] }) {
	const [filter, setFilter] = useState("Semua");
	const [selected, setSelected] = useState<{ item: Item; photo: Photo } | null>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
	const categories = ["Semua", ...extracurriculars.map(item => item.name)];
	const gallery = extracurriculars.flatMap(item => item.photos.map(photo => ({ item, photo })));
	const visibleGallery = filter === "Semua" ? gallery : gallery.filter(({ item }) => item.name === filter);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: titleRef.current, start: "top 80%" } });
			cardsRef.current.forEach((card, index) => {
				if (card) gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: index * 0.06, ease: "power3.out" });
			});
		}, sectionRef);
		return () => ctx.revert();
	}, [filter, extracurriculars]);

	const imageUrl = (photo: Photo) => photo.url || `/storage/${photo.path}`;

	return <>
		<section ref={sectionRef} id="ekskul" className="relative overflow-hidden bg-slate-50 py-24 dark:bg-slate-950 md:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div ref={titleRef} className="mb-10 max-w-3xl">
					<span className="mb-3 inline-block text-xs font-bold tracking-[0.22em] text-primary">KEGIATAN SISWA</span>
					<h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl">Ekstrakurikuler</h2>
					<p className="text-base leading-8 text-slate-500 dark:text-slate-400">Berbagai kegiatan untuk mengembangkan minat, bakat, karakter, dan keterampilan siswa di luar pembelajaran.</p>
				</div>

				<div className="mb-8 flex flex-wrap gap-2">
					{categories.map(category => <button key={category} type="button" onClick={() => setFilter(category)} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${filter === category ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"}`}>{category}</button>)}
				</div>

				{visibleGallery.length > 0 ? <div className="grid auto-rows-[230px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{visibleGallery.map(({ item, photo }, index) => { const Icon = icons[item.icon as keyof typeof icons] || Star; const large = index % 5 === 0; return <div key={photo.id} ref={el => { cardsRef.current[index] = el; }} className={`group relative overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 ${large ? "sm:col-span-2 sm:row-span-2" : ""}`}>
						<img src={imageUrl(photo)} alt={`${item.name} - kegiatan`} className="size-full object-cover transition duration-700 group-hover:scale-110" />
						<div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100 max-sm:opacity-100">
							<div className="text-white"><span className="text-[10px] font-bold tracking-[0.18em] text-white/70">EKSTRAKURIKULER</span><h3 className="mt-1 text-2xl font-bold">{item.name}</h3><p className="mt-1 line-clamp-2 max-w-xs text-sm text-white/75">{item.description}</p></div>
							<button type="button" aria-label={`Lihat foto ${item.name}`} onClick={() => setSelected({ item, photo })} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 transition hover:rotate-45"><Maximize2 className="size-5" /></button>
						</div>
						<div className={`absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl ${item.color} shadow-lg`}><Icon className="size-5 text-white" /></div>
					</div>; })}
				</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-muted-foreground dark:border-slate-700 dark:bg-slate-900">Galeri foto belum tersedia.</div>}
			</div>
		</section>

		{selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><div className="relative max-w-5xl" onClick={event => event.stopPropagation()}><button type="button" aria-label="Tutup galeri" onClick={() => setSelected(null)} className="absolute -right-3 -top-12 flex size-10 items-center justify-center rounded-full bg-white text-slate-900"><X /></button><img src={imageUrl(selected.photo)} alt={selected.item.name} className="max-h-[78vh] rounded-2xl object-contain shadow-2xl" /><h3 className="mt-4 text-center text-xl font-bold text-white">{selected.item.name}</h3></div></div>}
	</>;
}
