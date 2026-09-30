import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import {
	Award,
	ChevronRight,
	ChevronUp,
	File,
	FileText,
	Gauge,
	HeartHandshake,
	IdCard,
	Medal,
	MonitorCog,
	Settings,
	Shirt,
	User,
	UserCheck,
	UserPlus,
	UserX,
} from "lucide-react";
import { useEffect } from "react";

export function AppSidebar() {
	const { url, props } = usePage<any>();
	const { isMobile, setOpenMobile } = useSidebar();
	const user = props.auth?.user;

	// Close sidebar on mobile when navigating
	useEffect(() => {
		if (isMobile) {
			setOpenMobile(false);
		}
	}, [url, isMobile, setOpenMobile]);

	const isActive = (path: string) => url.startsWith(path);

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
									<img
										src="/img/logo.png"
										alt="Logo"
										className="size-6 rounded"
									/>
								</div>
								<div className="flex flex-col gap-0 leading-none">
									<span className="font-bold text-sm">SDN Pangauban 02</span>
									<span className="text-[10px] text-muted-foreground">
										Admin PPDB
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Dashboard */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url === "/dashboard" || url === "/dashboard/"}
								>
									<Link href={route("dashboard")}>
										<Gauge className="size-4" />
										<span>Dashboard</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* PPDB */}
							<CollapsibleMenuItem
								icon={<UserPlus className="size-4" />}
								title="PPDB"
								defaultOpen={isActive("/dashboard/ppdb")}
							>
								<SidebarMenuSubItem>
									<SidebarMenuSubButton
										asChild
										isActive={url.includes("/ppdb/list-pendaftar")}
									>
										<Link href={route("ppdb.list.pendaftar")}>
											List Pendaftar
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
								<SidebarMenuSubItem>
									<SidebarMenuSubButton
										asChild
										isActive={url.includes("/ppdb/tambah-pendaftar")}
									>
										<Link href={route("ppdb.tambah.pendaftar")}>
											Tambah Pendaftar
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							</CollapsibleMenuItem>

							{/* Ukuran Seragam */}
							<CollapsibleMenuItem
								icon={<Shirt className="size-4" />}
								title="Ukuran Seragam"
								defaultOpen={isActive("/dashboard/ukuran-seragam")}
							>
								<SidebarMenuSubItem>
									<SidebarMenuSubButton
										asChild
										isActive={
											url === "/dashboard/ukuran-seragam/show" ||
											url === "/dashboard/ukuran-seragam/show/"
										}
									>
										<Link href={route("ppdb.seragam.show")}>
											List Peserta
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							</CollapsibleMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={url.includes("/dashboard/ekstrakurikuler")}>
									<Link href={route("admin.extracurriculars.index")}>
										<Award className="size-4" />
										<span>Ekstrakurikuler</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Cetak Dokumen */}
				<SidebarGroup>
					<SidebarGroupLabel>Cetak Dokumen</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Formulir Pendaftaran */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/dashboard/formulir")}
								>
									<Link href={route("ppdb.formulir.show")}>
										<File className="size-4" />
										<span>Formulir Pendaftaran</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Kartu Pendaftaran */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/dashboard/kartu-pendaftaran")}
								>
									<Link href={route("ppdb.kartu.show")}>
										<IdCard className="size-4" />
										<span>Kartu Pendaftaran</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Surat Diterima */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/dashboard/surat")}
								>
									<Link href={route("ppdb.surat.show")}>
										<FileText className="size-4" />
										<span>Surat Diterima</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Beasiswa */}
				<SidebarGroup>
					<SidebarGroupLabel>Beasiswa</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/beasiswa/kip")}
								>
									<Link href={route("ppdb.beasiswa.kip")}>
										<Medal className="size-4" />
										<span>KIP / PIP</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/beasiswa/yatim-piatu")}
								>
									<Link href={route("ppdb.beasiswa.yatim-piatu")}>
										<HeartHandshake className="size-4" />
										<span>UPZ Baznas</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Pengaturan */}
				<SidebarGroup>
					<SidebarGroupLabel>Pengaturan Akun</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/setting/profile")}
								>
									<Link href={route("setting.profile")}>
										<User className="size-4" />
										<span>Pengaturan Profile</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={url.includes("/setting/ppdb")}
								>
									<Link href={route("ppdb.set.batas.akhir")}>
										<Settings className="size-4" />
										<span>Pengaturan PPDB</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User className="size-4" />
									<span>{user?.name ?? "User"}</span>
									<ChevronUp className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem asChild>
									<Link href={route("setting.profile")}>
										<User className="mr-2 size-4" />
										Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href={route("logout")} method="post" as="button">
										<MonitorCog className="mr-2 size-4" />
										Logout
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

function CollapsibleMenuItem({
	icon,
	title,
	defaultOpen = false,
	children,
}: {
	icon: React.ReactNode;
	title: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	return (
		<Collapsible defaultOpen={defaultOpen} className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						{icon}
						<span>{title}</span>
						<ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>{children}</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}
