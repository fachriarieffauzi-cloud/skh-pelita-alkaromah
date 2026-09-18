import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Type } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Beranda" },
  { to: "/profil", label: "Profil" },
  { to: "/program", label: "Program" },
  { to: "/guru", label: "Guru & Tendik" },
  { to: "/berita", label: "Berita" },
  { to: "/galeri", label: "Galeri" },
  { to: "/ppdb", label: "PPDB" },
  { to: "/kontak", label: "Kontak" },
];

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false);
  const { textSize, setTextSize } = useAccessibility();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200" data-testid="navbar">
      <div className="hidden md:flex items-center justify-end gap-3 bg-orange-600 text-white text-xs px-4 py-1.5">
        <span className="hidden lg:inline">{settings?.service_hours || "Senin - Jumat, 07.30 - 14.00 WIB"}</span>
        <span className="opacity-40">|</span>
        <span>WhatsApp: {settings?.whatsapp || "[Nomor WhatsApp]"}</span>
        <span className="opacity-40">|</span>
        <button
          type="button"
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/30 hover:bg-white/10 transition ${textSize === "large" ? "bg-white text-orange-700" : ""}`}
          onClick={() => setTextSize(textSize === "large" ? "normal" : "large")}
          data-testid="text-size-toggle"
          aria-label="Ubah ukuran teks"
        >
          <Type className="h-3.5 w-3.5" />
          Ukuran Teks: {textSize === "large" ? "Besar" : "Normal"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-12 w-12 object-contain" />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-display font-bold text-lg shadow-md shadow-orange-200">
              P
            </div>
          )}
          <div className="leading-tight">
            <div className="font-display font-bold text-stone-900 text-base sm:text-lg">SKh Pelita Al-Karomah</div>
            <div className="text-[10px] sm:text-xs text-orange-700 font-semibold tracking-widest uppercase">Sekolah Khusus</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive ? "text-orange-700 bg-orange-50" : "text-stone-700 hover:text-orange-700 hover:bg-orange-50/60"
                }`
              }
              data-testid={`nav-${n.to.replace("/", "") || "home"}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button
            onClick={() => navigate("/ppdb")}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-5 h-11 font-semibold shadow-lg shadow-orange-200"
            data-testid="cta-daftar-desktop"
          >
            Daftar Sekarang
          </Button>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl border border-stone-200 text-stone-800"
              aria-label="Buka menu"
              data-testid="hamburger-btn"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86%] sm:w-[380px] bg-white p-0">
            <SheetHeader className="p-5 border-b border-stone-200">
              <SheetTitle className="text-left font-display text-stone-900">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col p-3 gap-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `min-h-[48px] flex items-center px-4 rounded-xl text-base font-semibold transition ${
                      isActive ? "bg-orange-600 text-white" : "text-stone-800 hover:bg-orange-50"
                    }`
                  }
                  data-testid={`mobile-nav-${n.to.replace("/", "") || "home"}`}
                >
                  {n.label}
                </NavLink>
              ))}
              <Button
                onClick={() => { setOpen(false); navigate("/ppdb"); }}
                className="mt-3 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold h-12 rounded-xl"
                data-testid="cta-daftar-mobile"
              >
                Daftar PPDB Sekarang
              </Button>
              <button
                type="button"
                onClick={() => setTextSize(textSize === "large" ? "normal" : "large")}
                className="mt-4 min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700"
                data-testid="mobile-text-size-toggle"
              >
                <Type className="h-4 w-4" /> Ukuran Teks: {textSize === "large" ? "Besar" : "Normal"}
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
