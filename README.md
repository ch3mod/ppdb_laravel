# PPDB SDN Pangauban 02

Sistem Penerimaan Peserta Didik Baru SDN Pangauban 02 berbasis Laravel, Inertia.js, React, dan Tailwind CSS.

## Kebutuhan Sistem

- PHP 8.3 atau lebih baru
- Composer
- Node.js 20 atau lebih baru
- MySQL atau MariaDB
- Git

## Clone Project

```bash
git clone https://github.com/ch3mod/ppdb_laravel.git
cd ppdb_laravel
```

## Instalasi

### 1. Install dependency PHP

```bash
composer install
```

### 2. Install dependency frontend

```bash
npm install
```

### 3. Buat file environment

Windows CMD:

```bat
copy .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Atur koneksi database di `.env`:

```env
DB_DATABASE=ppdb
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate application key

```bash
php artisan key:generate
```

### 5. Buat database

Buat database kosong bernama `ppdb` di MySQL/MariaDB, lalu jalankan:

```bash
php artisan migrate
```

Migration akan membuat tabel aplikasi dan data awal ekstrakurikuler.

### 6. Siapkan folder Laravel

```bash
php artisan optimize:clear
php artisan storage:link
```

Jika Windows menampilkan error folder session, buat folder berikut:

```bat
mkdir storage\framework\sessions
mkdir storage\framework\views
mkdir storage\framework\cache
```

Berikan izin tulis jika diperlukan:

```bat
icacls storage /grant "Everyone:(OI)(CI)F" /T
icacls bootstrap\cache /grant "Everyone:(OI)(CI)F" /T
```

### 7. Build frontend

```bash
npm run build
```

## Menjalankan Project

Terminal pertama:

```bash
php artisan serve
```

Buka:

```text
http://127.0.0.1:8000
```

Saat development frontend, gunakan terminal kedua:

```bash
npm run dev
```

## Login Admin

Buat user admin menggunakan Tinker atau seeder sesuai kebutuhan aplikasi:

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
]);
```

Login melalui halaman login aplikasi menggunakan email dan password tersebut.

## Fitur Utama

- Form pendaftaran PPDB
- Cek status pendaftaran
- Dashboard admin
- Manajemen data pendaftar
- Cetak formulir, kartu, dan surat
- Program PIP dan UPZ Baznas
- Manajemen ekstrakurikuler
- Upload galeri foto ekstrakurikuler
- Galeri ekstrakurikuler dengan filter dan lightbox
- Pengaturan PPDB

## Manajemen Ekstrakurikuler

Buka menu admin:

```text
/dashboard/ekstrakurikuler
```

Admin dapat:

- Menambah ekstrakurikuler
- Mengubah nama dan deskripsi
- Mengatur ikon, warna, dan urutan
- Upload beberapa foto sekaligus
- Menghapus foto galeri
- Menghapus ekstrakurikuler

Foto disimpan pada:

```text
storage/app/public/gallery/extracurriculars
```

Pastikan `php artisan storage:link` sudah dijalankan agar foto tampil di browser.

## Periode Pendaftaran

Periode yang tampil pada landing page:

```text
1 Juni - 30 Juni 2026
```

## Pemeriksaan Kode

TypeScript:

```bash
./node_modules/.bin/tsc --noEmit --skipLibCheck --pretty false
```

PHP lint:

```bash
php -l app/Http/Controllers/ExtracurricularController.php
php -l routes/web.php
```

## Troubleshooting

### Error session `Failed to open stream`

Jalankan:

```bash
php artisan optimize:clear
mkdir storage\framework\sessions
icacls storage /grant "Everyone:(OI)(CI)F" /T
```

### Foto upload tidak tampil

Jalankan:

```bash
php artisan storage:link
```

Lalu pastikan foto berada di `storage/app/public/gallery/extracurriculars`.

### Database tidak tersambung

Periksa nilai `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` pada `.env`, lalu jalankan:

```bash
php artisan optimize:clear
php artisan migrate
```

## Catatan Keamanan

Jangan commit file berikut:

- `.env`
- Password database
- API key
- File upload pribadi
- Folder `vendor` dan `node_modules`
