import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { UserCircle2 } from "lucide-react";

export default function Guru() {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => { api.get("/teachers").then((r) => setTeachers(r.data)); }, []);
  return (
    <div>
      <section className="bg-orange-radial py-14 sm:py-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Tim Kami</div>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold text-stone-900">Guru & Tenaga Kependidikan</h1>
          <p className="mt-5 text-lg text-stone-700 max-w-3xl leading-relaxed">Kami didukung oleh tenaga pendidik dan kependidikan yang berdedikasi tinggi terhadap pendidikan anak berkebutuhan khusus.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {teachers.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white border border-stone-200 overflow-hidden hover:shadow-lg transition" data-testid={`teacher-card-${t.id}`}>
            <div className="aspect-square bg-stone-100 overflow-hidden">
              {t.photo_url ? <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-stone-300"><UserCircle2 className="h-16 w-16" /></div>}
            </div>
            <div className="p-4">
              <div className="font-display font-bold text-stone-900">{t.name}</div>
              <div className="text-xs font-semibold text-orange-700 mt-1">{t.position}</div>
              {t.subject && <div className="text-xs text-stone-500 mt-1">{t.subject}</div>}
            </div>
          </div>
        ))}
        {teachers.length === 0 && <div className="text-stone-500 col-span-full">Belum ada data guru.</div>}
      </section>
    </div>
  );
}
