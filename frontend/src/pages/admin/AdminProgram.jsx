import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const ICON_OPTS = ["GraduationCap", "BookOpen", "School", "Sparkles", "Hammer", "Music"];
const empty = { title: "", icon: "GraduationCap", description: "", order: 0, published: true };

export default function AdminProgram() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const load = async () => setItems((await api.get("/admin/programs")).data);
  useEffect(() => { load(); }, []);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    try {
      if (editingId) await api.put(`/admin/programs/${editingId}`, form);
      else await api.post("/admin/programs", form);
      toast.success("Data berhasil disimpan."); setOpen(false); setForm(empty); setEditingId(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };
  const edit = (p) => { setForm({ title: p.title, icon: p.icon, description: p.description, order: p.order, published: p.published }); setEditingId(p.id); setOpen(true); };
  const del = async (id) => { await api.delete(`/admin/programs/${id}`); toast.success("Data berhasil dihapus."); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-bold text-stone-900">Kelola Program</h1><p className="text-stone-600 mt-1">Kelola program pendidikan sekolah.</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(empty); setEditingId(null); } }}>
          <DialogTrigger asChild><Button className="rounded-full bg-orange-600 hover:bg-orange-700 h-11 px-5 text-white font-semibold" data-testid="add-program-btn"><Plus className="h-4 w-4 mr-2" /> Tambah Program</Button></DialogTrigger>
          <DialogContent className="max-w-lg bg-white">
            <DialogHeader><DialogTitle>{editingId ? "Ubah Program" : "Tambah Program"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nama Program</Label><Input value={form.title} onChange={(e) => upd("title", e.target.value)} /></div>
              <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => upd("description", e.target.value)} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Ikon</Label>
                  <Select value={form.icon} onValueChange={(v) => upd("icon", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{ICON_OPTS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Urutan</Label><Input type="number" value={form.order} onChange={(e) => upd("order", parseInt(e.target.value || "0"))} /></div>
              </div>
              <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => upd("published", v)} /><span className="text-sm">{form.published ? "Dipublikasikan" : "Draft"}</span></div>
            </div>
            <DialogFooter><Button onClick={save} className="bg-orange-600 hover:bg-orange-700 text-white">Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white border border-stone-200 p-5">
            <div className="text-xs font-bold text-orange-700 uppercase tracking-widest">{p.icon} · {p.published ? "Publish" : "Draft"}</div>
            <div className="mt-2 font-display font-bold text-stone-900">{p.title}</div>
            <div className="mt-2 text-sm text-stone-600 line-clamp-3">{p.description}</div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => edit(p)}><Pencil className="h-3.5 w-3.5 mr-1" /> Ubah</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus</Button></AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader><AlertDialogTitle>Hapus program ini?</AlertDialogTitle><AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => del(p.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="rounded-2xl border border-dashed p-10 text-center text-stone-500 col-span-full">Belum ada program.</div>}
      </div>
    </div>
  );
}
