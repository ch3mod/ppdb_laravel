import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RegistrationForm } from "@/components/registration-form";
import { Head } from "@inertiajs/react";

export default function PendaftaranPage() {
	return (
		<>
			<Head title="Formulir Pendaftaran | PPDB SDN Pangauban 02" />
			<Navbar />
			<main className="min-h-screen bg-gradient-to-b from-secondary via-background to-accent pt-24 pb-16">
				<RegistrationForm />
			</main>
			<Footer />
		</>
	);
}
