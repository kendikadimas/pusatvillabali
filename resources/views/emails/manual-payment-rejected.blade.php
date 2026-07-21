<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Ditolak</title>
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
        /* Header tetap merah untuk konteks penolakan — tapi dengan brand strip hijau di atas */
        .brand-strip {
            background: #15803d;
            padding: 12px 32px;
            text-align: center;
        }
        .brand-strip-inner {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .brand-strip svg {
            width: 24px;
            height: 24px;
            vertical-align: middle;
        }
        .brand-strip span {
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.2px;
        }
        .header {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            padding: 28px 32px 24px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 6px;
            letter-spacing: -0.3px;
        }
        .header p {
            color: #fecaca;
            font-size: 14px;
            margin: 0;
        }
        .badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 20px;
            margin-top: 12px;
            border: 1px solid rgba(255,255,255,0.15);
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
            width: 135px;
        }
        .detail-table td:last-child {
            font-weight: 600;
            color: #1e293b;
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
        .rejection-box {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            border-radius: 12px;
            padding: 16px;
            font-size: 14px;
            color: #991b1b;
            margin-top: 20px;
            line-height: 1.5;
        }
        .rejection-box strong {
            color: #7f1d1d;
        }
        .info-note {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 16px;
            font-size: 13px;
            color: #166534;
            margin-top: 16px;
            line-height: 1.6;
        }
        .info-note strong {
            color: #15803d;
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
            text-decoration: underline;
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
        }
        @media (max-width: 480px) {
            .body { padding: 20px; }
            .header { padding: 22px 20px 20px; }
            .detail-table td:first-child { width: 100px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <!-- Brand strip hijau di atas header merah -->
            <div class="brand-strip">
                <div class="brand-strip-inner">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="96" fill="#166534"/>
                        <polygon points="30,118 170,118 155,98 45,98" fill="#f0fdf4"/>
                        <polygon points="52,98 148,98 136,80 64,80" fill="#dcfce7"/>
                        <polygon points="72,80 128,80 120,65 80,65" fill="#f0fdf4"/>
                        <rect x="72" y="118" width="56" height="36" fill="#f0fdf4"/>
                        <path d="M91,154 L91,134 Q100,126 109,134 L109,154 Z" fill="#15803d"/>
                        <path d="M55,154 Q42,130 30,120" stroke="#86efac" stroke-width="3" stroke-linecap="round" fill="none"/>
                        <path d="M145,154 Q158,130 170,120" stroke="#86efac" stroke-width="3" stroke-linecap="round" fill="none"/>
                    </svg>
                    <span>PusatVillaBali</span>
                </div>
            </div>

            <div class="header">
                <h1>Bukti Pembayaran Perlu Diperbaiki</h1>
                <p>Maaf, bukti transfer yang Anda unggah tidak dapat divalidasi</p>
                <div class="badge">{{ $booking->booking_code }}</div>
            </div>

            <div class="body">
                <div class="greeting">Halo, {{ $booking->guest_name }}!</div>

                <p style="font-size:14px;color:#475569;margin:8px 0 20px">
                    Kami telah memeriksa bukti pembayaran manual yang Anda kirimkan untuk pemesanan villa berikut:
                </p>

                <div class="section-title">Detail Pemesanan</div>
                <table class="detail-table">
                    <tr>
                        <td>Kode Booking</td>
                        <td style="font-family: monospace;">{{ $booking->booking_code }}</td>
                    </tr>
                    <tr>
                        <td>Villa</td>
                        <td style="font-weight: 700; color: #0f172a;">{{ $booking->villa->name }}</td>
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
                        <td>Total Pembayaran</td>
                        <td style="font-weight: 700; color: #dc2626;">Rp {{ number_format((float) $booking->total_amount, 0, ',', '.') }}</td>
                    </tr>
                </table>

                <div class="rejection-box">
                    <strong>Alasan Penolakan:</strong><br>
                    {{ $rejectionReason }}
                </div>

                <div class="info-note">
                    <strong>Langkah selanjutnya:</strong> Silakan klik tombol di bawah untuk masuk ke halaman pembayaran kami, periksa kembali nomor rekening tujuan, transfer jumlah yang sesuai, dan unggah ulang foto bukti transfer yang asli dan jelas.
                </div>

                <div style="text-align:center;margin-top:24px">
                    <a href="{{ config('app.url') }}/booking/payment?code={{ $booking->booking_code }}" class="btn">Kirim Ulang Bukti Bayar</a>
                </div>
            </div>
        </div>

        <div class="footer-text">
            <p style="margin:0 0 4px;font-weight:700;font-size:15px;color:#15803d">PusatVillaBali</p>
            <p style="margin:0 0 4px">Platform persewaan villa premium di Indonesia</p>
            <p style="margin:0">
                <a href="mailto:admin@pusatvillabali.com">admin@pusatvillabali.com</a>
            </p>
            <p style="margin:10px 0 0;font-size:12px;color:#cbd5e1">
                &copy; {{ date('Y') }} PusatVillaBali. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
