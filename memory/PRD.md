# PRD - SKh Pelita Al-Karomah

## Original Problem Statement
Full-stack school website (public site + admin CMS) for SKh Pelita Al-Karomah (Sekolah Khusus / special-needs school) in Bahasa Indonesia. Mobile-first, warm orange/yellow brand, JWT auth, MongoDB persistence, base64 image support (URL-based for now). Zero-cost dev, no paid APIs.

## Architecture
- Backend: FastAPI + MongoDB (motor). JWT auth (7d), bcrypt hashing, cookie + Bearer.
- Frontend: React 19 + React Router 7 + Tailwind + shadcn/ui + sonner toasts.
- Fonts: Fraunces (display) + Plus Jakarta Sans (body).

## User Personas
1. Parents / prospective parents of ABK - browse info + register PPDB via mobile.
2. School staff (Kepala Sekolah, guru) - update content via admin dashboard.
3. Government / visitors - view profile, programs, news, gallery.

## Core Requirements (static)
- Bahasa Indonesia UI everywhere (public + admin).
- Mobile-first responsive at 320-1440px.
- Orange (#EA580C) + Yellow (#EAB308) brand, no blue primary.
- Accessibility: text-size toggle, 44px targets, WCAG contrast.
- JWT admin auth, protected endpoints.

## Implemented (2026-02-19)
- Public pages: Beranda (hero, profil, sambutan, program, keunggulan, agenda, berita, galeri, CTA PPDB, kontak), Profil, Program, Guru & Tendik, Berita listing + detail, Galeri (kategori + lightbox), PPDB form (single-page multi-section), Kontak.
- Admin: Login, Dashboard stats, CRUD Berita, Program, Guru, Agenda, Galeri, PPDB list/status/detail, Pengaturan (umum, hero, tentang, visi-misi, kontak, sosial).
- Auth: JWT login/logout/me, ProtectedRoute, admin seed from .env, idempotent.
- Demo seed: 6 programs, 5 teachers, 3 news, 3 events, 6 gallery items.
- Accessibility text-size toggle (Normal/Besar) in top bar + mobile menu.

## Backlog (deferred)
- P1: Real image uploads (base64/object storage), rich text editor for news.
- P1: PPDB export CSV.
- P2: Multi-step wizard PPDB, testimoni orang tua section, principal photo upload, favicon custom.
- P2: SEO Open Graph tags, sitemap.xml.
- P3: Multi-admin roles, activity log.

## Next Action Items
- Real image upload (base64 in MongoDB or object storage) instead of URL-only.
- PPDB export CSV for admin.
- Real photo/logo upload from admin.
