# Arxitektura

## Backend

Express + TypeScript.

### Modullar
- auth: demo admin login
- masterdata: CRUD va saqlash
- scheduling: avtomatik jadval generatsiyasi
- lib/store: JSON storage

## Frontend

React + Vite + Tailwind.

### Asosiy sahifalar
- DashboardPage
- SchedulePage
- FacultiesPage
- DepartmentsPage
- SubjectsPage
- TeachersPage
- GroupsPage
- RoomsPage
- LoadsPage

## Jadval generatori logikasi

Generator quyidagi ketma-ketlikda ishlaydi:
1. Yuklamalarni guruh hajmi va haftalik darslar soni bo‘yicha saralaydi.
2. Har bir yuklama uchun mos timeslot qidiradi.
3. Ustoz, guruh va xona bandligini tekshiradi.
4. Xona turi va sig‘imini baholaydi.
5. Afzal bino bo‘lsa, unga yuqori ball beradi.
6. Eng yaxshi score olgan variantni jadvalga joylaydi.
7. Joylashmagan yuklamalarni konflikt sifatida qaytaradi.

## Saqlash

Hozirgi versiyada ma’lumotlar `backend/data/store.json` faylida saqlanadi.
