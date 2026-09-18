import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export default function Berita() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/news").then((r) => setItems(r.data)); }, []);
  return (
    <div>
      <section className="bg-orange-radial py-14 sm:py-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Berita</div>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold text-stone-900">Berita & Artikel</h1>
          <p className="mt-5 text-lg text-stone-700 max-w-3xl">Informasi terkini seputar kegiatan sekolah dan pembelajaran peserta didik.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((n) => (
          <Link key={n.id} to={`/berita/${n.id}`} className="group rounded-2xl overflow-hidden bg-white border border-stone-200 hover:shadow-xl transition">
            <div className="aspect-[16/10] overflow-hidden bg-stone-100">
              {n.image_url && <img src={n.image_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />}
            </div>
            <div className="p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-700">{n.category}</div>
              <h3 className="mt-2 font-display font-bold text-lg text-stone-900 line-clamp-2">{n.title}</h3>
              <p className="mt-2 text-stone-600 text-sm line-clamp-3">{n.summary}</p>
              <div className="mt-4 text-sm font-semibold text-orange-700 inline-flex items-center gap-1">Baca Selengkapnya <ArrowRight className="h-4 w-4" /></div>
            </div>
          </Link>
        ))}
        {items.length === 0 && <div className="text-stone-500 col-span-full">Belum ada berita.</div>}
      </section>
    </div>
  );
}
