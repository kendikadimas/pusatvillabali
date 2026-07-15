import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import jsPDF from 'jspdf';

interface InvoiceSettings {
    settings_prop_name?: string;
    settings_website?: string;
    settings_email?: string;
    settings_wa?: string;
}

interface InvoiceBooking {
    booking_code?: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    check_in: string;
    check_out: string;
    total_nights: number;
    num_guests: number;
    base_price?: number;
    tax_amount?: number;
    admin_fee?: number;
    total_amount: number | string;
    payment_status: string;
    villa?: {
        name?: string;
        location?: string;
        check_in_time?: string;
        check_out_time?: string;
    };
    payment_method?: {
        name?: string;
    } | null;
}

export async function generateInvoicePDF(booking: InvoiceBooking, bookingCode: string, invoiceSettings?: InvoiceSettings) {
    const propName = invoiceSettings?.settings_prop_name || 'PusatVillaBali';
    const websiteUrl = invoiceSettings?.settings_website || 'https://pusatvillabali.com';
    const email = invoiceSettings?.settings_email || 'support@pusatvillabali.com';
    const wa = invoiceSettings?.settings_wa || '+62 812-3456-7890';

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFillColor(49, 156, 98);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(propName, 20, 20);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Platform Sewa Villa Premium', 20, 28);

    // Invoice title
    pdf.setFontSize(20);
    pdf.setTextColor(30, 58, 138);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INVOICE PEMESANAN', 20, 55);

    // Booking code box
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(1);
    pdf.rect(20, 62, pageWidth - 40, 15, 'S');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KODE BOOKING:', 25, 70);
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(12);
    pdf.text(bookingCode, 70, 70);

    // Guest info
    let yPos = 90;
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMASI TAMU', 20, yPos);

    yPos += 8;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);

    const guestFields = [
        ['Nama', booking.guest_name || '-'],
        ['Email', booking.guest_email || '-'],
        ['Telepon', booking.guest_phone || '-'],
        ['Jumlah Tamu', String(booking.num_guests)],
    ];
    guestFields.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(label + ':', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, 60, yPos);
        yPos += 6;
    });

    // Villa info
    yPos += 4;
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DETAIL VILLA', 20, yPos);

    yPos += 8;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);

    const checkInDate = format(parseISO(booking.check_in), 'dd MMMM yyyy', { locale: localeID });
    const checkOutDate = format(parseISO(booking.check_out), 'dd MMMM yyyy', { locale: localeID });

    const villaFields = [
        ['Villa', booking.villa?.name || '-'],
        ['Lokasi', booking.villa?.location || '-'],
        ['Check-in', checkInDate + (booking.villa?.check_in_time ? ' (' + booking.villa.check_in_time + ')' : '')],
        ['Check-out', checkOutDate + (booking.villa?.check_out_time ? ' (' + booking.villa.check_out_time + ')' : '')],
        ['Durasi', String(booking.total_nights) + ' malam'],
    ];
    villaFields.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(label + ':', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, 60, yPos);
        yPos += 6;
    });

    // Payment info
    yPos += 4;
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RINCIAN PEMBAYARAN', 20, yPos);

    yPos += 8;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);

    const formatRp = (amount: number | string | undefined) => {
        if (amount === undefined || amount === null) {
return 'Rp 0';
}

        const num = typeof amount === 'string' ? parseFloat(amount) : amount;

        return 'Rp ' + num.toLocaleString('id-ID');
    };

    if (booking.base_price) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Harga Dasar:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(formatRp(booking.base_price), 80, yPos);
        yPos += 6;
    }

    if (booking.tax_amount) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Pajak:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(formatRp(booking.tax_amount), 80, yPos);
        yPos += 6;
    }

    if (booking.admin_fee) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Biaya Admin:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(formatRp(booking.admin_fee), 80, yPos);
        yPos += 6;
    }

    // Total
    yPos += 4;
    pdf.setFillColor(241, 245, 249);
    pdf.rect(20, yPos - 4, pageWidth - 40, 14, 'F');
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL:', 20, yPos + 5);
    pdf.setTextColor(37, 99, 235);
    pdf.setFontSize(13);
    pdf.text(formatRp(booking.total_amount), 80, yPos + 5);

    yPos += 18;

    // Payment method & status
    pdf.setFontSize(9);
    pdf.setTextColor(71, 85, 105);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Metode Pembayaran:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(booking.payment_method?.name || 'Transfer Bank', 80, yPos);
    yPos += 6;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Status:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(booking.payment_status === 'paid' ? 'LUNAS' : booking.payment_status.toUpperCase(), 80, yPos);
    yPos += 12;

    // Important note
    const footerY = pageHeight - 30;

    if (yPos < footerY - 20) {
        pdf.setFillColor(254, 249, 195);
        pdf.setDrawColor(234, 179, 8);
        pdf.rect(20, yPos, pageWidth - 40, 25, 'FD');
        pdf.setFontSize(9);
        pdf.setTextColor(161, 98, 7);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PENTING:', 25, yPos + 7);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(120, 53, 15);
        const notes = [
            '- Tunjukkan invoice ini atau sebutkan kode booking saat check-in',
            '- Konfirmasi check-in telah dikirim ke email Anda',
            '- Hubungi kami jika ada pertanyaan: ' + wa + ' (WhatsApp)',
        ];
        let noteY = yPos + 12;
        notes.forEach(note => {
            pdf.text(note, 25, noteY);
            noteY += 5;
        });
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.setFont('helvetica', 'normal');
    pdf.text(websiteUrl + ' | ' + email, 20, footerY + 10);

    const filename = 'Invoice-' + bookingCode + '-' + format(new Date(), 'yyyyMMdd') + '.pdf';
    pdf.save(filename);
}
