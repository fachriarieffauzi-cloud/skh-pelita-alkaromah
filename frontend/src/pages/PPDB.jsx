import { useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, FileText, Clock, MessageCircle } from "lucide-react";

export default function PPDB() {
  const [form, setForm] = useState({
    student_name: "", birth_place: "", birth_date: "", gender: "",
    parent_name: "", parent_whatsapp: "", address: "", jenjang: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student_name || !form.parent_name || !form.parent_whatsapp || !form.jenjang) {
      toast.error("Mohon lengkapi data yang wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/ppdb", form);
      setResult(data);
      toast.success("Pendaftaran berhasil dikirim!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-display mt-6 text-3xl sm:text-4xl font-bold text-stone-900">Pendaftaran Berhasil Dikirim</h1>
        <p className="mt-4 text-stone-700">Terima kasih telah mendaftarkan putra/putri Anda. Tim kami akan menghubungi melalui WhatsApp yang Anda daftarkan.</p>
        <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-5 inline-block">
          <div className="text-xs font-bold uppercase tracking-widest text-orange-700">Nomor Referensi</div>
          <div className="mt-1 font-display font-bold text-2xl text-stone-900" data-testid="ppdb-ref-no">{result.ref_no}</div>
        </div>
        <div>
          <Button onClick={() => { setResult(null); setForm({ student_name: "", birth_place: "", birth_date: "", gender: "", parent_name: "", parent_whatsapp: "", address: "", jenjang: "", notes: "" }); }} className="mt-8 rounded-full bg-stone-900 hover:bg-stone-800 text-white px-6 h-12">Daftar Peserta Lain</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-orange-radial py-14 sm:py-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">PPDB</div>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold text-stone-900">Penerimaan Peserta Didik Baru</h1>
          <p className="mt-5 text-lg text-stone-700 max-w-3xl">Silakan lengkapi formulir di bawah ini untuk mendaftarkan putra/putri Anda di SKh Pelita Al-Karomah.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-3 gap-8">
        <aside className="space-y-4 lg:sticky lg:top-28 h-fit">
          <div className="rounded-2xl bg-white border border-stone-200 p-5"><FileText className="h-5 w-5 text-orange-600" /><div className="mt-3 font-display font-bold text-stone-900">Persyaratan</div><ul className="mt-3 text-sm text-stone-700 space-y-1.5 list-disc list-inside"><li>Fotokopi Akta Kelahiran</li><li>Fotokopi Kartu Keluarga</li><li>Pas Foto Terbaru</li><li>Surat Keterangan dari Ahli (jika ada)</li></ul></div>
          <div className="rounded-2xl bg-white border border-stone-200 p-5"><Clock className="h-5 w-5 text-orange-600" /><div className="mt-3 font-display font-bold text-stone-900">Alur Pendaftaran</div><ol className="mt-3 text-sm text-stone-700 space-y-1.5 list-decimal list-inside"><li>Isi formulir online</li><li>Verifikasi via WhatsApp</li><li>Assessment / wawancara</li><li>Pengumuman diterima</li></ol></div>
          <div className="rounded-2xl bg-stone-900 text-white p-5"><MessageCircle className="h-5 w-5 text-amber-400" /><div className="mt-3 font-display font-bold">Butuh bantuan?</div><p className="mt-2 text-sm text-stone-300">Hubungi kami via WhatsApp jika ada pertanyaan seputar PPDB.</p></div>
        </aside>

        <form onSubmit={submit} className="lg:col-span-2 rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6" data-testid="ppdb-form">
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900">Data Calon Peserta Didik</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div><Label>Nama Lengkap *</Label><Input value={form.student_name} onChange={(e) => upd("student_name", e.target.value)} className="h-12" data-testid="ppdb-student-name" required /></div>
              <div><Label>Jenis Kelamin</Label>
                <Select value={form.gender} onValueChange={(v) => upd("gender", v)}>
                  <SelectTrigger className="h-12" data-testid="ppdb-gender"><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent><SelectItem value="Laki-laki">Laki-laki</SelectItem><SelectItem value="Perempuan">Perempuan</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Tempat Lahir</Label><Input value={form.birth_place} onChange={(e) => upd("birth_place", e.target.value)} className="h-12" data-testid="ppdb-birth-place" /></div>
              <div><Label>Tanggal Lahir</Label><Input type="date" value={form.birth_date} onChange={(e) => upd("birth_date", e.target.value)} className="h-12" data-testid="ppdb-birth-date" /></div>
              <div className="sm:col-span-2"><Label>Jenjang yang Diminati *</Label>
                <Select value={form.jenjang} onValueChange={(v) => upd("jenjang", v)}>
                  <SelectTrigger className="h-12" data-testid="ppdb-jenjang"><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                  <SelectContent><SelectItem value="SDLB">SDLB</SelectItem><SelectItem value="SMPLB">SMPLB</SelectItem><SelectItem value="SMALB">SMALB</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6">
            <h2 className="font-display font-bold text-xl text-stone-900">Data Orang Tua / Wali</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div><Label>Nama Orang Tua / Wali *</Label><Input value={form.parent_name} onChange={(e) => upd("parent_name", e.target.value)} className="h-12" data-testid="ppdb-parent-name" required /></div>
              <div><Label>Nomor WhatsApp *</Label><Input inputMode="tel" value={form.parent_whatsapp} onChange={(e) => upd("parent_whatsapp", e.target.value)} className="h-12" placeholder="08xxxxxxxxxx" data-testid="ppdb-parent-whatsapp" required /></div>
              <div className="sm:col-span-2"><Label>Alamat</Label><Textarea value={form.address} onChange={(e) => upd("address", e.target.value)} rows={3} data-testid="ppdb-address" /></div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6">
            <Label>Catatan Tambahan</Label>
            <Textarea value={form.notes} onChange={(e) => upd("notes", e.target.value)} rows={4} placeholder="Kebutuhan khusus, kondisi anak, atau hal lain yang perlu kami ketahui." data-testid="ppdb-notes" />
          </div>

          <Button type="submit" disabled={submitting} className="w-full h-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-lg shadow-orange-200" data-testid="ppdb-submit-btn">
            {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
          </Button>
        </form>
      </section>
    </div>
  );
}
