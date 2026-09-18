import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Newspaper, Calendar, Users, Image as ImageIcon, Inbox, Clock } from "lucide-react";

const CARDS = [
  { key: "news", label: "Berita", icon: Newspaper, color: "bg-orange-100 text-orange-700" },
  { key: "events", label: "Agenda", icon: Calendar, color: "bg-amber-100 text-amber-700" },
  { key: "teachers", label: "Guru & Tendik", icon: Users, color: "bg-stone-100 text-stone-700" },
  { key: "gallery", label: "Galeri", icon: ImageIcon, color: "bg-orange-100 text-orange-700" },
  { key: "ppdb", label: "Pendaftar PPDB", icon: Inbox, color: "bg-amber-100 text-amber-700" },
  { key: "ppdb_pending", label: "PPDB Menunggu", icon: Clock, color: "bg-stone-100 text-stone-700" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  useEffect(() => { api.get("/admin/stats").then((r) => setStats(r.data)); }, []);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-900">Dashboard</h1>
      <p className="text-stone-600 mt-1">Ringkasan aktivitas dan konten sekolah.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.key} className="rounded-2xl bg-white border border-stone-200 p-5 hover:shadow-md transition" data-testid={`stat-${c.key}`}>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${c.color}`}><Icon className="h-5 w-5" /></div>
              <div className="mt-4 text-4xl font-display font-bold text-stone-900">{stats[c.key] ?? 0}</div>
              <div className="mt-1 text-sm text-stone-500">{c.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
