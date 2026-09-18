import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer({ settings }) {
  return (
    <footer className="bg-stone-900 text-stone-200 mt-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-display font-bold text-lg">
              P
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg">SKh Pelita Al-Karomah</div>
              <div className="text-xs text-amber-300 uppercase tracking-widest font-semibold">Sekolah Khusus</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-stone-400 leading-relaxed max-w-md">
            {settings?.about_short || "Tempat bertumbuh, belajar, berkarya, dan menjadi pribadi yang mandiri."}
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-orange-400" /> <span>{settings?.address || "[Alamat Sekolah]"}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange-400" /> <span>{settings?.whatsapp || "[Nomor WhatsApp]"}</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-orange-400" /> <span>{settings?.email || "[Email Sekolah]"}</span></div>
          </div>
        </div>

        <div>
          <div className="font-display font-bold text-white mb-3">Tautan</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400">Beranda</Link></li>
            <li><Link to="/profil" className="hover:text-orange-400">Profil</Link></li>
            <li><Link to="/program" className="hover:text-orange-400">Program</Link></li>
            <li><Link to="/berita" className="hover:text-orange-400">Berita</Link></li>
            <li><Link to="/ppdb" className="hover:text-orange-400">PPDB</Link></li>
            <li><Link to="/kontak" className="hover:text-orange-400">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-display font-bold text-white mb-3">Media Sosial</div>
          <div className="flex items-center gap-3">
            <a href={settings?.instagram || "#"} className="h-10 w-10 rounded-full bg-stone-800 hover:bg-orange-600 flex items-center justify-center transition" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href={settings?.facebook || "#"} className="h-10 w-10 rounded-full bg-stone-800 hover:bg-orange-600 flex items-center justify-center transition" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href={settings?.youtube || "#"} className="h-10 w-10 rounded-full bg-stone-800 hover:bg-orange-600 flex items-center justify-center transition" aria-label="Youtube"><Youtube className="h-4 w-4" /></a>
          </div>
          <div className="mt-6">
            <Link to="/admin/login" className="text-xs text-stone-500 hover:text-orange-400" data-testid="admin-login-link">Login Admin</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">
        © 2026 SKh Pelita Al-Karomah. Hak Cipta Dilindungi.
      </div>
    </footer>
  );
}
