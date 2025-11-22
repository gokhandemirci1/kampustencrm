# GitHub'a Yüklenecek Dosya ve Klasörler

## ✅ GitHub'a YÜKLENMESİ GEREKEN (Commit Edilecek)

### 📁 Ana Klasörler
- ✅ `app/` - Tüm Next.js app klasörü (sayfalar, API route'lar)
- ✅ `components/` - React bileşenleri
- ✅ `lib/` - Yardımcı fonksiyonlar (auth, prisma, middleware)
- ✅ `prisma/` - Prisma schema ve migrations
  - ✅ `schema.prisma` - Veritabanı şeması
  - ✅ `migrations/` - Migration dosyaları
  - ✅ `seed.ts` - Seed script (opsiyonel)
- ✅ `public/` - Statik dosyalar (resimler, iconlar)
- ✅ `scripts/` - Utility script'ler (seed.js)
- ✅ `types/` - TypeScript type tanımlamaları

### 📄 Yapılandırma Dosyaları
- ✅ `package.json` - Proje bağımlılıkları
- ✅ `package-lock.json` - Lock file (kesinlikle dahil edin)
- ✅ `tsconfig.json` - TypeScript yapılandırması
- ✅ `next.config.ts` - Next.js yapılandırması
- ✅ `postcss.config.mjs` - PostCSS yapılandırması
- ✅ `eslint.config.mjs` - ESLint yapılandırması
- ✅ `prisma.config.ts` - Prisma yapılandırması
- ✅ `vercel.json` - Vercel deploy yapılandırması
- ✅ `auth.ts` - NextAuth yapılandırması

### 📄 Dokümantasyon
- ✅ `README.md` - Proje dokümantasyonu
- ✅ `DEPLOY.md` - Deploy rehberi
- ✅ `.gitignore` - Git ignore kuralları
- ✅ `.gitattributes` - Git attributes

## ❌ GitHub'a YÜKLENMEMESİ GEREKEN (Ignore Edilecek)

### 🔒 Hassas/Gizli Dosyalar
- ❌ `.env*` - Tüm environment variable dosyaları
  - `.env`
  - `.env.local`
  - `.env.development.local`
  - `.env.production.local`
  - `.env.test.local`

### 📦 Build ve Dependencies
- ❌ `node_modules/` - NPM paketleri (çok büyük, gereksiz)
- ❌ `.next/` - Next.js build çıktısı
- ❌ `out/` - Export çıktısı
- ❌ `build/` - Build klasörü
- ❌ `.pnp/` - Yarn PnP dosyaları

### 💾 Veritabanı Dosyaları
- ❌ `*.db` - Tüm SQLite veritabanı dosyaları
- ❌ `*.db-journal` - SQLite journal dosyaları
- ❌ `dev.db` - Development veritabanı
- ❌ `prisma/dev.db` - Prisma dev veritabanı

### 🔧 IDE ve Sistem Dosyaları
- ❌ `.vercel/` - Vercel local yapılandırması
- ❌ `.DS_Store` - macOS sistem dosyası
- ❌ `*.tsbuildinfo` - TypeScript build bilgileri
- ❌ `next-env.d.ts` - Next.js otomatik oluşturulan dosya

### 📝 Log Dosyaları
- ❌ `npm-debug.log*`
- ❌ `yarn-debug.log*`
- ❌ `yarn-error.log*`
- ❌ `pnpm-debug.log*`

### 🗂️ Diğer
- ❌ `coverage/` - Test coverage raporları
- ❌ `*.pem` - Private key dosyaları
- ❌ `/app/generated/prisma` - Prisma generated dosyalar

## 📋 Hızlı Komutlar

### İlk commit için:

```bash
# Git durumunu kontrol et
git status

# Tüm değişiklikleri ekle (.gitignore'a göre otomatik filtreleme yapılır)
git add .

# Commit et
git commit -m "Initial commit: Admin Dashboard"

# GitHub repository oluşturduktan sonra
git remote add origin https://github.com/kullaniciadi/repo-adi.git
git branch -M main
git push -u origin main
```

### Hangi dosyaların commit edileceğini görmek için:

```bash
git status
```

Bu komut sadece commit edilecek dosyaları gösterir (ignore edilenler görünmez).

### Tüm dosyaları görmek için (ignore edilenler dahil):

```bash
git status --ignored
```

## ⚠️ ÖNEMLİ UYARILAR

1. **`.env` dosyasını ASLA commit etmeyin!**
   - Hassas bilgiler içerir (şifreler, API key'ler)
   - `.gitignore`'da zaten var ama kontrol edin

2. **`node_modules/` ASLA commit etmeyin!**
   - Çok büyük (100MB+)
   - Herkes `npm install` ile kurabilir

3. **Veritabanı dosyalarını ASLA commit etmeyin!**
   - `dev.db` gibi dosyalar ignore edilmeli
   - Herkes kendi local veritabanını oluşturmalı

4. **`package-lock.json` MUTLAKA commit edin!**
   - Paket versiyonlarını sabitler
   - Herkes aynı versiyonları kullanır

## ✅ Önerilen İlk Commit İçeriği

```bash
# Kontrol için
git status

# Eğer doğru dosyalar görünüyorsa
git add .

# Commit mesajı ile
git commit -m "Initial commit: Admin Dashboard

- Next.js 16 + TypeScript setup
- Authentication with NextAuth.js
- Prisma ORM configuration
- Role-based access control
- Customer management
- Financial reporting
- Collaboration code management
- User access management"

# GitHub'a push
git push -u origin main
```

## 🔍 Kontrol Listesi

Commit etmeden önce şunları kontrol edin:

- [ ] `.env` dosyası yok mu? (varsa .gitignore'da olduğundan emin olun)
- [ ] `node_modules/` commit edilmeyecek mi?
- [ ] `dev.db` commit edilmeyecek mi?
- [ ] `package-lock.json` var mı?
- [ ] `README.md` var mı?
- [ ] `prisma/schema.prisma` var mı?
- [ ] `prisma/migrations/` var mı?
- [ ] `.gitignore` doğru yapılandırılmış mı?
