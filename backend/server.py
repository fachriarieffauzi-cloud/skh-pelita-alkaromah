from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ---------------- Database ----------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---------------- JWT ----------------
JWT_ALGO = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode("utf-8"), h.encode("utf-8"))
    except Exception:
        return False


def create_token(user_id: str, email: str, minutes: int = 60 * 24 * 7) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------- Models ----------------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    school_name: str = "SKh Pelita Al-Karomah"
    tagline: str = "Tempat bertumbuh, belajar, berkarya, dan menjadi pribadi yang mandiri."
    hero_title: str = "Selamat Datang di SKh Pelita Al-Karomah"
    hero_subtitle: str = "Tempat bertumbuh, belajar, berkarya, dan menjadi pribadi yang mandiri."
    hero_image_url: str = "https://images.unsplash.com/photo-1577896851231-70ef18881754?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsJTIwbmVlZHMlMjBlZHVjYXRpb24lMjB0ZWFjaGVyJTIwc3R1ZGVudCUyMGNsYXNzcm9vbXxlbnwwfHx8fDE3ODk3NDU3MTB8MA&ixlib=rb-4.1.0&q=85"
    logo_url: str = ""
    about_short: str = "SKh Pelita Al-Karomah adalah Sekolah Khusus yang berkomitmen mendampingi setiap peserta didik untuk tumbuh sesuai potensinya, mandiri, dan berkarakter."
    about_long: str = "Kami hadir sebagai rumah belajar yang hangat dan inklusif, tempat setiap anak berkebutuhan khusus dihargai keunikannya. Melalui pembelajaran yang disesuaikan, program kemandirian, dan dukungan terapi, kami membantu peserta didik siap berpartisipasi di lingkungan keluarga dan masyarakat."
    principal_name: str = "Rustiyanah, S.Pd."
    principal_message: str = "Selamat datang di SKh Pelita Al-Karomah. Kami percaya setiap anak istimewa memiliki potensi yang luar biasa. Melalui pendampingan yang penuh kasih, kami membimbing peserta didik untuk berkembang, mandiri, dan bahagia."
    principal_photo_url: str = "https://images.pexels.com/photos/37795357/pexels-photo-37795357.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    visi: str = "Mewujudkan peserta didik yang berkembang sesuai potensi, mandiri, berkarakter, dan mampu berpartisipasi dalam kehidupan bermasyarakat."
    misi: List[str] = [
        "Menyelenggarakan pembelajaran yang disesuaikan dengan kebutuhan peserta didik.",
        "Mengembangkan potensi individu melalui pendekatan yang penuh kasih.",
        "Membangun kemandirian dalam kegiatan sehari-hari.",
        "Menumbuhkan keterampilan hidup dan vokasional.",
        "Menjalin kolaborasi erat dengan orang tua dan masyarakat.",
    ]
    address: str = "[Alamat Sekolah]"
    whatsapp: str = "085211612045"
    email: str = "[Email Sekolah]"
    service_hours: str = "Senin - Jumat, 07.30 - 14.00 WIB"
    maps_embed: str = ""
    instagram: str = ""
    facebook: str = ""
    youtube: str = ""
    tiktok: str = ""


class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str = ""
    category: str = "Umum"
    summary: str = ""
    content: str = ""
    image_url: str = ""
    published: bool = True
    date: str = Field(default_factory=now_iso)
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class Program(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    icon: str = "GraduationCap"
    description: str = ""
    order: int = 0
    published: bool = True
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class Teacher(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str = ""
    subject: str = ""
    photo_url: str = ""
    published: bool = True
    order: int = 0
    created_at: str = Field(default_factory=now_iso)


class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    date: str = ""
    time: str = ""
    location: str = ""
    published: bool = True
    created_at: str = Field(default_factory=now_iso)


class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    caption: str = ""
    category: str = "Kegiatan Sekolah"
    image_url: str
    published: bool = True
    created_at: str = Field(default_factory=now_iso)


class PPDBApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ref_no: str = ""
    student_name: str
    birth_place: str = ""
    birth_date: str = ""
    gender: str = ""
    parent_name: str = ""
    parent_whatsapp: str = ""
    address: str = ""
    jenjang: str = ""
    notes: str = ""
    status: Literal["Menunggu", "Diterima", "Wawancara", "Ditolak"] = "Menunggu"
    created_at: str = Field(default_factory=now_iso)


# ---------------- App ----------------
app = FastAPI(title="SKh Pelita Al-Karomah API")
api = APIRouter(prefix="/api")


# ---------------- Auth ----------------
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Tidak terautentikasi")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="Pengguna tidak ditemukan")
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesi kedaluwarsa")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token tidak valid")


@api.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email atau kata sandi salah")
    token = create_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 7,
        path="/",
    )
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "access_token": token,
    }


@api.post("/auth/logout")
async def logout(response: Response, user=Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    return {"message": "Berhasil keluar"}


@api.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user


# ---------------- Site Settings ----------------
SETTINGS_ID = "singleton"


async def get_settings_doc() -> dict:
    doc = await db.settings.find_one({"id": SETTINGS_ID})
    if not doc:
        default = SiteSettings().model_dump()
        default["id"] = SETTINGS_ID
        await db.settings.insert_one(default)
        default.pop("_id", None)
        return default
    doc.pop("_id", None)
    return doc


@api.get("/settings")
async def get_settings():
    return await get_settings_doc()


@api.put("/admin/settings")
async def update_settings(data: dict, user=Depends(get_current_user)):
    data.pop("id", None)
    data.pop("_id", None)
    await db.settings.update_one({"id": SETTINGS_ID}, {"$set": data}, upsert=True)
    return await get_settings_doc()


# ---------------- CRUD helpers ----------------
async def list_collection(coll, only_published=True, sort_field="created_at", direction=-1):
    q = {"published": True} if only_published else {}
    cursor = coll.find(q, {"_id": 0}).sort(sort_field, direction)
    return await cursor.to_list(1000)


# ---------------- News ----------------
@api.get("/news")
async def public_news(limit: int = 100):
    items = await db.news.find({"published": True}, {"_id": 0}).sort("date", -1).to_list(limit)
    return items


@api.get("/news/{item_id}")
async def get_news(item_id: str):
    n = await db.news.find_one({"id": item_id}, {"_id": 0})
    if not n:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return n


@api.get("/admin/news")
async def admin_news(user=Depends(get_current_user)):
    return await db.news.find({}, {"_id": 0}).sort("date", -1).to_list(1000)


@api.post("/admin/news")
async def create_news(item: News, user=Depends(get_current_user)):
    doc = item.model_dump()
    await db.news.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/admin/news/{item_id}")
async def update_news(item_id: str, data: dict, user=Depends(get_current_user)):
    data["updated_at"] = now_iso()
    data.pop("_id", None)
    r = await db.news.update_one({"id": item_id}, {"$set": data})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return await db.news.find_one({"id": item_id}, {"_id": 0})


@api.delete("/admin/news/{item_id}")
async def delete_news(item_id: str, user=Depends(get_current_user)):
    await db.news.delete_one({"id": item_id})
    return {"message": "Berita berhasil dihapus"}


# ---------------- Programs ----------------
@api.get("/programs")
async def public_programs():
    return await db.programs.find({"published": True}, {"_id": 0}).sort("order", 1).to_list(1000)


@api.get("/admin/programs")
async def admin_programs(user=Depends(get_current_user)):
    return await db.programs.find({}, {"_id": 0}).sort("order", 1).to_list(1000)


@api.post("/admin/programs")
async def create_program(item: Program, user=Depends(get_current_user)):
    doc = item.model_dump()
    await db.programs.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/admin/programs/{item_id}")
async def update_program(item_id: str, data: dict, user=Depends(get_current_user)):
    data["updated_at"] = now_iso()
    data.pop("_id", None)
    r = await db.programs.update_one({"id": item_id}, {"$set": data})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Program tidak ditemukan")
    return await db.programs.find_one({"id": item_id}, {"_id": 0})


@api.delete("/admin/programs/{item_id}")
async def delete_program(item_id: str, user=Depends(get_current_user)):
    await db.programs.delete_one({"id": item_id})
    return {"message": "Program berhasil dihapus"}


# ---------------- Teachers ----------------
@api.get("/teachers")
async def public_teachers():
    return await db.teachers.find({"published": True}, {"_id": 0}).sort("order", 1).to_list(1000)


@api.get("/admin/teachers")
async def admin_teachers(user=Depends(get_current_user)):
    return await db.teachers.find({}, {"_id": 0}).sort("order", 1).to_list(1000)


@api.post("/admin/teachers")
async def create_teacher(item: Teacher, user=Depends(get_current_user)):
    doc = item.model_dump()
    await db.teachers.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/admin/teachers/{item_id}")
async def update_teacher(item_id: str, data: dict, user=Depends(get_current_user)):
    data.pop("_id", None)
    r = await db.teachers.update_one({"id": item_id}, {"$set": data})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Guru tidak ditemukan")
    return await db.teachers.find_one({"id": item_id}, {"_id": 0})


@api.delete("/admin/teachers/{item_id}")
async def delete_teacher(item_id: str, user=Depends(get_current_user)):
    await db.teachers.delete_one({"id": item_id})
    return {"message": "Data guru berhasil dihapus"}


# ---------------- Events ----------------
@api.get("/events")
async def public_events():
    return await db.events.find({"published": True}, {"_id": 0}).sort("date", 1).to_list(1000)


@api.get("/admin/events")
async def admin_events(user=Depends(get_current_user)):
    return await db.events.find({}, {"_id": 0}).sort("date", 1).to_list(1000)


@api.post("/admin/events")
async def create_event(item: Event, user=Depends(get_current_user)):
    doc = item.model_dump()
    await db.events.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/admin/events/{item_id}")
async def update_event(item_id: str, data: dict, user=Depends(get_current_user)):
    data.pop("_id", None)
    r = await db.events.update_one({"id": item_id}, {"$set": data})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agenda tidak ditemukan")
    return await db.events.find_one({"id": item_id}, {"_id": 0})


@api.delete("/admin/events/{item_id}")
async def delete_event(item_id: str, user=Depends(get_current_user)):
    await db.events.delete_one({"id": item_id})
    return {"message": "Agenda berhasil dihapus"}


# ---------------- Gallery ----------------
@api.get("/gallery")
async def public_gallery(category: Optional[str] = None):
    q = {"published": True}
    if category:
        q["category"] = category
    return await db.gallery.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api.get("/admin/gallery")
async def admin_gallery(user=Depends(get_current_user)):
    return await db.gallery.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api.post("/admin/gallery")
async def create_gallery(item: GalleryItem, user=Depends(get_current_user)):
    doc = item.model_dump()
    await db.gallery.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/admin/gallery/{item_id}")
async def update_gallery(item_id: str, data: dict, user=Depends(get_current_user)):
    data.pop("_id", None)
    r = await db.gallery.update_one({"id": item_id}, {"$set": data})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Galeri tidak ditemukan")
    return await db.gallery.find_one({"id": item_id}, {"_id": 0})


@api.delete("/admin/gallery/{item_id}")
async def delete_gallery(item_id: str, user=Depends(get_current_user)):
    await db.gallery.delete_one({"id": item_id})
    return {"message": "Galeri berhasil dihapus"}


# ---------------- PPDB ----------------
@api.post("/ppdb")
async def submit_ppdb(item: PPDBApplication):
    count = await db.ppdb.count_documents({})
    year = datetime.now(timezone.utc).year
    item.ref_no = f"PPDB-{year}-{count + 1:04d}"
    doc = item.model_dump()
    await db.ppdb.insert_one(doc)
    doc.pop("_id", None)
    return {"message": "Pendaftaran berhasil dikirim", "ref_no": item.ref_no, "data": doc}


@api.get("/admin/ppdb")
async def admin_ppdb(user=Depends(get_current_user)):
    return await db.ppdb.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api.put("/admin/ppdb/{item_id}")
async def update_ppdb(item_id: str, data: dict, user=Depends(get_current_user)):
    data.pop("_id", None)
    r = await db.ppdb.update_one({"id": item_id}, {"$set": data})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pendaftaran tidak ditemukan")
    return await db.ppdb.find_one({"id": item_id}, {"_id": 0})


@api.delete("/admin/ppdb/{item_id}")
async def delete_ppdb(item_id: str, user=Depends(get_current_user)):
    await db.ppdb.delete_one({"id": item_id})
    return {"message": "Pendaftaran berhasil dihapus"}


# ---------------- Dashboard Stats ----------------
@api.get("/admin/stats")
async def admin_stats(user=Depends(get_current_user)):
    return {
        "news": await db.news.count_documents({}),
        "events": await db.events.count_documents({}),
        "teachers": await db.teachers.count_documents({}),
        "gallery": await db.gallery.count_documents({}),
        "ppdb": await db.ppdb.count_documents({}),
        "ppdb_pending": await db.ppdb.count_documents({"status": "Menunggu"}),
    }


# ---------------- Seed ----------------
async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower().strip()
    password = os.environ.get("ADMIN_PASSWORD", "admin123")
    name = os.environ.get("ADMIN_NAME", "Admin")
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": name,
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info(f"Admin seeded: {email}")
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password), "name": name}})
        logger.info(f"Admin password refreshed: {email}")


async def seed_demo():
    # Settings
    await get_settings_doc()

    # Programs
    if await db.programs.count_documents({}) == 0:
        programs = [
            ("SDLB", "GraduationCap", "Jenjang pendidikan dasar khusus dengan pembelajaran yang disesuaikan kebutuhan peserta didik.", 1),
            ("SMPLB", "BookOpen", "Jenjang menengah pertama dengan fokus pada penguatan akademik dasar dan kemandirian.", 2),
            ("SMALB", "School", "Jenjang menengah atas dengan penekanan pada keterampilan hidup dan vokasional.", 3),
            ("Program Kemandirian", "Sparkles", "Melatih peserta didik dalam kegiatan sehari-hari dan bina diri.", 4),
            ("Program Keterampilan", "Hammer", "Keterampilan tata boga, kerajinan tangan, dan pengenalan komputer dasar.", 5),
            ("Ekstrakurikuler", "Music", "Kegiatan seni, olahraga, dan pengembangan minat bakat peserta didik.", 6),
        ]
        for title, icon, desc, order in programs:
            doc = Program(title=title, icon=icon, description=desc, order=order).model_dump()
            await db.programs.insert_one(doc)

    # Teachers
    if await db.teachers.count_documents({}) == 0:
        teachers = [
            ("[Nama Kepala Sekolah]", "Kepala Sekolah", "Manajemen Sekolah"),
            ("[Nama Guru 1]", "Guru Kelas SDLB", "Pembelajaran Dasar"),
            ("[Nama Guru 2]", "Guru Kelas SMPLB", "Bina Diri & Kemandirian"),
            ("[Nama Guru 3]", "Guru Keterampilan", "Tata Boga & Kerajinan"),
            ("[Nama Tenaga Kependidikan]", "Tenaga Administrasi", "Tata Usaha"),
        ]
        for i, (name, position, subject) in enumerate(teachers):
            doc = Teacher(name=name, position=position, subject=subject, order=i,
                          photo_url="https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940").model_dump()
            await db.teachers.insert_one(doc)

    # News
    if await db.news.count_documents({}) == 0:
        news_items = [
            ("Memulai Tahun Ajaran dengan Semangat Baru",
             "Kegiatan Sekolah",
             "Peserta didik dan tenaga pendidik SKh Pelita Al-Karomah memulai tahun ajaran baru dengan semangat dan kebersamaan.",
             "Awal tahun ajaran menjadi momen istimewa bagi seluruh keluarga besar SKh Pelita Al-Karomah. Kegiatan diawali dengan doa bersama, pengenalan lingkungan sekolah, serta orientasi program pembelajaran yang disesuaikan dengan kebutuhan masing-masing peserta didik.",
             "https://images.pexels.com/photos/4173338/pexels-photo-4173338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"),
            ("Perayaan Hari Kemerdekaan di SKh Pelita Al-Karomah",
             "Perayaan",
             "Rangkaian kegiatan lomba dan pentas seni memeriahkan peringatan HUT Kemerdekaan Republik Indonesia.",
             "Peringatan Hari Kemerdekaan diisi dengan berbagai perlombaan yang disesuaikan agar seluruh peserta didik dapat berpartisipasi. Acara ditutup dengan pentas seni dari peserta didik dan bapak/ibu guru.",
             "https://images.pexels.com/photos/7494914/pexels-photo-7494914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"),
            ("Kegiatan Pembelajaran dan Pengembangan Kemandirian Siswa",
             "Kegiatan Pembelajaran",
             "Program kemandirian membantu peserta didik menguasai kegiatan sehari-hari sesuai kemampuan mereka.",
             "Melalui pembelajaran bina diri, peserta didik dilatih untuk melakukan aktivitas sehari-hari secara mandiri, mulai dari berpakaian, menjaga kebersihan diri, hingga berinteraksi dengan lingkungan sekitar.",
             "https://images.unsplash.com/photo-1780039298271-f3e1318eb3ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxpbmNsdXNpdmUlMjBzY2hvb2wlMjBhcnQlMjBtdXNpYyUyMHRoZXJhcHklMjB0aGVyYXB5JTIwcm9vbSUyMGtpZHN8ZW58MHx8fHwxNzg5NzQ1NzEwfDA&ixlib=rb-4.1.0&q=85"),
        ]
        for title, cat, summary, content, img in news_items:
            doc = News(title=title, category=cat, summary=summary, content=content, image_url=img).model_dump()
            await db.news.insert_one(doc)

    # Events
    if await db.events.count_documents({}) == 0:
        events = [
            ("Pertemuan Orang Tua Peserta Didik", "Pertemuan rutin bersama orang tua/wali untuk membahas perkembangan peserta didik.", "2026-03-15", "09.00 - 11.00 WIB", "Aula Sekolah"),
            ("Pentas Seni Peserta Didik", "Ajang unjuk bakat peserta didik dalam bidang seni dan musik.", "2026-04-22", "08.00 - 12.00 WIB", "Aula Sekolah"),
            ("Kunjungan Edukatif", "Kegiatan belajar di luar kelas untuk memperkaya pengalaman peserta didik.", "2026-05-10", "07.30 - 14.00 WIB", "Kebun Edukasi"),
        ]
        for t, d, dt, tm, loc in events:
            doc = Event(title=t, description=d, date=dt, time=tm, location=loc).model_dump()
            await db.events.insert_one(doc)

    # Gallery
    if await db.gallery.count_documents({}) == 0:
        gallery = [
            ("Kegiatan pembelajaran di kelas", "Kegiatan Pembelajaran", "https://images.pexels.com/photos/4173338/pexels-photo-4173338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"),
            ("Kegiatan seni siswa", "Kegiatan Siswa", "https://images.pexels.com/photos/7494914/pexels-photo-7494914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"),
            ("Ruang sensori dan terapi", "Kegiatan Sekolah", "https://images.unsplash.com/photo-1694885146901-b1d05cb1f549?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHw3fHxpbmNsdXNpdmUlMjBzY2hvb2wlMjBhcnQlMjBtdXNpYyUyMHRoZXJhcHklMjB0aGVyYXB5JTIwcm9vbSUyMGtpZHN8ZW58MHx8fHwxNzg5NzQ1NzEwfDA&ixlib=rb-4.1.0&q=85"),
            ("Kegiatan musik dan terapi", "Ekstrakurikuler", "https://images.unsplash.com/photo-1780039298271-f3e1318eb3ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxpbmNsdXNpdmUlMjBzY2hvb2wlMjBhcnQlMjBtdXNpYyUyMHRoZXJhcHklMjB0aGVyYXB5JTIwcm9vbSUyMGtpZHN8ZW58MHx8fHwxNzg5NzQ1NzEwfDA&ixlib=rb-4.1.0&q=85"),
            ("Perayaan hari kemerdekaan", "Perayaan", "https://images.unsplash.com/photo-1615466178532-b6d2f9c304de?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHRlYWNoZXIlMjBlbGVtZW50YXJ5JTIwc2Nob29sJTIwc3R1ZGVudHMlMjBzbWlsaW5nJTIwaW5kb25lc2lhfGVufDB8fHx8MTc4OTc0NTcxMHww&ixlib=rb-4.1.0&q=85"),
            ("Aktivitas kelas kreatif", "Kegiatan Pembelajaran", "https://images.pexels.com/photos/37795357/pexels-photo-37795357.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"),
        ]
        for cap, cat, img in gallery:
            doc = GalleryItem(caption=cap, category=cat, image_url=img).model_dump()
            await db.gallery.insert_one(doc)


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.news.create_index("id", unique=True)
    await db.programs.create_index("id", unique=True)
    await db.teachers.create_index("id", unique=True)
    await db.events.create_index("id", unique=True)
    await db.gallery.create_index("id", unique=True)
    await db.ppdb.create_index("id", unique=True)
    await seed_admin()
    await seed_demo()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


@api.get("/")
async def root():
    return {"message": "SKh Pelita Al-Karomah API"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
