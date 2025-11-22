# Python Backend'e Geçiş Rehberi

Proje baştan Python ile kodlanmıştır. Backend FastAPI, frontend React (mevcut) kullanılıyor.

## Yapı Değişiklikleri

### Önce (Next.js Full-Stack)
- Next.js 16 (full-stack)
- Prisma ORM
- NextAuth.js
- SQLite/PostgreSQL

### Şimdi (Python Backend + React Frontend)
- **Backend:** FastAPI (Python)
- **Frontend:** React (mevcut frontend kullanılabilir)
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL
- **Auth:** JWT (python-jose)

## Proje Yapısı

```
dene_admin/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py       # FastAPI uygulama
│   │   ├── config.py     # Yapılandırma
│   │   ├── database.py   # Database connection
│   │   ├── models.py     # SQLAlchemy modelleri
│   │   ├── schemas.py    # Pydantic şemaları
│   │   ├── dependencies.py # Dependency injection
│   │   ├── utils.py      # Yardımcı fonksiyonlar
│   │   └── routers/      # API route'ları
│   │       ├── auth.py
│   │       ├── customers.py
│   │       ├── users.py
│   │       ├── collaboration_codes.py
│   │       ├── collaboration_stats.py
│   │       └── financial.py
│   ├── requirements.txt  # Python bağımlılıkları
│   ├── seed.py          # Veritabanı seed script
│   └── README.md        # Backend dokümantasyonu
├── app/                 # React frontend (mevcut)
├── components/          # React bileşenleri (mevcut)
└── README.md           # Ana README
```

## Backend Kurulumu

### 1. Python Virtual Environment

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

### 2. Bağımlılıkları Yükle

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

`backend/.env` dosyası oluşturun:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### 4. Veritabanı Oluştur

PostgreSQL veritabanı oluşturun veya SQLite kullanın:

```python
# Tabloları oluştur
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### 5. Seed Çalıştır

```bash
python seed.py
```

### 6. Backend Başlat

```bash
# Development
python run.py

# Veya
uvicorn app.main:app --reload --port 8000
```

Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs

## Frontend Güncelleme

Mevcut React frontend'i backend API'ye bağlamak için:

### 1. API Base URL

Frontend'de API base URL'i değiştirin:

```typescript
// lib/api.ts (yeni dosya oluşturun)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token")
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  },
}
```

### 2. Login Sayfası Güncelle

```typescript
// app/login/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch("http://localhost:8000/api/auth/login-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    
    const data = await response.json()
    localStorage.setItem("token", data.access_token)
    
    // Dashboard'a yönlendir
    router.push("/dashboard")
  } catch (error) {
    // Hata işle
  }
}
```

## API Endpoint Karşılaştırması

| Next.js Route | Python FastAPI Route |
|---------------|---------------------|
| `/api/customers` | `/api/customers` |
| `/api/customers/{id}` | `/api/customers/{id}` |
| `/api/users` | `/api/users` |
| `/api/users/{id}` | `/api/users/{id}` |
| `/api/collaboration-codes` | `/api/collaboration-codes` |
| `/api/collaboration-stats` | `/api/collaboration-stats` |
| `/api/financial` | `/api/financial/stats` |
| `/api/auth/[...nextauth]` | `/api/auth/login-json` |

## Authentication

NextAuth.js yerine JWT kullanılıyor:

1. Login → `/api/auth/login-json` → JWT token al
2. Token'ı localStorage'a kaydet
3. Her API çağrısında `Authorization: Bearer {token}` header'ı ekle

## Veritabanı

Prisma yerine SQLAlchemy kullanılıyor:

- Models: `app/models.py`
- Migrations: Alembic ile yapılır
- Connection: `app/database.py`

## Önemli Notlar

⚠️ **Frontend ve Backend Ayrı Çalışıyor:**
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- CORS ayarları backend'de yapılmalı

⚠️ **Authentication:**
- NextAuth.js yerine JWT token kullanılıyor
- Token localStorage'da saklanıyor
- Frontend'de authentication logic güncellenmeli

⚠️ **API Format:**
- Tüm endpoints `/api/` prefix'i ile başlıyor
- Response format: JSON
- Error handling: HTTP status codes

## Sonraki Adımlar

1. ✅ Backend kurulumu tamamlandı
2. ⏳ Frontend API entegrasyonu (yapılmalı)
3. ⏳ Authentication flow güncellemesi (yapılmalı)
4. ⏳ API client helper oluşturulması (yapılmalı)

## Yardımcı Komutlar

```bash
# Backend başlat
cd backend
python run.py

# Seed çalıştır
python seed.py

# API test et
curl http://localhost:8000/api/health
```

Başka bir şeye ihtiyaç var mı?
