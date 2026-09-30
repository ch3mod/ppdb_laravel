import { AlertMessages } from "@/components/alert-messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";

interface Photo { id: number; path: string }
interface Extracurricular { id: number; name: string; description: string | null; icon: string; color: string; sort_order: number; is_active: boolean; photos: Photo[] }

export default function Index({ extracurriculars }: { extracurriculars: Extracurricular[] }) {
	const { flash, errors } = usePage<any>().props;
	const [editing, setEditing] = useState<Extracurricular | null>(null);
	const form = useForm({ _method: "post", name: "", description: "", icon: "star", color: "bg-primary", sort_order: 0, is_active: true, photos: [] as File[] });

	const reset = () => { form.reset(); form.setData("_method", "post"); form.clearErrors(); setEditing(null); };
	const edit = (item: Extracurricular) => { setEditing(item); form.setData({ _method: "put", name: item.name, description: item.description || "", icon: item.icon, color: item.color, sort_order: item.sort_order, is_active: item.is_active, photos: [] }); };
	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		const options = { forceFormData: true, onSuccess: reset } as const;
		if (editing) form.post(route("admin.extracurriculars.update", editing.id), options);
		else form.post(route("admin.extracurriculars.store"), options);
	};
	const remove = (id: number) => { if (window.confirm("Hapus ekstrakurikuler ini?")) router.delete(route("admin.extracurriculars.destroy", id)); };
	const removePhoto = (id: number) => { if (window.confirm("Hapus foto ini?")) router.delete(route("admin.extracurriculars.photos.destroy", id)); };

	return <>
		<Head title="Ekstrakurikuler" />
		<AlertMessages flash={flash} />
		{Object.keys(errors || {}).length > 0 && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{Object.values(errors).map((error, index) => <p key={index}>{String(error)}</p>)}</div>}
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Ekstrakurikuler</h1><p className="text-muted-foreground">Kelola kegiatan dan galeri foto.</p></div><Button type="button" onClick={reset}><Plus className="mr-2 size-4" />Tambah</Button></div>
			<Card className="border-primary/20"><CardHeader><CardTitle>{editing ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}</CardTitle><p className="text-sm text-muted-foreground">Isi informasi kegiatan dan upload foto galeri.</p></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4 md:grid-cols-2" encType="multipart/form-data">
				<div><Label htmlFor="name">Nama</Label><Input id="name" value={form.data.name} onChange={e => form.setData("name", e.target.value)} /></div>
				<div><Label htmlFor="sort_order">Urutan</Label><Input id="sort_order" type="number" value={form.data.sort_order} onChange={e => form.setData("sort_order", Number(e.target.value))} /></div>
				<div className="md:col-span-2"><Label htmlFor="description">Deskripsi</Label><Textarea id="description" value={form.data.description} onChange={e => form.setData("description", e.target.value)} /></div>
				<div><Label htmlFor="icon">Ikon Lucide</Label><Input id="icon" value={form.data.icon} onChange={e => form.setData("icon", e.target.value)} placeholder="star, tent, book-open" /></div>
				<div><Label htmlFor="color">Kelas warna Tailwind</Label><Input id="color" value={form.data.color} onChange={e => form.setData("color", e.target.value)} placeholder="bg-amber-500" /></div>
				<div className="md:col-span-2"><Label htmlFor="photos">Tambah foto galeri</Label><Input id="photos" type="file" accept="image/*" multiple onChange={e => form.setData("photos", Array.from(e.target.files || []))} /><p className="mt-1 text-xs text-muted-foreground">Maksimal 5 MB per foto.</p></div>
				<div className="flex gap-2 md:col-span-2"><Button type="submit" disabled={form.processing}><Upload className="mr-2 size-4" />{editing ? "Simpan" : "Tambah"}</Button>{editing && <Button type="button" variant="outline" onClick={reset}>Batal</Button>}</div>
			</form></CardContent></Card>
			<div className="grid gap-4 md:grid-cols-2">{extracurriculars.map(item => <Card key={item.id}><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{item.name}</CardTitle><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => edit(item)}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(item.id)}><Trash2 className="size-4 text-destructive" /></Button></div></CardHeader><CardContent><p className="mb-3 text-sm text-muted-foreground">{item.description || "-"}</p><div className="grid grid-cols-3 gap-2">{item.photos.map(photo => <div key={photo.id} className="relative"><img src={`/storage/${photo.path}`} alt={item.name} className="aspect-square w-full rounded-lg object-cover" /><Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 size-7" onClick={() => removePhoto(photo.id)}><Trash2 className="size-3" /></Button></div>)}</div>{item.photos.length === 0 && <p className="text-xs text-muted-foreground">Belum ada foto.</p>}</CardContent></Card>)}</div>
		</div>
	</>;
}
