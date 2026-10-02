# Teknologi yang Digunakan — PPDB SDN Pangauban 02

Dokumen ini merangkum teknologi pembangun Sistem Penerimaan Peserta Didik Baru
(PPDB) SDN Pangauban 02. Disusun untuk penyesuaian isi skripsi.

## 1. Arsitektur Sistem

- Aplikasi web monolit: backend dan frontend dalam satu codebase Laravel.
- Pola MVC (Model–View–Controller) pada sisi backend Laravel.
- Frontend Single Page Application (SPA) menggunakan React yang dijembatani
  Inertia.js (tanpa REST API terpisah untuk halaman utama).
- Build tool: Vite (development server + bundling production).

## 2. Backend

| Teknologi | Versi | Fungsi |
|---|---|---|
| PHP | 8.3 | Bahasa pemrograman backend |
| Laravel Framework | 12.69 | Framework backend (routing, ORM Eloquent, migration, middleware, validasi) |
| Inertia.js (Laravel adapter) | 2.x | Penghubung Laravel dan React (server-side routing + props) |
| Laravel Fortify | 1.x | Autentikasi admin (login, proteksi route dashboard) |
| MySQL / MariaDB | — | Basis data relasional (tabel peserta, kwitansi, ekstrakurikuler, pengaturan) |
| Eloquent ORM | bawaan Laravel 12 | Pemetaan tabel ke model PHP |
| Laravel Migration | bawaan Laravel 12 | Versioning skema database |
| barryvdh/laravel-dompdf | 3.x | Cetak dokumen PDF (formulir, kartu, surat, kwitansi) |
| maatwebsite/excel | 3.x | Export data ke Excel |
| tightenco/ziggy | 2.x | Ekspos route Laravel ke JavaScript (`route()` di React) |
| Guzzle HTTP | 7.x | HTTP client PHP |
| fakerphp/faker | 1.x | Data dummy untuk testing/seeder |

## 3. Frontend

| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 19 | Library UI (komponen halaman dan form) |
| React DOM | 19 | Rendering React ke browser |
| @inertiajs/react | 2.x | Client Inertia (navigasi SPA, form, shared props) |
| TypeScript | 5.x | Static typing untuk kode JavaScript/React |
| Vite | 8 | Build tool dan dev server frontend |
| @vitejs/plugin-react | 5.x | Plugin React untuk Vite |
| laravel-vite-plugin | 3.x | Integrasi Vite dengan Laravel (Blade + refresh) |
| Tailwind CSS | 4.x | Framework CSS utility-first untuk styling |
| @tailwindcss/vite | 4.x | Plugin Tailwind untuk Vite |
| Radix UI (accordion, dialog, select, dsb.) | 1.x–2.x | Komponen UI aksesibel (basis shadcn/ui, 54 komponen di `resources/js/components/ui`) |
| lucide-react | 0.562 | Ikon SVG |
| GSAP + ScrollTrigger | 3.x | Animasi landing page |
| Recharts | 2.x | Grafik dashboard admin |
| TanStack React Table | 8.x | Tabel data admin (pagination, kolom dinamis) |
| React Hook Form + Zod + resolvers | 7.x / 4.x | Manajemen dan validasi form |
| Sonner | 2.x | Notifikasi toast |
| canvas-confetti | 1.x | Animasi konfeti halaman sukses pendaftaran |
| next-themes | 0.x | Dark/light mode |
| date-fns | 4.x | Format tanggal |

## 4. Basis Data

- RDBMS: MySQL/MariaDB (konfigurasi `DB_*` pada `.env`).
- Tabel utama: `peserta_ppdb`, `kwitansis`, `extracurriculars`,
  `extracurricular_photos`, `ppdb_settings`, `ukuran_seragams`, `users`.
- Relasi contoh: peserta → banyak kwitansi; ekstrakurikuler → banyak foto.
- Migrasi berada di `database/migrations`.

## 5. Tools Pendukung dan Testing

| Teknologi | Fungsi |
|---|---|
| Composer | Dependency manager PHP |
| NPM | Dependency manager JavaScript |
| Git + GitHub | Version control (`https://github.com/ch3mod/ppdb_laravel.git`) |
| PHPUnit 11 | Testing backend (`tests/Feature`, `tests/Unit`) |
| Laravel Boost / Pint | Standar dan kerapian kode |
| Artisan CLI | Perintah `migrate`, `storage:link`, `serve`, `tinker` |

## 6. Alur Data Singkat (untuk Bab Implementasi Skripsi)

1. Pengguna membuka landing page (`/`, Inertia `Landing`).
2. Form pendaftaran (`/register`) mengirim data ke controller Laravel.
3. Validasi di Form Request, lalu disimpan via Eloquent ke MySQL.
4. Admin login (Fortify) dan mengelola data di `/dashboard`.
5. Dokumen dicetak ke PDF (dompdf); rekap diekspor ke Excel.
6. Galeri ekstrakurikuler diupload admin, disimpan di
   `storage/app/public/gallery/extracurriculars`, ditampilkan di landing
   dengan filter kategori dan lightbox.

## 7. Kebutuhan Menjalankan Sistem

- PHP 8.2+ (teruji di 8.3), Composer, Node.js 20+, MySQL/MariaDB, Git.
- Langkah ringkas: `composer install` → `npm install` → salin `.env` →
  `php artisan key:generate` → `php artisan migrate` →
  `php artisan storage:link` → `npm run build` → `php artisan serve`.
- Detail lengkap ada pada `README.md`.
