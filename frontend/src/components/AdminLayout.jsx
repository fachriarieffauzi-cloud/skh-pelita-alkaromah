import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Newspaper, GraduationCap, Users, Calendar,
  Image, Inbox, Settings, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/berita", label: "Berita", icon: Newspaper },
  { to: "/admin/program", label: "Program", icon: GraduationCap },
  { to: "/admin/guru", label: "Guru & Tendik", icon: Users },
  { to: "/admin/agenda", label: "Agenda", icon: Calendar },
  { to: "/admin/galeri", label: "Galeri", icon: Image },
  { to: "/admin/ppdb", label: "PPDB", icon: Inbox },
  { to: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

function SidebarContent({ onNav }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-stone-900 text-stone-200">
      <div className="p-5 border-b border-stone-800">
        <Link to="/" onClick={onNav} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-display font-bold">P</div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">SKh Pelita Al-Karomah</div>
            <div className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">Admin</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onNav}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                  isActive ? "bg-orange-600 text-white" : "text-stone-300 hover:bg-stone-800"
                }`
              }
              data-testid={`admin-nav-${l.to.split("/").pop()}`}
            >
              <Icon className="h-4 w-4" /> {l.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-stone-800">
        <div className="px-2 py-2 text-xs text-stone-400 truncate">{user?.email}</div>
        <Button
          onClick={async () => { await logout(); navigate("/admin/login"); }}
          variant="outline"
          className="w-full bg-transparent border-stone-700 text-stone-200 hover:bg-stone-800 hover:text-white"
          data-testid="admin-logout-btn"
        >
          <LogOut className="h-4 w-4 mr-2" /> Keluar
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="lg:grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="hidden lg:block sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        <div className="flex flex-col min-h-screen">
          <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-stone-200 px-4 py-3">
            <Link to="/admin" className="font-display font-bold text-stone-900">Admin</Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="h-10 w-10 rounded-lg border border-stone-200 flex items-center justify-center" data-testid="admin-menu-btn">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px] bg-stone-900 text-stone-200 border-r-0">
                <SheetHeader className="sr-only"><SheetTitle>Admin Menu</SheetTitle></SheetHeader>
                <SidebarContent onNav={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
