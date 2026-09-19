import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight, GraduationCap, BookOpen, School, Sparkles, Hammer, Music,
  Heart, Shield, HandHeart, HomeIcon, Users as UsersIcon, Calendar as CalendarIcon,
  MapPin, Phone, Mail
} from "lucide-react";

const ICONS = { GraduationCap, BookOpen, School, Sparkles, Hammer, Music };

function SectionTitle({ eyebrow, title, description, center = false }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">{eyebrow}</div>}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">{title}</h2>
      {description && <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">{description}</p>}
    </div>
  );
}

export default function Home() {
  const { settings } = useOutletContext();
  const [news, setNews] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    api.get("/news?limit=3").then((r) => setNews(r.data.slice(0, 3))).catch(() => {});
    api.get("/programs").then((r) => setPrograms(r.data)).catch(() => {});
    api.get("/events").then((r) => setEvents(r.data.slice(0, 3))).catch(() => {});
    api.get("/gallery").then((r) => setGallery(r.data.slice(0, 6))).catch(() => {});
  }, []);

  const advantages = [
    { icon: Heart, title: "Pembelajaran Sesuai Kebutuhan", desc: "Program disesuaikan dengan potensi tiap peserta didik." },
    { icon: Sparkles, title: "Pengembangan Potensi", desc: "Mengasah bakat dan minat individu dengan pendekatan positif." },
    { icon: HandHeart, title: "Program Kemandirian", desc: "Latihan bina diri dan aktivitas sehari-hari." },
    { icon: Shield, title: "Lingkungan Aman & Nyaman", desc: "Suasana belajar yang ramah dan mendukung." },
    { icon: Hammer, title: "Pengembangan Keterampilan", desc: "Keterampilan vokasional untuk bekal masa depan." },
    { icon: UsersIcon, title: "Kolaborasi Orang Tua", desc: "Kemitraan erat antara sekolah dan keluarga." },
  ];

  return (
    <div className="text-stone-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-orange-radial">
        <div className="absolute top-0 right-0 h-2 w-full stripe-accent opacity-70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-2 gap-10 items-center relative">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-orange-200 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-600" /> Sekolah Khusus
            </span>
            <h1 className="font-display mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.05] tracking-tight">
              <span className="block">Selamat Datang di</span>
              <span className="block whitespace-nowrap">SKh Pelita Al-Karomah</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-stone-700 max-w-xl leading-relaxed">
              {settings?.hero_subtitle || "Tempat bertumbuh, belajar, berkarya, dan menjadi pribadi yang mandiri."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="h-12 sm:h-14 px-6 rounded-full bg-amber-300 bg-gradient-to-r from-orange-600 via-orange-500/60 to-transparent hover:brightness-105 text-white font-bold text-base shadow-xl shadow-orange-200" data-testid="hero-cta-profile">
                <Link to="/profil">Kenali Sekolah Kami <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-12 sm:h-14 px-6 rounded-full border-2 border-stone-900 bg-white hover:bg-amber-50 text-stone-900 font-bold text-base" data-testid="hero-cta-ppdb">
                <Link to="/ppdb">PPDB Online</Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="absolute -inset-4 -z-10 bg-amber-300/50 rounded-[36px] blur-2xl" />
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src={settings?.hero_image_url}
                alt="Suasana belajar di SKh Pelita Al-Karomah"
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover"
                loading="eager"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-5 -left-5 rounded-2xl bg-white shadow-xl border border-stone-100 p-4 max-w-[220px]">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-700">Motto</div>
              <div className="mt-1 font-display font-bold text-stone-900 leading-tight">Belajar, Berkarya, Mandiri.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFIL SINGKAT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-2">
            <SectionTitle eyebrow="Tentang Kami" title="Tentang SKh Pelita Al-Karomah" />
          </div>
          <div className="lg:col-span-3">
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">{settings?.about_long || settings?.about_short}</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {["Pendidikan", "Kemandirian", "Keterampilan", "Pengembangan Potensi"].map((t) => (
                <div key={t} className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <div className="h-9 w-9 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-stone-900">{t}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="ghost" className="mt-6 text-orange-700 hover:text-orange-800 hover:bg-orange-50 font-semibold px-0">
              <Link to="/profil">Selengkapnya <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SAMBUTAN */}
      <section className="bg-stone-50 py-16 sm:py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-1">
            <div className="relative">
              <div className="absolute -inset-3 bg-orange-200 rounded-[28px] -z-10 blur-lg" />
              <img src={settings?.principal_photo_url} alt="Kepala Sekolah" className="rounded-3xl w-full h-[360px] sm:h-[440px] object-cover border-4 border-white shadow-xl" />
            </div>
          </div>
          <div className="order-2">
            <SectionTitle eyebrow="Sambutan" title="Sambutan Kepala Sekolah" />
            <p className="mt-6 text-base sm:text-lg text-stone-700 leading-relaxed italic">"{settings?.principal_message}"</p>
            <div className="mt-6">
              <div className="font-display font-bold text-stone-900 text-lg">{settings?.principal_name}</div>
              <div className="text-sm text-orange-700 font-semibold">Kepala Sekolah</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionTitle eyebrow="Program Pendidikan" title="Program yang Kami Selenggarakan" description="Kami menyediakan program pendidikan dan pengembangan yang disesuaikan dengan kebutuhan setiap peserta didik." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p, i) => {
            const Icon = ICONS[p.icon] || GraduationCap;
            return (
              <Card key={p.id} className="group border border-stone-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/60 transition rounded-2xl bg-white" data-testid={`program-card-${i}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-stone-900">{p.title}</h3>
                  <p className="mt-2 text-stone-600 leading-relaxed">{p.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="bg-warm-gradient py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle eyebrow="Keunggulan" title="Mengapa Memilih SKh Pelita Al-Karomah?" center />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="rounded-2xl bg-white border border-stone-200 p-6 hover:shadow-lg transition" data-testid={`advantage-${i}`}>
                  <div className="h-11 w-11 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-stone-900">{a.title}</h3>
                  <p className="mt-2 text-stone-600 text-sm leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Agenda" title="Agenda Terdekat" />
          <Button asChild variant="outline" className="rounded-full border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"><Link to="/berita">Lihat Semua Berita</Link></Button>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.length === 0 && <div className="text-stone-500">Belum ada agenda.</div>}
          {events.map((e) => (
            <div key={e.id} className="rounded-2xl border border-stone-200 bg-white p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-sm text-orange-700 font-semibold">
                <CalendarIcon className="h-4 w-4" />
                <span>{e.date} • {e.time}</span>
              </div>
              <h3 className="mt-3 font-display font-bold text-xl text-stone-900">{e.title}</h3>
              <p className="mt-2 text-stone-600 text-sm">{e.description}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-stone-500"><MapPin className="h-3.5 w-3.5" /> {e.location}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BERITA */}
      <section className="bg-stone-50 py-16 sm:py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Berita" title="Berita Terbaru" />
            <Button asChild variant="outline" className="rounded-full border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"><Link to="/berita">Semua Berita</Link></Button>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n) => (
              <Link key={n.id} to={`/berita/${n.id}`} className="group rounded-2xl overflow-hidden bg-white border border-stone-200 hover:shadow-xl transition" data-testid={`news-card-${n.id}`}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={n.image_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-orange-700">{n.category}</div>
                  <h3 className="mt-2 font-display font-bold text-lg text-stone-900 line-clamp-2">{n.title}</h3>
                  <p className="mt-2 text-stone-600 text-sm line-clamp-2">{n.summary}</p>
                  <div className="mt-4 text-sm font-semibold text-orange-700 inline-flex items-center gap-1">Baca Selengkapnya <ArrowRight className="h-4 w-4" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GALERI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Galeri" title="Momen di Sekolah" />
          <Button asChild variant="outline" className="rounded-full border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"><Link to="/galeri">Semua Galeri</Link></Button>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {gallery.map((g, i) => (
            <div key={g.id} className={`rounded-2xl overflow-hidden ${i === 0 ? "row-span-2 col-span-2 md:col-span-2 md:row-span-2" : ""}`}>
              <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA PPDB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white p-8 sm:p-12">
          <div className="absolute inset-0 opacity-30 bg-orange-radial" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">PPDB</div>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-tight">Bergabunglah bersama keluarga besar SKh Pelita Al-Karomah</h3>
              <p className="mt-4 text-stone-300 max-w-xl">Daftarkan putra/putri Anda melalui formulir PPDB online kami. Tim kami siap mendampingi setiap langkah.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Button asChild className="h-12 sm:h-14 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold px-6" data-testid="cta-daftar-ppdb"><Link to="/ppdb">Daftar Sekarang</Link></Button>
              <Button asChild variant="outline" className="h-12 sm:h-14 rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-stone-900 text-white font-bold px-6"><Link to="/kontak">Hubungi Kami</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAK ringkas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-stone-200 p-6"><MapPin className="h-5 w-5 text-orange-600" /><div className="mt-3 text-xs uppercase tracking-widest text-stone-500 font-bold">Alamat</div><div className="mt-1 font-semibold text-stone-900">{settings?.address || "[Alamat Sekolah]"}</div></div>
          <div className="rounded-2xl border border-stone-200 p-6"><Phone className="h-5 w-5 text-orange-600" /><div className="mt-3 text-xs uppercase tracking-widest text-stone-500 font-bold">WhatsApp</div><div className="mt-1 font-semibold text-stone-900">{settings?.whatsapp || "[Nomor WhatsApp]"}</div></div>
          <div className="rounded-2xl border border-stone-200 p-6"><Mail className="h-5 w-5 text-orange-600" /><div className="mt-3 text-xs uppercase tracking-widest text-stone-500 font-bold">Email</div><div className="mt-1 font-semibold text-stone-900">{settings?.email || "[Email Sekolah]"}</div></div>
        </div>
      </section>
    </div>
  );
}
