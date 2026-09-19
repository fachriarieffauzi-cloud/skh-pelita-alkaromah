import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
const getImageUrl = (url) => {
  if (!url) return "";

  const value = url.trim();

  const fileMatch = value.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );

  const idMatch = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  const fileId = fileMatch?.[1] || idMatch?.[1];

  if (fileId) {
    return https://drive.google.com/thumbnail?id=${fileId}&sz=w1600;
  }

  return value;
};
const CATEGORIES = ["Semua", "Kegiatan Pembelajaran", "Kegiatan Sekolah", "Ekstrakurikuler", "Perayaan", "Kegiatan Siswa"];

export default function Galeri() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("Semua");
  const [selected, setSelected] = useState(null);
  useEffect(() => { api.get("/gallery").then((r) => setItems(r.data)); }, []);
  const filtered = cat === "Semua" ? items : items.filter((i) => i.category === cat);

  return (
    <div>
      <section className="bg-orange-radial py-14 sm:py-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Galeri</div>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold text-stone-900">Galeri Kegiatan</h1>
          <p className="mt-5 text-lg text-stone-700 max-w-3xl">Rangkuman momen belajar, berkarya, dan kebersamaan di SKh Pelita Al-Karomah.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 h-10 rounded-full text-sm font-semibold transition ${cat === c ? "bg-orange-600 text-white" : "bg-white border border-stone-200 text-stone-700 hover:bg-orange-50"}`}
              data-testid={`gallery-filter-${c.replace(/\s+/g, "-").toLowerCase()}`}
            >{c}</button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((g) => (
            <button key={g.id} onClick={() => setSelected(g)} className="rounded-xl overflow-hidden bg-stone-100 hover:opacity-90 transition group" data-testid={`gallery-item-${g.id}`}>
              <img src={getImageUrl(g.image_url)} alt={g.caption} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
            </button>
          ))}
          {filtered.length === 0 && <div className="text-stone-500 col-span-full">Belum ada foto di kategori ini.</div>}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-4xl bg-white p-0 overflow-hidden">
          {selected && (
            <div>
              <img src={getImageUrl(selected.image_url)} alt={selected.caption} className="w-full max-h-[70vh] object-contain bg-stone-900" />
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-orange-700">{selected.category}</div>
                <div className="mt-1 text-stone-800 font-semibold">{selected.caption}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
