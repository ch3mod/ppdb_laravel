import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { Eye, EyeOff, KeyRound, User } from "lucide-react";
import { useState } from "react";

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const { data, setData, post, processing, errors } = useForm({
		niy: "",
		password: "",
		remember: false,
	});
	const [showPassword, setShowPassword] = useState(false);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("login"));
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border-border/60 shadow-lg">
				<CardHeader className="space-y-1 pb-4">
					<CardTitle className="text-2xl font-bold text-foreground">
						Selamat Datang
					</CardTitle>
					<CardDescription>
						Masukkan NIY dan password untuk mengakses dashboard PPDB
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={submit}>
						<div className="flex flex-col gap-5">
							<div className="gap-2 grid">
								<Label htmlFor="niy" className="font-medium">
									NIY
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="niy"
										type="text"
										placeholder="Nomor Induk Yayasan"
										value={data.niy}
										onChange={(e) => setData("niy", e.target.value)}
										autoFocus
										required
										className="pl-9"
									/>
								</div>
								{errors.niy && (
									<p className="font-medium text-destructive text-sm">
										{errors.niy}
									</p>
								)}
							</div>
							<div className="gap-2 grid">
								<Label htmlFor="password" className="font-medium">
									Password
								</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Password"
										value={data.password}
										onChange={(e) => setData("password", e.target.value)}
										required
										className="pl-9 pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2 transition-colors"
										aria-label={
											showPassword ? "Sembunyikan password" : "Tampilkan password"
										}
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="font-medium text-destructive text-sm">
										{errors.password}
									</p>
								)}
							</div>
							<Button
								type="submit"
								className="w-full h-10 font-semibold"
								disabled={processing}
							>
								{processing ? "Memproses..." : "Masuk"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
