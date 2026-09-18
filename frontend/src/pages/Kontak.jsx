import { useOutletContext } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export default function Kontak() {
  const { settings } = useOutletContext();
  return (
    <div>
      <section className="bg-orange-radial py-14 sm:py-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Kontak</div>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold text-stone-900">Hubungi Kami</h1>
          <p className="mt-5 text-lg text-stone-700 max-w-3xl">Kami dengan senang hati menjawab pertanyaan Anda seputar sekolah dan pendaftaran peserta didik.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 flex gap-4"><MapPin className="h-6 w-6 text-orange-600 shrink-0" /><div><div className="text-xs uppercase tracking-widest font-bold text-stone-500">Alamat</div><div className="mt-1 font-semibold text-stone-900">{settings?.address || "[Alamat Sekolah]"}</div></div></div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 flex gap-4"><MessageCircle className="h-6 w-6 text-orange-600 shrink-0" /><div><div className="text-xs uppercase tracking-widest font-bold text-stone-500">WhatsApp</div><div className="mt-1 font-semibold text-stone-900">{settings?.whatsapp || "[Nomor WhatsApp]"}</div></div></div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 flex gap-4"><Mail className="h-6 w-6 text-orange-600 shrink-0" /><div><div className="text-xs uppercase tracking-widest font-bold text-stone-500">Email</div><div className="mt-1 font-semibold text-stone-900">{settings?.email || "[Email Sekolah]"}</div></div></div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 flex gap-4"><Clock className="h-6 w-6 text-orange-600 shrink-0" /><div><div className="text-xs uppercase tracking-widest font-bold text-stone-500">Jam Layanan</div><div className="mt-1 font-semibold text-stone-900">{settings?.service_hours}</div></div></div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-stone-200 min-h-[380px] bg-stone-100 flex items-center justify-center text-stone-400">
          {settings?.maps_embed ? <iframe title="Peta" src={settings.maps_embed} className="w-full h-full min-h-[380px]" allowFullScreen /> : <span>Peta akan ditampilkan di sini</span>}
        </div>
      </section>
    </div>
  );
}
