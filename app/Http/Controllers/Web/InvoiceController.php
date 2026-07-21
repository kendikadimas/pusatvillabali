<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceController extends Controller
{
    public function download(Request $request, string $code): Response
    {
        $booking = Booking::where('booking_code', $code)
            ->with(['villa', 'paymentMethod'])
            ->first();

        abort_if(! $booking, 404);

        $settings = Setting::pluck('value', 'key')->toArray();
        $appName = $settings['settings_prop_name'] ?? 'PusatVillaBali';
        $appEmail = $settings['settings_email'] ?? '';
        $appWhatsapp = $settings['settings_whatsapp'] ?? '';

        $checkIn = Carbon::parse($booking->check_in)->locale('id')->isoFormat('D MMMM YYYY');
        $checkOut = Carbon::parse($booking->check_out)->locale('id')->isoFormat('D MMMM YYYY');

        $formatRp = fn ($val) => 'Rp '.number_format((float) $val, 0, ',', '.');

        $html = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Invoice #{$booking->booking_code}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .brand { font-size: 22px; font-weight: 800; color: #15803d; letter-spacing: -0.5px; }
  .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
  .invoice-label { text-align: right; }
  .invoice-label h1 { font-size: 28px; font-weight: 900; color: #1e293b; letter-spacing: -1px; }
  .invoice-label .code { font-size: 12px; color: #64748b; margin-top: 2px; font-family: monospace; }
  .invoice-label .date { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .divider { border: none; border-top: 1.5px solid #e2e8f0; margin: 24px 0; }
  .section-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
  .info-item label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 3px; }
  .info-item span { font-weight: 600; color: #1e293b; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { background: #f8fafc; padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1.5px solid #e2e8f0; }
  tbody td { padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
  tbody tr:last-child td { border-bottom: none; }
  .text-right { text-align: right; }
  .total-row td { font-weight: 700; font-size: 14px; background: #f0fdf4; color: #15803d; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .status-pending { background: #fef3c7; color: #d97706; }
  .status-confirmed { background: #dcfce7; color: #16a34a; }
  .status-cancelled { background: #fee2e2; color: #dc2626; }
  .status-completed { background: #dbeafe; color: #2563eb; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-note { font-size: 11px; color: #94a3b8; line-height: 1.6; }
  .footer-contact { text-align: right; font-size: 11px; color: #64748b; line-height: 1.8; }
  @media print {
    body { padding: 20px; }
    @page { margin: 0; }
  }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">{$appName}</div>
    <div class="brand-sub">Platform pemesanan villa terpercaya</div>
  </div>
  <div class="invoice-label">
    <h1>INVOICE</h1>
    <div class="code">#{$booking->booking_code}</div>
    <div class="date">Diterbitkan: {$checkIn}</div>
  </div>
</div>

<hr class="divider" />

<div class="info-grid">
  <div>
    <div class="section-title">Informasi Tamu</div>
    <div class="info-item" style="margin-bottom:8px"><label>Nama</label><span>{$booking->guest_name}</span></div>
    <div class="info-item" style="margin-bottom:8px"><label>Email</label><span>{$booking->guest_email}</span></div>
    <div class="info-item"><label>Telepon</label><span>{$booking->guest_phone}</span></div>
  </div>
  <div>
    <div class="section-title">Detail Pemesanan</div>
    <div class="info-item" style="margin-bottom:8px"><label>Check-in</label><span>{$checkIn}</span></div>
    <div class="info-item" style="margin-bottom:8px"><label>Check-out</label><span>{$checkOut}</span></div>
    <div class="info-item"><label>Durasi</label><span>{$booking->total_nights} malam · {$booking->num_guests} tamu</span></div>
  </div>
</div>

<hr class="divider" />
HTML;

        $villaName = $booking->villa?->name ?? 'Villa';
        $basePriceFormatted = $formatRp($booking->base_price);
        $nightsLabel = "{$booking->total_nights} malam";

        $html .= <<<HTML
<table>
  <thead>
    <tr>
      <th>Deskripsi</th>
      <th class="text-right">Jumlah</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <div style="font-weight:600">{$villaName}</div>
        <div style="font-size:11px;color:#64748b;margin-top:2px">{$checkIn} – {$checkOut} ({$nightsLabel})</div>
      </td>
      <td class="text-right">{$basePriceFormatted}</td>
    </tr>
HTML;

        if ($booking->discount_amount > 0) {
            $discount = $formatRp($booking->discount_amount);
            $html .= <<<HTML
    <tr>
      <td style="color:#16a34a">Diskon Voucher</td>
      <td class="text-right" style="color:#16a34a">- {$discount}</td>
    </tr>
HTML;
        }

        if ($booking->tax_amount > 0) {
            $tax = $formatRp($booking->tax_amount);
            $html .= <<<HTML
    <tr>
      <td style="color:#64748b">Pajak &amp; Biaya Layanan</td>
      <td class="text-right" style="color:#64748b">{$tax}</td>
    </tr>
HTML;
        }

        if ($booking->admin_fee > 0) {
            $adminFee = $formatRp($booking->admin_fee);
            $html .= <<<HTML
    <tr>
      <td style="color:#64748b">Biaya Admin Pembayaran</td>
      <td class="text-right" style="color:#64748b">{$adminFee}</td>
    </tr>
HTML;
        }

        $total = $formatRp($booking->total_amount);
        $statusClass = 'status-'.$booking->status;
        $statusLabel = match ($booking->status) {
            'pending' => 'Menunggu Konfirmasi',
            'confirmed' => 'Dikonfirmasi',
            'cancelled' => 'Dibatalkan',
            'completed' => 'Selesai',
            default => ucfirst($booking->status),
        };

        $pmName = $booking->paymentMethod?->name ?? '-';
        $pmAccount = $booking->paymentMethod?->account_number ?? '';
        $pmAccountName = $booking->paymentMethod?->account_name ?? '';
        $pmAccountHtml = $pmAccount !== ''
            ? '<div class="info-item"><label>Nomor Rekening</label><span style="font-family:monospace">'.$pmAccount.' a/n '.$pmAccountName.'</span></div>'
            : '';

        $html .= <<<HTML
    <tr class="total-row">
      <td>Total Pembayaran</td>
      <td class="text-right">{$total}</td>
    </tr>
  </tbody>
</table>

<div style="display:flex;gap:32px;margin-bottom:32px">
  <div class="info-item"><label>Metode Pembayaran</label><span>{$pmName}</span></div>
  {$pmAccountHtml}
  <div class="info-item"><label>Status Pemesanan</label><span class="status-badge {$statusClass}">{$statusLabel}</span></div>
</div>

<div class="footer">
  <div class="footer-note">
    Dokumen ini merupakan bukti pemesanan resmi dari {$appName}.<br/>
    Harap simpan invoice ini sebagai referensi pemesanan Anda.
  </div>
  <div class="footer-contact">
    <strong>{$appName}</strong><br/>
    {$appEmail}<br/>
    {$appWhatsapp}
  </div>
</div>

<script>window.onload = function() { window.print(); }</script>
</body>
</html>
HTML;

        return response($html, 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }
}
