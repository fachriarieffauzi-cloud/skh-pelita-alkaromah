import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { GraduationCap, BookOpen, School, Sparkles, Hammer, Music } from "lucide-react";

const ICONS = { GraduationCap, BookOpen, School, Sparkles, Hammer, Music };

export default function Program() {
  const [programs, setPrograms] = useState([]);
  useEffect(() => { api.get("/programs").then((r) => setPrograms(r.data)); }, []);
  return (
    <div>
      <section className="bg-orange-radial py-14 sm:py-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Program</div>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold text-stone-900">Program Pendidikan</h1>
          <p className="mt-5 text-lg text-stone-700 max-w-3xl leading-relaxed">Beragam program yang dirancang untuk membantu setiap peserta didik berkembang sesuai potensi mereka.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((p) => {
          const Icon = ICONS[p.icon] || GraduationCap;
          return (
            <div key={p.id} className="rounded-2xl bg-white border border-stone-200 p-6 hover:shadow-xl transition">
              <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center"><Icon className="h-6 w-6" /></div>
              <h3 className="mt-4 font-display text-xl font-bold text-stone-900">{p.title}</h3>
              <p className="mt-2 text-stone-600 leading-relaxed">{p.description}</p>
            </div>
          );
        })}
        {programs.length === 0 && <div className="text-stone-500">Belum ada program.</div>}
      </section>
    </div>
  );
}
