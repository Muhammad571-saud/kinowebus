# Kino Streaming Website

Uzbek tilidagi kino streaming veb-sayti. Foydalanuvchilar kino kodini kiritib, real vaqtda kino tomosha qilishlari mumkin.

## Xususiyatlar

- **Kino qidirish**: Foydalanuvchilar kino kodini kiritib qidirishlari mumkin
- **Admin panel**: Kinolarni qo'shish va o'chirish uchun (parol: kinotop007)
- **Real-time streaming**: WebSocket orqali real vaqtda kino uzatish
- **Responsive dizayn**: Mobil va desktop uchun mos
- **Uzbek tili**: Barcha interfeys o'zbek tilida

## Mahalliy ishga tushirish

1. Repozitoriyani klonlang
2. Virtual environment yarating va faollashtiring
3. Kutubxonalarni o'rnating:
   ```bash
   pip install -r requirements.txt
   ```
4. Ilovani ishga tushiring:
   ```bash
   python app.py
   ```
5. Brauzerda `http://localhost:5000` ga kiring

## Render.com da deploy qilish

### 1. GitHub ga yuklash
1. Kodni GitHub ga push qiling
2. Render.com da yangi account yarating

### 2. Render.com da deploy qilish
1. Render.com dashboard ga kiring
2. "New +" tugmasini bosing va "Web Service" ni tanlang
3. GitHub repository ni ulang
4. Quyidagi sozlamalarni kiriting:
   - **Name**: kino-streaming (yoki istalgan nom)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
5. Environment variables qo'shing:
   - `FLASK_ENV`: `production`
   - `SECRET_KEY`: kuchli parol yarating
   - `ADMIN_PASSWORD`: `kinotop007` (yoki o'zgartiring)
6. "Create Web Service" tugmasini bosing

### 3. Environment Variables
Render.com da Environment sozlamalariga kiring va quyidagi o'zgaruvchilarni qo'shing:

```
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here
ADMIN_PASSWORD=kinotop007
```

### 4. Domain
Deploy tugaganidan keyin, Render.com sizga URL beradi (masalan: `https://kino-streaming.onrender.com`)

## Fayl tuzilmasi

```
├── app.py                 # Asosiy Flask ilovasi
├── requirements.txt       # Python kutubxonalari
├── runtime.txt           # Python versiyasi
├── render.yaml           # Render deployment konfiguratsiyasi
├── .env                  # Environment variables (local uchun)
├── templates/            # HTML shablonlar
│   ├── index.html
│   ├── search.html
│   ├── admin.html
│   └── stream.html
├── static/               # CSS va JS fayllar
│   ├── style.css
│   └── script.js
├── images/               # Kino rasmlari
└── movies/               # Kino fayllari (kelajakda)
```

## Admin panel

Admin panelga kirish uchun:
1. Bosh sahifada "Admin Panel" havolasini bosing
2. Parolni kiriting: `kinotop007`
3. Kinolarni qo'shish yoki o'chirish mumkin

## API Endpoints

- `GET /api/movies` - Barcha kinolarni olish
- `POST /api/movies` - Yangi kino qo'shish
- `DELETE /api/movies/<code>` - Kinoni o'chirish
- `POST /api/auth` - Admin autentifikatsiyasi

## Texnologiyalar

- **Backend**: Flask, Flask-SocketIO
- **Frontend**: HTML, CSS, JavaScript
- **Real-time**: WebSocket
- **Deployment**: Render.com

## Muallif

Bu loyihani yaratgan: [Sizning ismingiz]

## Litsenziya

Bu loyiha MIT litsenziyasi ostida.