import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const CATS = ["Kegiatan Pembelajaran", "Kegiatan Sekolah", "Ekstrakurikuler", "Perayaan", "Kegiatan Siswa"];
const empty = { caption: "", category: "Kegiatan Sekolah", image_url: "", published: true };

export default function AdminGaleri() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const load = async () => setItems((await api.get("/admin/gallery")).data);
  useEffect(() => { load(); }, []);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    try { await api.post("/admin/gallery", form); toast.success("Foto berhasil ditambahkan."); setOpen(false); setForm(empty); load(); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };
  const del = async (id) => { await api.delete(`/admin/gallery/${id}`); toast.success("Foto berhasil dihapus."); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-bold text-stone-900">Galeri Kegiatan</h1><p className="text-stone-600 mt-1">Kelola foto galeri kegiatan sekolah.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full bg-orange-600 hover:bg-orange-700 h-11 px-5 text-white font-semibold"><Plus className="h-4 w-4 mr-2" /> Tambah Foto</Button></DialogTrigger>
          <DialogContent className="max-w-lg bg-white">
            <DialogHeader><DialogTitle>Tambah Foto Galeri</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>URL Gambar</Label><Input value={form.image_url} onChange={(e) => upd("image_url", e.target.value)} placeholder="https://..." /></div>
              <div><Label>Caption</Label><Input value={form.caption} onChange={(e) => upd("caption", e.target.value)} /></div>
              <div><Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => upd("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => upd("published", v)} /><span className="text-sm">{form.published ? "Publish" : "Draft"}</span></div>
            </div>
            <DialogFooter><Button onClick={save} className="bg-orange-600 hover:bg-orange-700 text-white">Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((g) => (
          <div key={g.id} className="group relative rounded-xl overflow-hidden bg-stone-100">
            <img src={g.image_url} alt={g.caption} className="w-full aspect-square object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">{g.category} · {g.published ? "Publish" : "Draft"}</div>
              <div className="text-xs font-semibold line-clamp-1">{g.caption}</div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild><button className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-4 w-4" /></button></AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader><AlertDialogTitle>Hapus foto ini?</AlertDialogTitle><AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => del(g.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full rounded-2xl border border-dashed p-10 text-center text-stone-500">Belum ada foto.</div>}
      </div>
    </div>
  );
}
