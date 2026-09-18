import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Eye } from "lucide-react";

const STATUS = ["Menunggu", "Diterima", "Wawancara", "Ditolak"];
const STATUS_COLOR = {
  Menunggu: "bg-amber-100 text-amber-700",
  Diterima: "bg-green-100 text-green-700",
  Wawancara: "bg-orange-100 text-orange-700",
  Ditolak: "bg-red-100 text-red-700",
};

export default function AdminPPDB() {
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const load = async () => setItems((await api.get("/admin/ppdb")).data);
  useEffect(() => { load(); }, []);
  const updateStatus = async (id, status) => { await api.put(`/admin/ppdb/${id}`, { status }); toast.success("Status berhasil diperbarui."); load(); };
  const del = async (id) => { await api.delete(`/admin/ppdb/${id}`); toast.success("Pendaftaran berhasil dihapus."); load(); };
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-900">Pendaftar PPDB</h1>
      <p className="text-stone-600 mt-1">Kelola pendaftaran peserta didik baru.</p>
      <div className="mt-6 hidden lg:block rounded-2xl bg-white border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600"><tr>
            <th className="text-left px-4 py-3 font-semibold">No. Ref</th><th className="text-left px-4 py-3 font-semibold">Nama</th>
            <th className="text-left px-4 py-3 font-semibold">Jenjang</th><th className="text-left px-4 py-3 font-semibold">WhatsApp</th>
            <th className="text-left px-4 py-3 font-semibold">Status</th><th className="text-right px-4 py-3 font-semibold">Aksi</th>
          </tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-stone-100">
                <td className="px-4 py-3 font-mono text-xs">{p.ref_no}</td>
                <td className="px-4 py-3 font-semibold text-stone-900">{p.student_name}</td>
                <td className="px-4 py-3">{p.jenjang}</td>
                <td className="px-4 py-3">{p.parent_whatsapp}</td>
                <td className="px-4 py-3">
                  <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                    <SelectTrigger className={`w-36 ${STATUS_COLOR[p.status]}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button variant="outline" size="sm" onClick={() => setDetail(p)}><Eye className="h-3.5 w-3.5" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                    <AlertDialogContent className="bg-white"><AlertDialogHeader><AlertDialogTitle>Hapus pendaftaran ini?</AlertDialogTitle><AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => del(p.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-stone-500">Belum ada pendaftaran.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 lg:hidden grid gap-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white border border-stone-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><div className="font-mono text-xs text-stone-500">{p.ref_no}</div><div className="font-display font-bold text-stone-900 truncate">{p.student_name}</div><div className="text-xs text-stone-500 mt-1">{p.jenjang} · {p.parent_whatsapp}</div></div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[p.status]}`}>{p.status}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setDetail(p)} className="flex-1"><Eye className="h-3.5 w-3.5 mr-1" /> Detail</Button>
              <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}><SelectTrigger className="flex-1"><SelectValue /></SelectTrigger><SelectContent>{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="rounded-2xl border border-dashed p-10 text-center text-stone-500">Belum ada pendaftaran.</div>}
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader><DialogTitle>Detail Pendaftaran</DialogTitle></DialogHeader>
          {detail && (
            <div className="text-sm space-y-2">
              <Row label="Nomor Referensi" v={detail.ref_no} />
              <Row label="Nama Peserta Didik" v={detail.student_name} />
              <Row label="Jenis Kelamin" v={detail.gender} />
              <Row label="Tempat / Tanggal Lahir" v={`${detail.birth_place} / ${detail.birth_date}`} />
              <Row label="Jenjang" v={detail.jenjang} />
              <Row label="Nama Orang Tua" v={detail.parent_name} />
              <Row label="WhatsApp" v={detail.parent_whatsapp} />
              <Row label="Alamat" v={detail.address} />
              <Row label="Catatan" v={detail.notes} />
              <Row label="Status" v={detail.status} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, v }) {
  return <div className="grid grid-cols-3 gap-3 py-1"><div className="text-stone-500">{label}</div><div className="col-span-2 text-stone-900">{v || "-"}</div></div>;
}
