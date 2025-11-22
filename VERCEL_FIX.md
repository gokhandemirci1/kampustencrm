# Vercel Deploy Hatası Düzeltme

## Sorun

Vercel'de deploy sırasında şu hata alınıyor:

```
PrismaConfigEnvError: Missing required environment variable: DATABASE_URL
```

## Çözüm

### 1. Vercel'de Environment Variables Ekleme

Vercel dashboard'da projenize gidin ve şu environment variables'ları ekleyin:

1. **Project Settings** → **Environment Variables** bölümüne gidin
2. Şu değişkenleri ekleyin:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | PostgreSQL connection string | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Güvenli rastgele string | Production, Preview, Development |
| `NEXTAUTH_URL` | Production URL (örn: `https://kampustencrm.vercel.app`) | Production |

### 2. PostgreSQL Veritabanı Oluşturma

#### Seçenek 1: Vercel Postgres (Önerilen)

1. Vercel dashboard → Projeniz → **Storage** sekmesi
2. **Create Database** → **Postgres** seçin
3. Database adını girin ve oluşturun
4. **Create** → **Store** butonuna tıklayın
5. Connection string otomatik olarak `DATABASE_URL` olarak eklenecektir

#### Seçenek 2: Neon (Ücretsiz)

1. [Neon.tech](https://neon.tech) hesabı oluşturun
2. Yeni proje oluşturun
3. Connection string'i kopyalayın
4. Vercel'de `DATABASE_URL` olarak ekleyin

#### Seçenek 3: Supabase (Ücretsiz)

1. [Supabase.com](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Settings → Database → Connection string'i kopyalayın
4. Vercel'de `DATABASE_URL` olarak ekleyin

### 3. NEXTAUTH_SECRET Oluşturma

Güvenli bir secret oluşturun:

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

### 4. NEXTAUTH_URL Ayarlama

Deploy tamamlandıktan sonra aldığınız URL'i kullanın:
- Örnek: `https://kampustencrm.vercel.app`

### 5. Deploy Sonrası Migration

Environment variables eklendikten sonra:

1. Yeni bir deployment tetikleyin (Settings → Redeploy)
2. Ya da Vercel CLI kullanarak:

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.production
npx prisma migrate deploy
```

## Kod Değişiklikleri

Kod tarafında şu değişiklikler yapıldı:

1. **prisma.config.ts**: `DATABASE_URL` için fallback değer eklendi
2. **package.json**: `postinstall` script'i daha esnek hale getirildi

Bu değişiklikler commit edilmeli ve GitHub'a push edilmelidir.

## Kontrol Listesi

- [ ] Vercel'de `DATABASE_URL` environment variable eklendi
- [ ] Vercel'de `NEXTAUTH_SECRET` environment variable eklendi
- [ ] Vercel'de `NEXTAUTH_URL` environment variable eklendi
- [ ] PostgreSQL veritabanı oluşturuldu
- [ ] Kod değişiklikleri commit edildi
- [ ] GitHub'a push edildi
- [ ] Vercel'de yeni deployment tetiklendi
- [ ] Migration çalıştırıldı

## Hala Hata Alıyorsanız

1. Vercel build loglarını kontrol edin
2. Environment variables'ın doğru environment'larda (Production/Preview/Development) eklendiğinden emin olun
3. `DATABASE_URL` formatının doğru olduğundan emin olun (PostgreSQL connection string)
4. Vercel'de "Redeploy" yapın

## Önemli Notlar

⚠️ **SQLite vs PostgreSQL:**
- Local development için SQLite kullanabilirsiniz
- Vercel'de mutlaka PostgreSQL kullanın (SQLite dosya sistemi kalıcı değil)

⚠️ **Environment Variables:**
- Production, Preview ve Development için ayrı ayrı ekleyebilirsiniz
- Ya da "All Environments" seçeneğini kullanabilirsiniz
