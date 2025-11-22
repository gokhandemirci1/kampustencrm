# Vercel'de DATABASE_URL Environment Variable Ekleme Rehberi

## 🚨 Sorun

Vercel'de deploy sırasında şu hata alınıyor:

```
PrismaConfigEnvError: Missing required environment variable: DATABASE_URL
```

## ✅ Çözüm: Vercel'de Environment Variable Ekleme

### Adım 1: Vercel Dashboard'a Giriş

1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. Projenizi seçin: `kampustencrm`

### Adım 2: Environment Variables Bölümüne Gidin

1. Proje sayfasında **"Settings"** sekmesine tıklayın
2. Soldaki menüden **"Environment Variables"** seçeneğini bulun ve tıklayın

### Adım 3: DATABASE_URL Ekleyin

1. **"Add New"** butonuna tıklayın
2. Şu bilgileri girin:
   - **Key:** `DATABASE_URL`
   - **Value:** PostgreSQL connection string (aşağıdaki seçeneklerden birini kullanın)
   - **Environment:** 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
     - (veya "All Environments" seçin)

### Adım 4: PostgreSQL Veritabanı Oluşturma

#### 🎯 Seçenek 1: Vercel Postgres (En Kolay - Önerilen)

1. Vercel dashboard → Projeniz → **"Storage"** sekmesine gidin
2. **"Create Database"** → **"Postgres"** seçin
3. Database adını girin (örn: `kampustencrm-db`)
4. Region seçin (en yakın bölgeyi seçin)
5. **"Create"** → **"Store"** butonuna tıklayın
6. ✅ **Connection string otomatik olarak `DATABASE_URL` olarak eklenir!**
7. Artık environment variables'da görmelisiniz

#### 🌟 Seçenek 2: Neon (Ücretsiz Tier - Harika Seçenek)

1. [Neon.tech](https://neon.tech) adresine gidin
2. **"Sign Up"** ile GitHub hesabınızla kayıt olun
3. **"Create a project"** butonuna tıklayın
4. Proje ayarları:
   - **Project name:** `kampustencrm`
   - **Region:** En yakın bölge (örn: `Europe (Frankfurt)`)
   - **PostgreSQL version:** `16` (varsayılan)
5. **"Create project"** butonuna tıklayın
6. Connection string'i kopyalayın (görünen sayfada "Connection string" kısmından)
7. Vercel'e geri dönün
8. **"Add New"** → Key: `DATABASE_URL`, Value: kopyaladığınız connection string
9. **"Save"** butonuna tıklayın

**Neon Connection String Örneği:**
```
postgresql://username:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
```

#### 🔥 Seçenek 3: Supabase (Ücretsiz Tier - Popüler)

1. [Supabase.com](https://supabase.com) adresine gidin
2. **"Start your project"** ile GitHub hesabınızla kayıt olun
3. **"New Project"** butonuna tıklayın
4. Proje ayarları:
   - **Name:** `kampustencrm`
   - **Database Password:** Güçlü bir şifre oluşturun (kaydedin!)
   - **Region:** En yakın bölge
5. **"Create new project"** butonuna tıklayın
6. Proje oluşturulduktan sonra:
   - **Settings** (⚙️ ikon) → **Database** sekmesine gidin
   - **Connection string** kısmında **"URI"** seçeneğini bulun
   - Connection string'i kopyalayın
7. Vercel'e geri dönün
8. **"Add New"** → Key: `DATABASE_URL`, Value: kopyaladığınız connection string
9. **"Save"** butonuna tıklayın

**Supabase Connection String Örneği:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Not:** `[YOUR-PASSWORD]` kısmını Supabase'de oluşturduğunuz şifre ile değiştirin!

### Adım 5: Diğer Environment Variables'ları Ekleyin

#### NEXTAUTH_SECRET

1. Güvenli bir secret oluşturun:

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Online:**
- [randomkeygen.com](https://randomkeygen.com) → "CodeIgniter Encryption Keys" kullanın

2. Vercel'de **"Add New"** → Key: `NEXTAUTH_SECRET`, Value: oluşturduğunuz secret
3. **Environment:** Production, Preview, Development
4. **"Save"**

#### NEXTAUTH_URL

1. İlk deploy tamamlandıktan sonra Vercel size bir URL verecek
   - Örnek: `https://kampustencrm.vercel.app`
2. Vercel'de **"Add New"** → Key: `NEXTAUTH_URL`, Value: bu URL
3. **Environment:** Production
4. **"Save"**

**Not:** İlk deploy'da geçici bir değer kullanabilirsiniz, sonra güncellersiniz:
- Geçici: `https://kampustencrm.vercel.app` (veya deploy sonrası gerçek URL)

### Adım 6: Yeni Deployment Tetikleyin

Environment variables ekledikten sonra:

1. **"Deployments"** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. ✅ **"Redeploy"** butonuna tıklayın

Veya otomatik olarak yeni bir commit push ettiğinizde deployment başlar.

## 📋 Kontrol Listesi

- [ ] Vercel dashboard'da projeniz açık
- [ ] Settings → Environment Variables'a gittim
- [ ] `DATABASE_URL` eklendi (PostgreSQL connection string)
- [ ] `NEXTAUTH_SECRET` eklendi (güvenli random string)
- [ ] `NEXTAUTH_URL` eklendi (production URL)
- [ ] Tüm environment variables için "Production" seçildi
- [ ] "Save" butonuna tıklandı
- [ ] Yeni deployment tetiklendi

## 🔍 Hata Devam Ederse

1. **Environment Variables Kontrolü:**
   - Settings → Environment Variables
   - `DATABASE_URL`'in doğru environment'larda (Production/Preview/Development) ekli olduğundan emin olun
   - Variable'ın doğru yazıldığını kontrol edin (büyük/küçük harf önemli!)

2. **Build Loglarını Kontrol:**
   - Deployments → En son deployment → Build Logs
   - Hata mesajlarını kontrol edin

3. **Connection String Formatı:**
   - PostgreSQL connection string formatı doğru mu?
   - SSL gerektiriyorsa `?sslmode=require` parametresi var mı?

4. **Yeniden Deploy:**
   - Settings → Environment Variables
   - Her bir variable'ın yanındaki "..." → "Redeploy" seçeneğini kullanın

## 💡 Önemli Notlar

⚠️ **Connection String Güvenliği:**
- Connection string'ler hassas bilgiler içerir (şifreler, API key'ler)
- Asla GitHub'a commit etmeyin
- `.env` dosyalarını `.gitignore`'da tutun

⚠️ **Database Provider:**
- Local development için SQLite kullanabilirsiniz
- Production'da mutlaka PostgreSQL kullanın
- Vercel'de SQLite dosya sistemi kalıcı değildir

⚠️ **Environment Variables:**
- Production, Preview ve Development için ayrı ayrı ekleyebilirsiniz
- Ya da "All Environments" seçeneğini kullanabilirsiniz

## ✅ Başarı Kontrolü

Environment variables eklendikten sonra:

1. **Build başarılı olmalı** ✅
2. **Deploy tamamlanmalı** ✅
3. **Site çalışır durumda olmalı** ✅

Başarılar! 🚀
