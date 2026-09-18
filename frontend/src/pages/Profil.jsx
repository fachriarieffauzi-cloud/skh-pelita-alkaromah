import { useOutletContext } from "react-router-dom";
import { Sparkles, Target, Heart } from "lucide-react";

export default function Profil() {
  const { settings } = useOutletContext();
  return (
    <div>
      <section className="bg-orange-radial py-14 sm:py-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Profil</div>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold text-stone-900">Tentang SKh Pelita Al-Karomah</h1>
          <p className="mt-5 text-lg text-stone-700 max-w-3xl leading-relaxed">{settings?.about_long || settings?.about_short}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-2 gap-10">
        <div className="rounded-3xl bg-white border border-stone-200 p-7 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-orange-600 text-white flex items-center justify-center"><Target className="h-5 w-5" /></div>
          <h2 className="mt-4 font-display text-2xl font-bold text-stone-900">Visi</h2>
          <p className="mt-3 text-stone-700 leading-relaxed">{settings?.visi}</p>
        </div>
        <div className="rounded-3xl bg-stone-900 text-white p-7">
          <div className="h-11 w-11 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
          <h2 className="mt-4 font-display text-2xl font-bold">Misi</h2>
          <ul className="mt-4 space-y-3">
            {(settings?.misi || []).map((m, i) => (
              <li key={i} className="flex gap-3 text-stone-200"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" /> {m}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-stone-50 py-14 sm:py-20 border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <img src={settings?.principal_photo_url} alt="Kepala Sekolah" className="rounded-3xl w-full h-[380px] object-cover border-4 border-white shadow-xl" />
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Sambutan</div>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-stone-900">Sambutan Kepala Sekolah</h2>
            <p className="mt-5 italic text-stone-700 text-lg leading-relaxed">"{settings?.principal_message}"</p>
            <div className="mt-5">
              <div className="font-display font-bold text-stone-900 text-lg">{settings?.principal_name}</div>
              <div className="text-sm text-orange-700 font-semibold">Kepala Sekolah</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
