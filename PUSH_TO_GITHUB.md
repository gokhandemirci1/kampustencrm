# GitHub'a Push Etme Rehberi

## ✅ Hazırlık Tamamlandı!

Projeniz GitHub'a push etmeye hazır. Şu adımları takip edin:

## 1️⃣ GitHub'da Repository Oluşturma

1. [GitHub.com](https://github.com) adresine gidin ve giriş yapın
2. Sağ üstteki **"+"** butonuna tıklayın
3. **"New repository"** seçin
4. Repository ayarları:
   - **Repository name:** `dene_admin` (veya istediğiniz isim)
   - **Description:** `Admin Dashboard - Next.js + TypeScript + Prisma`
   - **Visibility:** Public veya Private seçin
   - ⚠️ **ÖNEMLİ:** "Initialize this repository with a README" seçeneğini **İŞARETLEMEYİN** (zaten kod var)
5. **"Create repository"** butonuna tıklayın

## 2️⃣ GitHub'a Push Etme

GitHub repository'nizi oluşturduktan sonra, size gösterilen URL'i kullanın. Şu komutları çalıştırın:

### Windows PowerShell için:

```powershell
# GitHub repository URL'ini ekle (URL'i GitHub'dan kopyalayın)
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADI.git

# Branch'i main olarak değiştir (GitHub varsayılan branch)
git branch -M main

# GitHub'a push et
git push -u origin main
```

### Örnek:

```powershell
git remote add origin https://github.com/gokhan/dene_admin.git
git branch -M main
git push -u origin main
```

## 3️⃣ Authentication

Eğer ilk defa push ediyorsanız, GitHub kimlik doğrulaması isteyebilir:

### Yöntem 1: Personal Access Token (Önerilen)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. **Note:** `dene_admin_push` gibi bir isim verin
4. **Expiration:** İstediğiniz süreyi seçin
5. **Scopes:** `repo` işaretleyin
6. "Generate token" butonuna tıklayın
7. Token'ı kopyalayın (bir daha gösterilmeyecek!)
8. Push yaparken şifre yerine bu token'ı kullanın

### Yöntem 2: GitHub CLI

```powershell
# GitHub CLI kurulumu (opsiyonel)
winget install --id GitHub.cli

# Login
gh auth login

# Push
git push -u origin main
```

### Yöntem 3: SSH Key

Daha güvenli ve uzun vadeli çözüm:

```powershell
# SSH key oluştur (eğer yoksa)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Public key'i kopyala
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH and GPG keys → New SSH key
# Public key'i yapıştır ve kaydet

# Remote URL'i SSH'a çevir
git remote set-url origin git@github.com:KULLANICI_ADINIZ/REPO_ADI.git

# Push
git push -u origin main
```

## 4️⃣ Kontrol

Push işlemi başarılı olduktan sonra:

1. GitHub repository sayfanızı yenileyin
2. Tüm dosyaların göründüğünü kontrol edin
3. ✅ `package.json` var mı?
4. ✅ `app/` klasörü var mı?
5. ✅ `prisma/` klasörü var mı?
6. ✅ `README.md` var mı?
7. ❌ `node_modules/` olmamalı
8. ❌ `.env` olmamalı
9. ❌ `dev.db` olmamalı

## 5️⃣ Sonraki Adımlar - Vercel'e Deploy

GitHub'a başarıyla push ettikten sonra:

1. [Vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. "Add New..." → "Project"
4. Repository'nizi seçin → "Import"
5. Environment Variables ekleyin (DEPLOY.md'ye bakın)
6. Deploy!

## ⚠️ Sorun Giderme

### "remote origin already exists" hatası

```powershell
# Mevcut remote'u sil
git remote remove origin

# Yeni remote ekle
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADI.git
```

### "Permission denied" hatası

- GitHub kimlik doğrulaması yapmadınız
- Personal Access Token kullanın veya SSH key ekleyin

### "branch 'main' has no upstream branch" hatası

```powershell
git push -u origin main
```

### "fatal: refusing to merge unrelated histories" hatası

GitHub'da README oluşturduysanız:

```powershell
git pull origin main --allow-unrelated-histories
# Çakışmaları çöz
git push -u origin main
```

## 📋 Hızlı Komut Özeti

```powershell
# 1. Remote ekle
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADI.git

# 2. Branch'i main yap
git branch -M main

# 3. Push et
git push -u origin main
```

## ✅ Başarı Kontrol Listesi

- [ ] GitHub'da repository oluşturdum
- [ ] `git remote add origin` komutunu çalıştırdım
- [ ] `git branch -M main` komutunu çalıştırdım
- [ ] `git push -u origin main` komutunu çalıştırdım
- [ ] GitHub'da tüm dosyaları görüyorum
- [ ] `package.json` var
- [ ] `node_modules/` YOK
- [ ] `.env` YOK
- [ ] `dev.db` YOK

Başarılar! 🚀
