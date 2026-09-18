import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empty = { title: "", description: "", date: "", time: "", location: "", published: true };

export default function AdminAgenda() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const load = async () => setItems((await api.get("/admin/events")).data);
  useEffect(() => { load(); }, []);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    try {
      if (editingId) await api.put(`/admin/events/${editingId}`, form);
      else await api.post("/admin/events", form);
      toast.success("Data berhasil disimpan."); setOpen(false); setForm(empty); setEditingId(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };
  const edit = (e) => { setForm({ title: e.title, description: e.description, date: e.date, time: e.time, location: e.location, published: e.published }); setEditingId(e.id); setOpen(true); };
  const del = async (id) => { await api.delete(`/admin/events/${id}`); toast.success("Data berhasil dihapus."); load(); };
  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-bold text-stone-900">Agenda Kegiatan</h1><p className="text-stone-600 mt-1">Kelola agenda dan kegiatan sekolah.</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(empty); setEditingId(null); } }}>
          <DialogTrigger asChild><Button className="rounded-full bg-orange-600 hover:bg-orange-700 h-11 px-5 text-white font-semibold"><Plus className="h-4 w-4 mr-2" /> Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg bg-white">
            <DialogHeader><DialogTitle>{editingId ? "Ubah Agenda" : "Tambah Agenda"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Judul</Label><Input value={form.title} onChange={(e) => upd("title", e.target.value)} /></div>
              <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => upd("description", e.target.value)} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Tanggal</Label><Input type="date" value={form.date} onChange={(e) => upd("date", e.target.value)} /></div>
                <div><Label>Waktu</Label><Input value={form.time} onChange={(e) => upd("time", e.target.value)} placeholder="09.00 - 12.00" /></div>
              </div>
              <div><Label>Lokasi</Label><Input value={form.location} onChange={(e) => upd("location", e.target.value)} /></div>
              <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => upd("published", v)} /><span className="text-sm">{form.published ? "Publish" : "Draft"}</span></div>
            </div>
            <DialogFooter><Button onClick={save} className="bg-orange-600 hover:bg-orange-700 text-white">Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 grid gap-3">
        {items.map((e) => (
          <div key={e.id} className="rounded-2xl bg-white border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0"><div className="text-xs font-bold text-orange-700 uppercase tracking-widest">{e.date} · {e.time}</div><div className="mt-1 font-display font-bold text-stone-900">{e.title}</div><div className="text-sm text-stone-600 mt-1 line-clamp-2">{e.description}</div><div className="text-xs text-stone-500 mt-1">{e.location} · {e.published ? "Publish" : "Draft"}</div></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => edit(e)}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader><AlertDialogTitle>Hapus agenda ini?</AlertDialogTitle><AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => del(e.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="rounded-2xl border border-dashed p-10 text-center text-stone-500">Belum ada agenda.</div>}
      </div>
    </div>
  );
}
