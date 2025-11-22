from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, customers, users, collaboration_codes, collaboration_stats, financial
from app.config import settings

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Admin Dashboard API",
    description="Admin Dashboard API - FastAPI",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları ekle
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(collaboration_codes.router, prefix="/api/collaboration-codes", tags=["Collaboration Codes"])
app.include_router(collaboration_stats.router, prefix="/api/collaboration-stats", tags=["Collaboration Stats"])
app.include_router(financial.router, prefix="/api/financial", tags=["Financial"])


@app.get("/")
async def root():
    return {"message": "Admin Dashboard API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

