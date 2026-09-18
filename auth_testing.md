# SKh Pelita Al-Karomah Auth Testing

Admin credentials (see /app/memory/test_credentials.md):
- Email: fachri.arieffauzi@gmail.com
- Password: Admin123!

Test flow:
1) POST /api/auth/login {email,password} -> returns {id,email,name,role,access_token}
2) GET /api/auth/me with Bearer token -> returns user
3) POST /api/auth/logout with Bearer -> clears cookie

Auth is JWT-based (7d TTL). Frontend stores token in localStorage 'skh_token' AND uses httpOnly cookie via credentials: include. Both work.

Protected endpoints (require auth):
- GET /api/admin/stats
- GET/POST/PUT/DELETE /api/admin/news
- GET/POST/PUT/DELETE /api/admin/programs
- GET/POST/PUT/DELETE /api/admin/teachers
- GET/POST/PUT/DELETE /api/admin/events
- GET/POST/PUT/DELETE /api/admin/gallery
- GET/PUT/DELETE /api/admin/ppdb
- PUT /api/admin/settings
