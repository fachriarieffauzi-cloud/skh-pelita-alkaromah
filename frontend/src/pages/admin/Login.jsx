import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Berhasil masuk");
      navigate("/admin");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail, "Email atau kata sandi salah"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-radial flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-stone-200 shadow-2xl shadow-orange-200/40 p-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-display font-bold text-lg">P</div>
          <div>
            <div className="font-display font-bold text-stone-900">SKh Pelita Al-Karomah</div>
            <div className="text-xs text-orange-700 font-semibold uppercase tracking-widest">Admin</div>
          </div>
        </div>
        <h1 className="font-display mt-8 text-2xl font-bold text-stone-900">Masuk ke Admin</h1>
        <p className="text-sm text-stone-600 mt-1">Silakan masuk untuk mengelola konten sekolah.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" data-testid="admin-login-form">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" required data-testid="admin-email" autoComplete="email" />
          </div>
          <div>
            <Label>Kata Sandi</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" required data-testid="admin-password" autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold" data-testid="admin-submit">
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
