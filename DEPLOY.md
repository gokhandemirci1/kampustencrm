# Vercel'e Deploy Rehberi

## Ön Hazırlık

### 1. GitHub Repository Oluşturma

```bash
# Projeyi git'e ekle
git init
git add .
git commit -m "Initial commit"
git branch -M main

# GitHub'da yeni repository oluşturun ve şu komutları çalıştırın:
git remote add origin https://github.com/kullaniciadi/repo-adi.git
git push -u origin main
```

### 2. Environment Variables Hazırlama

Production için gerekli environment variables:

1. **NEXTAUTH_SECRET**: Güvenli bir rastgele string oluşturun
   ```bash
   # Windows PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   
   # Mac/Linux
   openssl rand -base64 32
   ```

2. **DATABASE_URL**: PostgreSQL connection string
   - Vercel Postgres kullanıyorsanız: Vercel dashboard'dan otomatik oluşturulur
   - Neon/Supabase kullanıyorsanız: Servis sağlayıcınızdan alın

3. **NEXTAUTH_URL**: Production URL (deploy sonrası güncellenecek)
   - Örnek: `https://your-app-name.vercel.app`

### 3. PostgreSQL Veritabanı Kurulumu

#### Seçenek 1: Vercel Postgres (Önerilen)

1. Vercel dashboard'a gidin
2. Projenizi seçin
3. "Storage" sekmesine gidin
4. "Create Database" > "Postgres" seçin
5. Database adını girin ve oluşturun
6. "Create" > "Store" butonuna tıklayın
7. Connection string otomatik olarak `DATABASE_URL` olarak eklenecektir

#### Seçenek 2: Neon (Ücretsiz Tier)

1. [Neon.tech](https://neon.tech) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Connection string'i kopyalayın
4. Vercel dashboard'da `DATABASE_URL` environment variable olarak ekleyin

#### Seçenek 3: Supabase (Ücretsiz Tier)

1. [Supabase.com](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Settings > Database > Connection string'i kopyalayın
4. Vercel dashboard'da `DATABASE_URL` environment variable olarak ekleyin

### 4. Prisma Schema'yı PostgreSQL için Güncelleme

Eğer PostgreSQL kullanacaksanız, `prisma/schema.prisma` dosyasını güncelleyin:

```prisma
datasource db {
  provider = "postgresql"  // "sqlite" yerine
  url      = env("DATABASE_URL")
}
```

Ve migration'ı çalıştırın:
```bash
npx prisma migrate dev --name init_postgres
npx prisma generate
```

## Vercel'e Deploy

### 1. Vercel Hesabı Oluşturma

1. [vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" ile GitHub hesabınızla giriş yapın
3. GitHub'ı authorize edin

### 2. Projeyi İçe Aktarma

1. Vercel dashboard'da "Add New..." > "Project" seçin
2. GitHub repository'nizi seçin
3. "Import" butonuna tıklayın

### 3. Project Settings

1. **Framework Preset:** Next.js (otomatik algılanır)
2. **Root Directory:** `./` (varsayılan)
3. **Build Command:** `npm run build` (varsayılan)
4. **Output Directory:** `.next` (varsayılan)
5. **Install Command:** `npm install` (varsayılan)

### 4. Environment Variables Ekleme

"Environment Variables" bölümüne şunları ekleyin:

```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app-name.vercel.app
DATABASE_URL=your-postgres-connection-string
```

**Önemli:** Production, Preview ve Development için ayrı ayrı ekleyebilirsiniz.

### 5. Deploy

1. "Deploy" butonuna tıklayın
2. Build işlemi tamamlanana kadar bekleyin (1-3 dakika)
3. Deploy başarılı olduğunda URL'i alın

### 6. İlk Migration ve Seed

Deploy sonrası veritabanını hazırlamak için:

1. Vercel dashboard'dan "Deployments" sekmesine gidin
2. En son deployment'a tıklayın
3. "Functions" sekmesinden "View Logs" seçin
4. Ya da local olarak:

```bash
# Production DATABASE_URL'i kullanarak
DATABASE_URL="your-production-connection-string" npx prisma migrate deploy
DATABASE_URL="your-production-connection-string" npm run db:seed
```

**Daha İyi Yöntem:** Vercel CLI kullanın:

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.production
npx prisma migrate deploy
npm run db:seed
```

### 7. NEXTAUTH_URL'i Güncelleme

Deploy tamamlandıktan sonra aldığınız URL'i kullanarak:

1. Vercel dashboard > Project Settings > Environment Variables
2. `NEXTAUTH_URL` değerini güncelleyin: `https://your-actual-url.vercel.app`
3. Yeni bir deployment tetikleyin (Settings > Redeploy)

## Deploy Sonrası Kontroller

1. ✅ Ana sayfa yükleniyor mu?
2. ✅ Login sayfası çalışıyor mu?
3. ✅ Giriş yapılabiliyor mu?
4. ✅ Dashboard yükleniyor mu?
5. ✅ API route'lar çalışıyor mu?
6. ✅ Veritabanı bağlantısı var mı?

## Sorun Giderme

### Build Hatası

- `prisma generate` çalıştığından emin olun
- Environment variables'ın doğru olduğunu kontrol edin
- Build loglarını kontrol edin

### Veritabanı Bağlantı Hatası

- `DATABASE_URL`'in doğru olduğunu kontrol edin
- PostgreSQL provider'ın SSL gerektirip gerektirmediğini kontrol edin
- Connection string formatını kontrol edin

### Authentication Hatası

- `NEXTAUTH_SECRET` ve `NEXTAUTH_URL` değerlerini kontrol edin
- Session cookie'lerin çalıştığından emin olun

### 500 Internal Server Error

- Vercel Functions loglarını kontrol edin
- API route'larındaki hataları kontrol edin
- Environment variables eksik olabilir

## İyi Pratikler

1. ✅ Environment variables'ı production ve development için ayırın
2. ✅ Seed script'i production'da dikkatli kullanın
3. ✅ Database backup'ları düzenli alın
4. ✅ Monitoring ve logging kullanın
5. ✅ SSL sertifikalarının aktif olduğundan emin olun

## Önemli Notlar

⚠️ **SQLite vs PostgreSQL:**
- Local development için SQLite kullanabilirsiniz
- Production için PostgreSQL kullanın (Vercel'de SQLite dosya sistemi kalıcı değil)

⚠️ **Seed Script:**
- Production'da seed çalıştırmadan önce mevcut verileri kontrol edin
- Sadece ilk kurulumda çalıştırın

⚠️ **Environment Variables:**
- `NEXTAUTH_SECRET` production ve development için farklı olmalı
- Hassas bilgileri asla git'e commit etmeyin
