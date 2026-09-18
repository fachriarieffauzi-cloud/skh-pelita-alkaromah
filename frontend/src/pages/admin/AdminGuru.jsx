import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, UserCircle2 } from "lucide-react";

const empty = { name: "", position: "", subject: "", photo_url: "", order: 0, published: true };

export default function AdminGuru() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const load = async () => setItems((await api.get("/admin/teachers")).data);
  useEffect(() => { load(); }, []);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    try {
      if (editingId) await api.put(`/admin/teachers/${editingId}`, form);
      else await api.post("/admin/teachers", form);
      toast.success("Data berhasil disimpan."); setOpen(false); setForm(empty); setEditingId(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };
  const edit = (t) => { setForm({ name: t.name, position: t.position, subject: t.subject, photo_url: t.photo_url, order: t.order, published: t.published }); setEditingId(t.id); setOpen(true); };
  const del = async (id) => { await api.delete(`/admin/teachers/${id}`); toast.success("Data berhasil dihapus."); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-bold text-stone-900">Guru & Tendik</h1><p className="text-stone-600 mt-1">Kelola data tenaga pendidik dan kependidikan.</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(empty); setEditingId(null); } }}>
          <DialogTrigger asChild><Button className="rounded-full bg-orange-600 hover:bg-orange-700 h-11 px-5 text-white font-semibold" data-testid="add-teacher-btn"><Plus className="h-4 w-4 mr-2" /> Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg bg-white">
            <DialogHeader><DialogTitle>{editingId ? "Ubah Data" : "Tambah Data"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nama</Label><Input value={form.name} onChange={(e) => upd("name", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Jabatan</Label><Input value={form.position} onChange={(e) => upd("position", e.target.value)} /></div>
                <div><Label>Bidang</Label><Input value={form.subject} onChange={(e) => upd("subject", e.target.value)} /></div>
              </div>
              <div><Label>URL Foto</Label><Input value={form.photo_url} onChange={(e) => upd("photo_url", e.target.value)} placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Urutan</Label><Input type="number" value={form.order} onChange={(e) => upd("order", parseInt(e.target.value || "0"))} /></div>
                <div className="flex items-center gap-3 mt-6"><Switch checked={form.published} onCheckedChange={(v) => upd("published", v)} /><span className="text-sm">{form.published ? "Publish" : "Draft"}</span></div>
              </div>
            </div>
            <DialogFooter><Button onClick={save} className="bg-orange-600 hover:bg-orange-700 text-white">Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white border border-stone-200 overflow-hidden">
            <div className="aspect-video bg-stone-100 overflow-hidden">{t.photo_url ? <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300"><UserCircle2 className="h-14 w-14" /></div>}</div>
            <div className="p-4">
              <div className="font-display font-bold text-stone-900">{t.name}</div>
              <div className="text-xs text-orange-700 font-semibold mt-1">{t.position} · {t.published ? "Publish" : "Draft"}</div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => edit(t)}><Pencil className="h-3.5 w-3.5 mr-1" /> Ubah</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus</Button></AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader><AlertDialogTitle>Hapus data ini?</AlertDialogTitle><AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => del(t.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="rounded-2xl border border-dashed p-10 text-center text-stone-500 col-span-full">Belum ada data guru.</div>}
      </div>
    </div>
  );
}
