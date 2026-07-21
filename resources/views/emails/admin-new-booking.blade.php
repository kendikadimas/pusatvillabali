<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Baru Masuk</title>
    <style>
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0fdf4;
            color: #1e293b;
        }
        .wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px 16px;
        }
        .card {
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
            border: 1px solid #dcfce7;
        }
        .header {
            background: linear-gradient(135deg, #166534, #14532d);
            padding: 36px 32px 28px;
            text-align: center;
        }
        .logo {
            display: block;
            margin: 0 auto 16px;
            width: 56px;
            height: 56px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 6px;
            letter-spacing: -0.3px;
        }
        .header p {
            color: #bbf7d0;
            font-size: 14px;
            margin: 0;
        }
        .badge {
            display: inline-block;
            background: rgba(255,255,255,0.15);
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 20px;
            margin-top: 12px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .body {
            padding: 32px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #0f172a;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-table tr {
            border-bottom: 1px solid #f1f5f9;
        }
        .detail-table td {
            padding: 12px 0;
            font-size: 14px;
            vertical-align: top;
        }
        .detail-table td:first-child {
            color: #64748b;
            width: 140px;
        }
        .detail-table td:last-child {
            font-weight: 600;
            color: #1e293b;
        }
        .price-row td {
            padding-top: 16px;
            border-bottom: none;
        }
        .price-row td:last-child {
            font-size: 18px;
            font-weight: 700;
            color: #15803d;
        }
        .villa-name {
            font-weight: 700;
            color: #0f172a;
        }
        .status-badge {
            display: inline-block;
            background: #fef3c7;
            color: #d97706;
            font-size: 12px;
            font-weight: 700;
            padding: 3px 12px;
            border-radius: 20px;
        }
        .section-title {
            font-size: 13px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 24px 0 12px;
            padding-top: 16px;
            border-top: 2px solid #f1f5f9;
        }
        .footer-text {
            text-align: center;
            padding: 24px 32px 32px;
            font-size: 13px;
            color: #94a3b8;
            line-height: 1.6;
        }
        .footer-text a {
            color: #15803d;
            text-decoration: none;
        }
        .btn {
            display: inline-block;
            background: #15803d;
            color: #ffffff !important;
            font-size: 14px;
            font-weight: 700;
            padding: 12px 28px;
            border-radius: 40px;
            text-decoration: none;
            margin: 16px 0 8px;
            text-align: center;
        }
        .btn-wa {
            display: inline-block;
            background: #15803d;
            color: #ffffff !important;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 4px;
        }
        .notes-box {
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px;
            font-size: 13px;
            color: #475569;
            margin-top: 12px;
            line-height: 1.5;
            border: 1px dashed #cbd5e1;
        }
        @media (max-width: 480px) {
            .body { padding: 20px; }
            .header { padding: 28px 20px 24px; }
            .detail-table td:first-child { width: 110px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <!-- Logo SVG inline — villa joglo PusatVillaBali -->
                <svg class="logo" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="96" fill="#14532d"/>
                    <polygon points="30,118 170,118 155,98 45,98" fill="#f0fdf4"/>
                    <polygon points="52,98 148,98 136,80 64,80" fill="#dcfce7"/>
                    <polygon points="72,80 128,80 120,65 80,65" fill="#f0fdf4"/>
                    <line x1="80" y1="65" x2="120" y2="65" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>
                    <rect x="72" y="118" width="56" height="36" fill="#f0fdf4"/>
                    <path d="M91,154 L91,134 Q100,126 109,134 L109,154 Z" fill="#15803d"/>
                    <rect x="77" y="123" width="10" height="10" rx="1" fill="#15803d" opacity="0.5"/>
                    <rect x="113" y="123" width="10" height="10" rx="1" fill="#15803d" opacity="0.5"/>
                    <line x1="55" y1="154" x2="145" y2="154" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
                    <path d="M55,154 Q42,130 30,120" stroke="#86efac" stroke-width="3" stroke-linecap="round" fill="none"/>
                    <path d="M55,154 Q38,138 28,138" stroke="#86efac" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                    <path d="M55,154 Q40,150 30,155" stroke="#86efac" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <path d="M145,154 Q158,130 170,120" stroke="#86efac" stroke-width="3" stroke-linecap="round" fill="none"/>
                    <path d="M145,154 Q162,138 172,138" stroke="#86efac" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                    <path d="M145,154 Q160,150 170,155" stroke="#86efac" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <circle cx="100" cy="44" r="5" fill="#86efac"/>
                    <line x1="100" y1="34" x2="100" y2="32" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
                    <line x1="100" y1="54" x2="100" y2="56" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
                    <line x1="90" y1="44" x2="88" y2="44" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
                    <line x1="110" y1="44" x2="112" y2="44" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h1>Booking Baru Masuk</h1>
                <p>Reservasi baru telah dibuat di sistem</p>
                <div class="badge">{{ $booking->booking_code }}</div>
            </div>

            <div class="body">
                <div class="greeting">Halo Admin,</div>
                <p style="font-size:14px;color:#475569;margin:8px 0 20px">
                    Sistem telah menerima reservasi baru. Segera periksa detail reservasi di bawah ini untuk persiapan atau verifikasi pembayaran:
                </p>

                <div class="section-title">Detail Reservasi</div>
                <table class="detail-table">
                    <tr>
                        <td>Kode Booking</td>
                        <td style="font-family: monospace;">{{ $booking->booking_code }}</td>
                    </tr>
                    <tr>
                        <td>Villa</td>
                        <td class="villa-name">{{ $booking->villa->name }}</td>
                    </tr>
                    <tr>
                        <td>Check-in</td>
                        <td>{{ \Carbon\Carbon::parse($booking->check_in)->isoFormat('dddd, D MMMM YYYY') }}</td>
                    </tr>
                    <tr>
                        <td>Check-out</td>
                        <td>{{ \Carbon\Carbon::parse($booking->check_out)->isoFormat('dddd, D MMMM YYYY') }}</td>
                    </tr>
                    <tr>
                        <td>Durasi</td>
                        <td>{{ $booking->total_nights }} malam</td>
                    </tr>
                    <tr>
                        <td>Tamu</td>
                        <td>{{ $booking->num_guests }} orang</td>
                    </tr>
                    <tr>
                        <td>Status Booking</td>
                        <td><span class="status-badge">{{ ucfirst($booking->status) }}</span></td>
                    </tr>
                    <tr class="price-row">
                        <td>Total Pembayaran</td>
                        <td>Rp {{ number_format((float) $booking->total_amount, 0, ',', '.') }}</td>
                    </tr>
                </table>

                <div class="section-title">Detail Pelanggan</div>
                <table class="detail-table">
                    <tr>
                        <td>Nama Lengkap</td>
                        <td>{{ $booking->guest_name }}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><a href="mailto:{{ $booking->guest_email }}" style="color:#15803d;text-decoration:none;">{{ $booking->guest_email }}</a></td>
                    </tr>
                    <tr>
                        <td>No. Handphone</td>
                        <td>
                            {{ $booking->guest_phone }}
                            @php
                                $whatsappPhone = preg_replace('/[^0-9]/', '', $booking->guest_phone);
                                if (str_starts_with($whatsappPhone, '0')) {
                                    $whatsappPhone = '62' . substr($whatsappPhone, 1);
                                }
                            @endphp
                            <br/>
                            <a href="https://wa.me/{{ $whatsappPhone }}" target="_blank" class="btn-wa">
                                Hubungi via WhatsApp
                            </a>
                        </td>
                    </tr>
                </table>

                @if(!empty($booking->notes))
                <div class="section-title">Catatan Tambahan</div>
                <div class="notes-box">
                    {!! nl2br(e($booking->notes)) !!}
                </div>
                @endif

                @if(!empty($booking->utm_source) || !empty($booking->utm_medium) || !empty($booking->utm_campaign))
                <div class="section-title">Informasi UTM (Marketing)</div>
                <table class="detail-table">
                    @if(!empty($booking->utm_source))
                    <tr>
                        <td>UTM Source</td>
                        <td>{{ $booking->utm_source }}</td>
                    </tr>
                    @endif
                    @if(!empty($booking->utm_medium))
                    <tr>
                        <td>UTM Medium</td>
                        <td>{{ $booking->utm_medium }}</td>
                    </tr>
                    @endif
                    @if(!empty($booking->utm_campaign))
                    <tr>
                        <td>UTM Campaign</td>
                        <td>{{ $booking->utm_campaign }}</td>
                    </tr>
                    @endif
                </table>
                @endif

                <div style="text-align:center;margin-top:28px">
                    <a href="{{ config('app.frontend_url') }}/admin/bookings/detail?id={{ $booking->id }}" class="btn">
                        Buka Halaman Admin Booking
                    </a>
                </div>
            </div>
        </div>

        <div class="footer-text">
            <p style="margin:0 0 4px;font-weight:700;font-size:15px;color:#15803d">PusatVillaBali</p>
            <p style="margin:0 0 4px">Notifikasi Sistem Otomatis &middot; PusatVillaBali</p>
            <p style="margin:10px 0 0;font-size:12px;color:#cbd5e1">
                &copy; {{ date('Y') }} PusatVillaBali. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
