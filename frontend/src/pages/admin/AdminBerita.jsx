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

const empty = { title: "", category: "Umum", summary: "", content: "", image_url: "", published: true };

export default function AdminBerita() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = async () => { const { data } = await api.get("/admin/news"); setItems(data); };
  useEffect(() => { load(); }, []);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      if (editingId) await api.put(`/admin/news/${editingId}`, form);
      else await api.post("/admin/news", form);
      toast.success(editingId ? "Berita berhasil diperbarui." : "Berita berhasil disimpan.");
      setOpen(false); setForm(empty); setEditingId(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  const edit = (n) => { setForm({ title: n.title, category: n.category, summary: n.summary, content: n.content, image_url: n.image_url, published: n.published }); setEditingId(n.id); setOpen(true); };
  const del = async (id) => { await api.delete(`/admin/news/${id}`); toast.success("Berita berhasil dihapus."); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-bold text-stone-900">Kelola Berita</h1><p className="text-stone-600 mt-1">Tambah, ubah, atau hapus berita sekolah.</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(empty); setEditingId(null); } }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-orange-600 hover:bg-orange-700 h-11 px-5 text-white font-semibold" data-testid="add-news-btn"><Plus className="h-4 w-4 mr-2" /> Tambah Berita</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader><DialogTitle>{editingId ? "Ubah Berita" : "Tambah Berita"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Judul</Label><Input data-testid="news-title-input" value={form.title} onChange={(e) => upd("title", e.target.value)} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Kategori</Label><Input data-testid="news-category-input" value={form.category} onChange={(e) => upd("category", e.target.value)} /></div>
                <div className="flex items-center gap-3 mt-6"><Switch data-testid="news-published-switch" checked={form.published} onCheckedChange={(v) => upd("published", v)} /><span className="text-sm">{form.published ? "Dipublikasikan" : "Draft"}</span></div>
              </div>
              <div><Label>URL Gambar</Label><Input data-testid="news-image-url-input" value={form.image_url} onChange={(e) => upd("image_url", e.target.value)} placeholder="https://..." /></div>
              <div><Label>Ringkasan</Label><Textarea data-testid="news-summary-input" value={form.summary} onChange={(e) => upd("summary", e.target.value)} rows={2} /></div>
              <div><Label>Isi Berita</Label><Textarea data-testid="news-content-input" value={form.content} onChange={(e) => upd("content", e.target.value)} rows={8} /></div>
            </div>
            <DialogFooter><Button onClick={save} className="bg-orange-600 hover:bg-orange-700 text-white" data-testid="save-news-btn">Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-3">
        {items.map((n) => (
          <div key={n.id} className="rounded-2xl bg-white border border-stone-200 p-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-32 h-24 rounded-xl bg-stone-100 overflow-hidden shrink-0">
              {n.image_url && <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-orange-700 uppercase tracking-widest">{n.category} · {n.published ? "Publish" : "Draft"}</div>
              <div className="mt-1 font-display font-bold text-stone-900 line-clamp-1">{n.title}</div>
              <div className="mt-1 text-sm text-stone-600 line-clamp-2">{n.summary}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={() => edit(n)} data-testid={`edit-news-${n.id}`}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" data-testid={`delete-news-${n.id}`}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader><AlertDialogTitle>Hapus berita ini?</AlertDialogTitle><AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => del(n.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="rounded-2xl bg-white border border-dashed border-stone-300 p-10 text-center text-stone-500">Belum ada berita. Klik "Tambah Berita" untuk memulai.</div>}
      </div>
    </div>
  );
}
