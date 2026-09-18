import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import PublicLayout from "@/components/PublicLayout";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import Profil from "@/pages/Profil";
import Program from "@/pages/Program";
import Guru from "@/pages/Guru";
import Berita from "@/pages/Berita";
import BeritaDetail from "@/pages/BeritaDetail";
import Galeri from "@/pages/Galeri";
import PPDB from "@/pages/PPDB";
import Kontak from "@/pages/Kontak";

import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import AdminBerita from "@/pages/admin/AdminBerita";
import AdminProgram from "@/pages/admin/AdminProgram";
import AdminGuru from "@/pages/admin/AdminGuru";
import AdminAgenda from "@/pages/admin/AdminAgenda";
import AdminGaleri from "@/pages/admin/AdminGaleri";
import AdminPPDB from "@/pages/admin/AdminPPDB";
import AdminPengaturan from "@/pages/admin/AdminPengaturan";

function App() {
  useEffect(() => {
    document.title = "SKh Pelita Al-Karomah | Sekolah Khusus";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Website resmi SKh Pelita Al-Karomah. Informasi profil, program pendidikan, kegiatan, berita, PPDB, dan informasi sekolah.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description"; m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  return (
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="profil" element={<Profil />} />
              <Route path="program" element={<Program />} />
              <Route path="guru" element={<Guru />} />
              <Route path="berita" element={<Berita />} />
              <Route path="berita/:id" element={<BeritaDetail />} />
              <Route path="galeri" element={<Galeri />} />
              <Route path="ppdb" element={<PPDB />} />
              <Route path="kontak" element={<Kontak />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="berita" element={<AdminBerita />} />
              <Route path="program" element={<AdminProgram />} />
              <Route path="guru" element={<AdminGuru />} />
              <Route path="agenda" element={<AdminAgenda />} />
              <Route path="galeri" element={<AdminGaleri />} />
              <Route path="ppdb" element={<AdminPPDB />} />
              <Route path="pengaturan" element={<AdminPengaturan />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
