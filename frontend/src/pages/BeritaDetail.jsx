import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

export default function BeritaDetail() {
  const { id } = useParams();
  const [n, setN] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    api.get(`/news/${id}`).then((r) => setN(r.data)).catch(() => setError("Berita tidak ditemukan"));
  }, [id]);
  if (error) return <div className="max-w-3xl mx-auto px-4 py-20 text-stone-500">{error}</div>;
  if (!n) return <div className="max-w-3xl mx-auto px-4 py-20 text-stone-500">Memuat...</div>;
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/berita" className="inline-flex items-center gap-2 text-orange-700 font-semibold text-sm hover:underline"><ArrowLeft className="h-4 w-4" /> Kembali ke Berita</Link>
      <div className="mt-6 text-xs font-bold uppercase tracking-widest text-orange-700">{n.category}</div>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">{n.title}</h1>
      <div className="mt-3 text-sm text-stone-500">{new Date(n.date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</div>
      {n.image_url && <img src={n.image_url} alt={n.title} className="mt-6 rounded-2xl w-full max-h-[500px] object-cover" />}
      <div className="prose prose-stone mt-8 max-w-none text-stone-700 leading-relaxed whitespace-pre-line">{n.content}</div>
    </article>
  );
}
