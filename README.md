# TATU Smart Scheduler v5 (Firestore)

Bu versiya to‘liq Firestore bazasiga moslangan.

## Asosiy imkoniyatlar
- binolar, fakultetlar, kafedralar, fanlar, ustozlar, guruhlar, xonalar va yuklamalar uchun CRUD
- Firestore orqali cloud saqlash
- avtomatik dars jadvali generatsiyasi
- konflikt nazorati: ustoz, guruh, xona, sig‘im, xona turi, kunlik limit
- jadvalni qo‘lda tahrirlash
- CSV export va print/PDF

## 1. Firebase tayyorlash
Backend uchun `.env` ichiga quyidagilarni yozing:

```env
PORT=8000
JWT_SECRET=super-secret-key
CLIENT_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY
-----END PRIVATE KEY-----
"
```

## 2. Backend
```bash
cd backend
npm install
npm run dev
```

Server ishga tushganda Firestore bo‘sh bo‘lsa demo ma’lumotlar seed qilinadi.

## 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 4. Login
- login: `dilxushbek`
- parol: `2003`

## 5. Eslatma
Oshkor bo‘lib qolgan eski service-account keydan foydalanmang. Firebase Console orqali yangi key yaratib, eskisini o‘chiring.
