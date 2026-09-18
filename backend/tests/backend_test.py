"""Backend API tests for SKh Pelita Al-Karomah."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://skh-karomah.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "fachri.arieffauzi@gmail.com"
ADMIN_PASSWORD = "Admin123!"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def token(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_h(token):
    return {"Authorization": f"Bearer {token}"}


# ---- Public endpoints ----
def test_settings(s):
    r = s.get(f"{API}/settings")
    assert r.status_code == 200
    d = r.json()
    assert d["school_name"] == "SKh Pelita Al-Karomah"
    assert d["hero_title"]
    assert isinstance(d["misi"], list) and len(d["misi"]) >= 3
    assert "principal_name" in d


def test_news_list(s):
    r = s.get(f"{API}/news")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 3
    assert "id" in items[0] and "title" in items[0]


def test_news_by_id(s):
    items = s.get(f"{API}/news").json()
    r = s.get(f"{API}/news/{items[0]['id']}")
    assert r.status_code == 200
    assert r.json()["id"] == items[0]["id"]


def test_news_404(s):
    r = s.get(f"{API}/news/does-not-exist")
    assert r.status_code == 404


def test_programs(s):
    r = s.get(f"{API}/programs")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 6
    orders = [i["order"] for i in items]
    assert orders == sorted(orders)


def test_teachers(s):
    r = s.get(f"{API}/teachers")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_events(s):
    r = s.get(f"{API}/events")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_gallery(s):
    r = s.get(f"{API}/gallery")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_gallery_filter(s):
    r = s.get(f"{API}/gallery", params={"category": "Ekstrakurikuler"})
    assert r.status_code == 200
    for it in r.json():
        assert it["category"] == "Ekstrakurikuler"


# ---- PPDB ----
def test_ppdb_submit(s):
    payload = {
        "student_name": "TEST_Siswa",
        "parent_name": "TEST_Orangtua",
        "parent_whatsapp": "081234567890",
        "jenjang": "SDLB",
    }
    r = s.post(f"{API}/ppdb", json=payload)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["ref_no"].startswith("PPDB-")
    parts = d["ref_no"].split("-")
    assert len(parts) == 3 and len(parts[2]) == 4


# ---- Auth ----
def test_admin_requires_auth(s):
    for ep in ["/admin/stats", "/admin/news", "/admin/ppdb", "/admin/programs"]:
        r = requests.get(f"{API}{ep}")
        assert r.status_code == 401, f"{ep} => {r.status_code}"


def test_login_success(token):
    assert token and isinstance(token, str)


def test_login_fail(s):
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_me(auth_h):
    r = requests.get(f"{API}/auth/me", headers=auth_h)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# ---- Admin CRUD ----
def test_admin_stats(auth_h):
    r = requests.get(f"{API}/admin/stats", headers=auth_h)
    assert r.status_code == 200
    d = r.json()
    for k in ["news", "events", "teachers", "gallery", "ppdb", "ppdb_pending"]:
        assert k in d


def test_news_crud(auth_h):
    payload = {"title": "TEST_News", "summary": "s", "content": "c"}
    r = requests.post(f"{API}/admin/news", json=payload, headers=auth_h)
    assert r.status_code == 200
    created = r.json()
    nid = created["id"]
    # Verify persisted
    r2 = requests.get(f"{API}/news/{nid}")
    assert r2.status_code == 200
    # Update
    r3 = requests.put(f"{API}/admin/news/{nid}", json={"title": "TEST_News_upd"}, headers=auth_h)
    assert r3.status_code == 200
    assert r3.json()["title"] == "TEST_News_upd"
    # Delete
    r4 = requests.delete(f"{API}/admin/news/{nid}", headers=auth_h)
    assert r4.status_code == 200
    r5 = requests.get(f"{API}/news/{nid}")
    assert r5.status_code == 404


def test_settings_update(auth_h):
    orig = requests.get(f"{API}/settings").json()
    new_hero = "TEST_Hero"
    r = requests.put(f"{API}/admin/settings", json={"hero_title": new_hero}, headers=auth_h)
    assert r.status_code == 200
    r2 = requests.get(f"{API}/settings")
    assert r2.json()["hero_title"] == new_hero
    # restore
    requests.put(f"{API}/admin/settings", json={"hero_title": orig["hero_title"]}, headers=auth_h)


def test_ppdb_status_update(auth_h):
    # Create a submission
    payload = {"student_name": "TEST_StatusFlow", "parent_name": "P", "parent_whatsapp": "0800", "jenjang": "SDLB"}
    sub = requests.post(f"{API}/ppdb", json=payload).json()
    # Fetch admin list to get id
    lst = requests.get(f"{API}/admin/ppdb", headers=auth_h).json()
    match = [x for x in lst if x["ref_no"] == sub["ref_no"]]
    assert match
    pid = match[0]["id"]
    r = requests.put(f"{API}/admin/ppdb/{pid}", json={"status": "Diterima"}, headers=auth_h)
    assert r.status_code == 200
    assert r.json()["status"] == "Diterima"
    # cleanup
    requests.delete(f"{API}/admin/ppdb/{pid}", headers=auth_h)
