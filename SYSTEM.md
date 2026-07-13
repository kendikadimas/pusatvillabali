# Dokumentasi Sistem PusatVillaID

**Stack:** Laravel 13 + Inertia.js v3 + React 19 (TSX) + MySQL
**Tanggal:** 13 Juli 2026

---

## ALUR CUSTOMER

### 1. Discover Villa
- Buka pusatvillaid.com, halaman home menampilkan villa terbaru dan destinasi populer
- Filter/search villa berdasarkan lokasi, jumlah kamar, tamu, harga, sorting
- Klik villa untuk melihat halaman detail: gallery foto, fasilitas, kalender ketersediaan, ulasan tamu, info host

### 2. Booking
- Di halaman detail villa, pilih tanggal check-in/check-out dan jumlah tamu
- Klik Pesan Sekarang, redirect ke /booking/confirm
- Isi form: nama, email, telepon, catatan
- Upload foto KTP (wajib)
- Pilih metode pembayaran (bank transfer, e-wallet, dll)
- Lihat rincian harga: base price weekday/weekend, pajak, admin fee, total
- Submit booking, status: pending/unpaid
- Redirect ke /booking/payment

### 3. Pembayaran Manual (Bank Transfer)
- Halaman payment menampilkan instruksi transfer: nama bank, nomor rekening, nama penerima
- Batas waktu pembayaran 24 jam sejak booking dibuat
- Customer upload foto bukti transfer
- Status booking berubah ke pending/pending (menunggu verifikasi admin)
- Redirect ke /booking/status

### 4. Tracking Status
- Halaman /booking/status menampilkan status booking real-time
- Bisa dicek dengan kode booking + email (tanpa login)
- Status yang mungkin:
  - pending/unpaid: belum upload bukti
  - pending/pending: bukti terupload, menunggu admin
  - confirmed/paid: admin sudah approve, booking dikonfirmasi
  - cancelled/expired: tidak bayar dalam 24 jam (auto-expire)
  - cancelled/unpaid: ditolak admin atau dibatalkan

### 5. Konfirmasi
- Admin approve pembayaran, status jadi confirmed/paid
- Customer terima email konfirmasi berisi detail check-in, lokasi, kontak host
- Halaman /booking/success tampil ringkasan lengkap
- Customer bisa download invoice PDF

### 6. Pasca Menginap
- Admin bisa kirim link review via email (token 64-char, berlaku 30 hari)
- Customer buka /review?token=xxx, isi rating bintang + komentar
- Review masuk ke sistem, menunggu moderasi admin
- Setelah diapprove, review tampil di halaman detail villa

### 7. Akun Customer (Opsional)
- Daftar/login untuk menyimpan history booking di /profile
- Login via email+password atau Google OAuth
- Support 2FA (TOTP), passkeys, verifikasi email
- Dashboard profil: lihat semua booking, status, download invoice

### 8. Wishlist
- Villa bisa disimpan ke wishlist tanpa perlu login (localStorage)
- Halaman /wishlist menampilkan villa yang disimpan

---

## ALUR ADMIN

### 1. Login
- Akses /admin/login, masukkan email + password
- Inactivity timeout otomatis logout jika tidak aktif
- Support 2FA

### 2. Dashboard
- Statistik: check-in hari ini, booking bulan ini, revenue bulan ini, pending payment, pending review
- Daftar tamu check-in dan check-out hari ini
- 10 booking terbaru

### 3. Manajemen Booking
- List semua booking dengan filter status, villa, tanggal
- Detail booking: data tamu, foto KTP, bukti pembayaran, detail villa
- Approve pembayaran: status jadi confirmed/paid, email konfirmasi otomatis terkirim
- Reject pembayaran: status kembali unpaid, tamu perlu upload ulang
- Update status manual: confirmed, completed, cancelled
- Resend email konfirmasi
- Hapus booking

### 4. Manajemen Villa
- CRUD villa: nama, lokasi, deskripsi, harga weekday/weekend, kapasitas, fasilitas
- Upload multiple foto dengan kategori dan deskripsi
- Upload avatar host
- Aktif/nonaktifkan villa
- Info host: nama, tahun pengalaman, about
- Konfigurasi: min nights, cancellation policy, safety info, neighborhood
- Blocked dates: blokir tanggal untuk maintenance
  - Sistem cek otomatis apakah tanggal sudah ada booking aktif sebelum blokir
- Kalender visual ketersediaan

### 5. Manajemen Review
- List semua review dengan status pending/approved
- Approve review: tampil di halaman villa publik
- Reject/hapus review
- Edit review atau buat review manual
- Upload avatar reviewer

### 6. Manajemen Destinasi
- CRUD destinasi (Seminyak, Canggu, Ubud, dll)
- Upload gambar destinasi
- Villa di-assign ke destinasi

### 7. Manajemen Metode Pembayaran
- CRUD metode pembayaran: nama, kode, nomor rekening, instruksi, logo
- Set admin fee per metode
- Aktif/nonaktifkan
- Atur urutan tampil

### 8. Analytics
- Grafik booking dan revenue per periode
- Filter by tanggal
- Export CSV/Excel

### 9. Settings
- Nama properti, WhatsApp, email, alamat
- Tax percentage (diterapkan ke setiap booking)
- Logo

### 10. Admin User Management (Super Admin only)
- CRUD sub-akun admin
- 13 permission granular:
  - bookings.view, bookings.manage
  - villas.view, villas.manage
  - reviews.view, reviews.manage
  - destinations.view, destinations.manage
  - payment_methods.view, payment_methods.manage
  - analytics.view
  - settings.view, settings.manage
- Lihat dan revoke sesi aktif sub-admin
- Super admin tidak terbatas oleh permission

---

## OTOMASI BACKGROUND

| Command | Interval | Fungsi |
|---|---|---|
| bookings:expire-pending --hours=24 | Setiap 5 menit | Auto-cancel booking unpaid lebih dari 24 jam, bebaskan tanggal villa |

---

## KALKULASI HARGA

Harga dihitung per malam berdasarkan hari:
- Senin-Kamis dan Minggu: price_per_night (weekday)
- Jumat-Sabtu: weekend_price (jika diset, fallback ke weekday)
- Pajak: tax_percentage dari Settings (diterapkan ke subtotal)
- Admin fee: admin_fee dari metode pembayaran yang dipilih
- Total = subtotal + pajak + admin fee

---

## STATUS BOOKING

| Status | Payment Status | Kondisi |
|---|---|---|
| pending | unpaid | Baru dibuat, belum ada bukti |
| pending | pending | Bukti terupload, menunggu admin |
| confirmed | paid | Admin approve |
| completed | paid | Tamu sudah checkout |
| cancelled | expired | Auto-expire 24 jam tidak bayar |
| cancelled | unpaid | Rejected admin atau cancel manual |

---

## KALKULASI HARGA BOOKING

Proses kalkulasi di backend (BookingController):
1. Loop setiap malam antara check-in dan check-out
2. Jumat dan Sabtu = weekend_price, sisanya = price_per_night
3. Hitung tax: (tax_percentage / 100) * subtotal
4. Tambah admin_fee dari payment method
5. Total = subtotal + tax + admin_fee
