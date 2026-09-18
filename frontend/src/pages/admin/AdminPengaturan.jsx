import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

export default function AdminPengaturan() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/settings").then((r) => setS(r.data)); }, []);
  if (!s) return <div className="text-stone-500">Memuat...</div>;
  const upd = (k, v) => setS((prev) => ({ ...prev, [k]: v }));
  const save = async () => {
    try { const { data } = await api.put("/admin/settings", s); setS(data); toast.success("Pengaturan berhasil disimpan."); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };
  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between">
        <div><h1 className="font-display text-3xl font-bold text-stone-900">Pengaturan Sekolah</h1><p className="text-stone-600 mt-1">Kelola informasi umum, hero, visi misi, dan kontak.</p></div>
        <Button onClick={save} className="rounded-full bg-orange-600 hover:bg-orange-700 h-11 px-6 text-white font-semibold" data-testid="save-settings">Simpan</Button>
      </div>
      <div className="mt-6">
        <Tabs defaultValue="umum">
          <TabsList className="bg-stone-100 h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="umum">Umum</TabsTrigger>
            <TabsTrigger value="hero">Beranda</TabsTrigger>
            <TabsTrigger value="tentang">Tentang</TabsTrigger>
            <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
            <TabsTrigger value="kontak">Kontak</TabsTrigger>
            <TabsTrigger value="sosial">Media Sosial</TabsTrigger>
          </TabsList>

          <TabsContent value="umum" className="mt-6 space-y-4">
            <div><Label>Nama Sekolah</Label><Input value={s.school_name} onChange={(e) => upd("school_name", e.target.value)} /></div>
            <div><Label>Tagline</Label><Input value={s.tagline} onChange={(e) => upd("tagline", e.target.value)} /></div>
            <div><Label>URL Logo Sekolah</Label><Input value={s.logo_url} onChange={(e) => upd("logo_url", e.target.value)} placeholder="https://..." /></div>
          </TabsContent>

          <TabsContent value="hero" className="mt-6 space-y-4">
            <div><Label>Judul Hero</Label><Input value={s.hero_title} onChange={(e) => upd("hero_title", e.target.value)} /></div>
            <div><Label>Subjudul Hero</Label><Textarea value={s.hero_subtitle} onChange={(e) => upd("hero_subtitle", e.target.value)} rows={3} /></div>
            <div><Label>URL Gambar Hero</Label><Input value={s.hero_image_url} onChange={(e) => upd("hero_image_url", e.target.value)} /></div>
          </TabsContent>

          <TabsContent value="tentang" className="mt-6 space-y-4">
            <div><Label>Deskripsi Singkat</Label><Textarea value={s.about_short} onChange={(e) => upd("about_short", e.target.value)} rows={3} /></div>
            <div><Label>Deskripsi Panjang</Label><Textarea value={s.about_long} onChange={(e) => upd("about_long", e.target.value)} rows={6} /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Nama Kepala Sekolah</Label><Input value={s.principal_name} onChange={(e) => upd("principal_name", e.target.value)} /></div>
              <div><Label>URL Foto Kepala Sekolah</Label><Input value={s.principal_photo_url} onChange={(e) => upd("principal_photo_url", e.target.value)} /></div>
            </div>
            <div><Label>Sambutan Kepala Sekolah</Label><Textarea value={s.principal_message} onChange={(e) => upd("principal_message", e.target.value)} rows={5} /></div>
          </TabsContent>

          <TabsContent value="visi-misi" className="mt-6 space-y-4">
            <div><Label>Visi</Label><Textarea value={s.visi} onChange={(e) => upd("visi", e.target.value)} rows={3} /></div>
            <div>
              <div className="flex items-center justify-between mb-2"><Label>Misi</Label><Button size="sm" variant="outline" onClick={() => upd("misi", [...(s.misi || []), ""])}><Plus className="h-3.5 w-3.5 mr-1" /> Tambah</Button></div>
              <div className="space-y-2">
                {(s.misi || []).map((m, i) => (
                  <div key={i} className="flex gap-2"><Input value={m} onChange={(e) => { const arr = [...s.misi]; arr[i] = e.target.value; upd("misi", arr); }} />
                    <Button variant="outline" size="icon" onClick={() => { const arr = [...s.misi]; arr.splice(i, 1); upd("misi", arr); }}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kontak" className="mt-6 space-y-4">
            <div><Label>Alamat</Label><Textarea value={s.address} onChange={(e) => upd("address", e.target.value)} rows={2} /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Nomor WhatsApp</Label><Input value={s.whatsapp} onChange={(e) => upd("whatsapp", e.target.value)} /></div>
              <div><Label>Email</Label><Input value={s.email} onChange={(e) => upd("email", e.target.value)} /></div>
              <div><Label>Jam Layanan</Label><Input value={s.service_hours} onChange={(e) => upd("service_hours", e.target.value)} /></div>
              <div><Label>Google Maps Embed URL</Label><Input value={s.maps_embed} onChange={(e) => upd("maps_embed", e.target.value)} /></div>
            </div>
          </TabsContent>

          <TabsContent value="sosial" className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Instagram</Label><Input value={s.instagram} onChange={(e) => upd("instagram", e.target.value)} /></div>
              <div><Label>Facebook</Label><Input value={s.facebook} onChange={(e) => upd("facebook", e.target.value)} /></div>
              <div><Label>YouTube</Label><Input value={s.youtube} onChange={(e) => upd("youtube", e.target.value)} /></div>
              <div><Label>TikTok</Label><Input value={s.tiktok} onChange={(e) => upd("tiktok", e.target.value)} /></div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-8"><Button onClick={save} className="rounded-full bg-orange-600 hover:bg-orange-700 h-11 px-6 text-white font-semibold">Simpan Perubahan</Button></div>
    </div>
  );
}
