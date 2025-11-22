# DATABASE_URL Nedir? - Bu Projede Kullanımı

## 📖 DATABASE_URL Nedir?

`DATABASE_URL`, Prisma ORM'in veritabanına bağlanmak için kullandığı **connection string** (bağlantı dizesi) environment variable'ıdır.

## 🔍 Bu Projede Nerede Kullanılıyor?

### 1. **Prisma Config** (`prisma.config.ts`)

```typescript
const databaseUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy?schema=public";
```

- Prisma, veritabanına bağlanmak için bu değişkeni okur
- Build sırasında (`prisma generate`) kullanılır
- Migration çalıştırırken kullanılır

### 2. **Prisma Client** (`lib/prisma.ts`)

```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

- PrismaClient otomatik olarak `DATABASE_URL` environment variable'ını okur
- Runtime'da veritabanı sorguları yaparken kullanılır
- Tüm API route'larında bu `prisma` instance'ı kullanılır

### 3. **Prisma Schema** (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite"  // Şu anda SQLite kullanıyor
}
```

- Schema dosyasında veritabanı türü belirtilir
- Production'da PostgreSQL kullanılmalı

## 🏠 Local Development (Yerel Geliştirme)

### Şu Anki Durum

Local development için SQLite kullanılıyor:

```
DATABASE_URL="file:./prisma/dev.db"
```

Bu, projenizin kök dizininde `dev.db` adında bir SQLite dosyası oluşturur.

### .env Dosyası

Local development için `.env` dosyası oluşturun:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-local-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 🚀 Production (Vercel'de)

### PostgreSQL Kullanılmalı

Vercel'de SQLite kullanılamaz (dosya sistemi kalıcı değil). Bu yüzden PostgreSQL kullanılmalı.

### DATABASE_URL Formatı

PostgreSQL connection string formatı:

```
postgresql://[kullanıcı]:[şifre]@[host]:[port]/[veritabanı_adı]?[parametreler]
```

### Örnekler

#### Vercel Postgres:
```
postgresql://default.xxxxx@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

#### Neon:
```
postgresql://username:password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

#### Supabase:
```
postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## 📝 Bu Projede Kullanım Yerleri

### 1. Veritabanı Bağlantısı

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()
// PrismaClient otomatik olarak DATABASE_URL'i okur
```

### 2. Kullanıcı İşlemleri

```typescript
// app/api/users/route.ts
const user = await prisma.user.findUnique({
  where: { email: credentials.email }
})
```

### 3. Müşteri İşlemleri

```typescript
// app/api/customers/route.ts
const customers = await prisma.customer.findMany({
  where: { isDeleted: false }
})
```

### 4. İşbirliği Kodları

```typescript
// app/api/collaboration-codes/route.ts
const codes = await prisma.collaborationCode.findMany()
```

### 5. Finansal Veriler

```typescript
// app/dashboard/financial/page.tsx
const customers = await prisma.customer.findMany()
```

## ⚙️ Nasıl Ayarlanır?

### Local Development (.env dosyası)

1. Proje kök dizininde `.env` dosyası oluşturun
2. İçine şunu ekleyin:

```env
DATABASE_URL="file:./prisma/dev.db"
```

3. Veritabanını oluşturun:
```bash
npx prisma migrate dev
npx prisma generate
```

### Production (Vercel)

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Add New** → Key: `DATABASE_URL`, Value: PostgreSQL connection string
3. **Environment:** Production, Preview, Development seçin
4. **Save**

## 🔄 PostgreSQL'e Geçiş (Production İçin)

### Schema'yı Güncelleme

`prisma/schema.prisma` dosyasında:

```prisma
datasource db {
  provider = "postgresql"  // "sqlite" yerine
  url      = env("DATABASE_URL")
}
```

### Migration

```bash
npx prisma migrate dev --name init_postgres
npx prisma generate
```

## ⚠️ Önemli Notlar

1. **Local vs Production:**
   - Local: SQLite (`file:./dev.db`)
   - Production: PostgreSQL (connection string)

2. **Güvenlik:**
   - `.env` dosyasını asla GitHub'a commit etmeyin
   - Production connection string'leri hassas bilgi içerir (şifreler)

3. **Vercel'de:**
   - Environment Variables'da ekleyin
   - `.env` dosyası yüklenmez (güvenlik nedeniyle)

## ✅ Kontrol Listesi

- [ ] Local development için `.env` dosyası var
- [ ] `DATABASE_URL` local için ayarlanmış
- [ ] Vercel'de `DATABASE_URL` environment variable eklendi
- [ ] PostgreSQL veritabanı oluşturuldu
- [ ] Production için schema PostgreSQL'e güncellendi

## 📚 Özet

**DATABASE_URL**, bu projede:
- ✅ Prisma ORM'in veritabanına bağlanması için kullanılır
- ✅ Tüm veritabanı işlemleri için gereklidir
- ✅ Local'de SQLite, Production'da PostgreSQL için farklı formatlar kullanılır
- ✅ Environment variable olarak saklanır (`.env` local, Vercel Settings production)

Başka bir sorunuz varsa sorabilirsiniz! 🚀
