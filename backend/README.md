# Admin Dashboard - Python Backend

FastAPI ile geliştirilmiş modern admin dashboard backend API.

## Özellikler

- ✅ FastAPI framework
- ✅ SQLAlchemy ORM
- ✅ PostgreSQL veritabanı
- ✅ JWT authentication
- ✅ Rol bazlı yetki kontrolü
- ✅ RESTful API endpoints

## Teknolojiler

- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt (passlib)
- **Validation:** Pydantic
- **Migrations:** Alembic

## Kurulum

### 1. Python Virtual Environment Oluşturma

```bash
cd backend
python -m venv venv

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# Mac/Linux
source venv/bin/activate
```

### 2. Bağımlılıkları Yükleme

```bash
pip install -r requirements.txt
```

### 3. Environment Variables Ayarlama

`.env` dosyası oluşturun:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### 4. Veritabanını Oluşturma

PostgreSQL veritabanı oluşturun:

```sql
CREATE DATABASE dene_admin;
```

Veya SQLite kullanmak için `.env` dosyasında:

```env
DATABASE_URL=sqlite:///./app.db
```

### 5. Veritabanı Migration

```bash
# Alembic ile migration
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

Veya tabloları otomatik oluştur (development için):

```python
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### 6. İlk Kullanıcıları Ekleme

```bash
python seed.py
```

### 7. Server'ı Başlatma

```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API şu adreste çalışacaktır: http://localhost:8000

API dokümantasyonu: http://localhost:8000/docs

## API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/login-json` - Kullanıcı girişi (JSON)
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri

### Customers
- `GET /api/customers` - Tüm müşterileri getir
- `POST /api/customers` - Yeni müşteri ekle
- `DELETE /api/customers/{id}` - Müşteriyi sil

### Users
- `GET /api/users` - Tüm kullanıcıları getir
- `POST /api/users` - Yeni kullanıcı ekle
- `PATCH /api/users/{id}` - Kullanıcı güncelle
- `DELETE /api/users/{id}` - Kullanıcı sil

### Collaboration Codes
- `GET /api/collaboration-codes` - Tüm kodları getir
- `POST /api/collaboration-codes` - Yeni kod ekle
- `PATCH /api/collaboration-codes/{id}` - Kodu güncelle
- `DELETE /api/collaboration-codes/{id}` - Kodu sil

### Collaboration Stats
- `GET /api/collaboration-stats` - İstatistikleri getir

### Financial
- `GET /api/financial/stats` - Finansal istatistikler
- `GET /api/financial/customer-revenue` - Müşteri bazlı gelirler

## Yetkiler

- `can_manage_customers` - Müşteri yönetimi
- `can_manage_financial` - Finansal veriler
- `can_manage_collaboration_codes` - İşbirliği kodları
- `can_view_collaboration_stats` - İşbirliği istatistikleri
- `can_manage_access` - Erişim yönetimi
- `can_delete_users` - Kullanıcı silme

## Frontend Entegrasyonu

Frontend React uygulaması bu API'ye bağlanmalı:

```typescript
const API_URL = "http://localhost:8000/api"

// Login
const response = await fetch(`${API_URL}/auth/login-json`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
})
const { access_token } = await response.json()

// API çağrıları için token kullan
const headers = {
  "Authorization": `Bearer ${access_token}`,
  "Content-Type": "application/json"
}
```

## Scripts

```bash
# Server başlat
uvicorn app.main:app --reload

# Seed çalıştır
python seed.py

# Migration oluştur
alembic revision --autogenerate -m "migration message"

# Migration uygula
alembic upgrade head
```

## Lisans

MIT
