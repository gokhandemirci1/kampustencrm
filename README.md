# Admin Dashboard

Modern bir admin dashboard uygulaması. Next.js 16, TypeScript, Prisma ve NextAuth.js kullanılarak geliştirilmiştir.

## Özellikler

- ✅ Kullanıcı kimlik doğrulama (NextAuth.js)
- ✅ Rol bazlı yetki kontrolü
- ✅ Müşteri yönetimi (CRUD işlemleri)
- ✅ Finansal veriler takibi (günlük, haftalık, aylık, yıllık)
- ✅ İşbirliği kodları yönetimi
- ✅ İşbirliği kodları istatistikleri
- ✅ Kullanıcı erişim yetkisi yönetimi

## Geliştirme

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd dene_admin
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment değişkenlerini ayarlayın:
`.env` dosyası oluşturun:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Veritabanını oluşturun:
```bash
npx prisma migrate dev
npx prisma generate
```

5. İlk kullanıcıları ekleyin:
```bash
npm run db:seed
```

6. Development server'ı başlatın:
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Vercel'e Deploy

### 1. GitHub'a Yükleme

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel'de Proje Oluşturma

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Environment variables ekleyin (aşağıdaki bölüme bakın)

### 3. Environment Variables

Vercel dashboard'da şu environment variables'ları ekleyin:

- `DATABASE_URL`: PostgreSQL veritabanı connection string'i
- `NEXTAUTH_SECRET`: Güvenli bir rastgele string (oluşturmak için: `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Production URL'iniz (örn: `https://your-app.vercel.app`)

### 4. PostgreSQL Veritabanı Kurulumu

Vercel'de SQLite yerine PostgreSQL kullanmanız önerilir:

1. [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) veya [Neon](https://neon.tech), [Supabase](https://supabase.com) gibi bir servis kullanın
2. PostgreSQL connection string'ini alın
3. `DATABASE_URL` environment variable'ına ekleyin

### 5. Veritabanı Migration

Vercel deploy sırasında otomatik olarak migration çalıştırmak için:

`package.json` içinde `postinstall` script'i zaten mevcut. Deploy sonrası seed çalıştırmak için Vercel dashboard'dan "Deployments" > Settings > Environment Variables bölümünden `DATABASE_SEED=true` ekleyebilirsiniz.

**Not:** Production'da seed script'i çalıştırmadan önce mevcut verileri kontrol edin!

## Kullanıcılar

Varsayılan kullanıcılar seed script'i ile oluşturulur:

| E-posta | Şifre | Yetkiler |
|---------|-------|----------|
| gokhan@kampus.com | QWQD$(u~p3 | Tüm yetkiler |
| emre@kampus.com | Fco6hgVch2 | Tüm yetkiler |
| irem-kanbay@kampus.com | E6sD47(X[% | Müşteri Yönetimi |
| emre-unal@kampus.com | TGFFqCaY]K | Finansal Veriler, İşbirliği Kodları |
| gokce-demirci@kampus.com | gK5iU\|KZBw | Erişim Yönetimi |
| burcu-akbas@kampus.com | 2!1q@<y$nf | - |
| bilal-acar@kampus.com | &!wtByzkHG | İşbirliği İstatistikleri |

## Scripts

- `npm run dev` - Development server başlat
- `npm run build` - Production build oluştur
- `npm start` - Production server başlat
- `npm run lint` - ESLint çalıştır
- `npm run db:seed` - Veritabanını seed'le

## Teknolojiler

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM + SQLite (local) / PostgreSQL (production)
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

## Lisans

MIT