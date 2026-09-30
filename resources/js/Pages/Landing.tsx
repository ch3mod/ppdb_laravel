import { CTASection } from "@/components/cta-section";
import { ExtracurricularSection } from "@/components/extracurricular-section";
import { FacilitiesSection } from "@/components/facilities-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { RegistrationFlow } from "@/components/registration-flow";
import { ScholarshipSection } from "@/components/scholarship-section";
import { Head } from "@inertiajs/react";

interface HomeProps {
	extracurriculars?: {
		id: number;
		name: string;
		description: string | null;
		icon: string;
		color: string;
		photos: { id: number; path: string; url?: string }[];
	}[];
}

export default function Home({ extracurriculars = [] }: HomeProps) {
	return (
		<main className="min-h-screen">
			<Head title="PPDB SDN Pangauban 02 | Penerimaan Murid Baru Kelas 1 2026/2027" />
			<Navbar />
			<HeroSection />
			<RegistrationFlow />
			<FacilitiesSection />
			<ScholarshipSection />
			<ExtracurricularSection extracurriculars={extracurriculars} />
			<CTASection />
			<Footer />
		</main>
	);
}
