export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Villa {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    short_desc: string | null;
    location: string;
    maps_url: string | null;
    bedrooms: number;
    bathrooms: number;
    max_guests: number;
    price_per_night: number;
    weekend_price: number | null;
    min_nights: number;
    amenities: Array<{ name: string; icon: string }> | null;
    photos: Array<string | { url: string; description: string; category?: string }> | null;
    rules: string | null;
    check_in_time: string;
    check_out_time: string;
    is_active: boolean;
    host_name?: string;
    host_years?: number;
    host_avatar?: string | null;
    host_phone?: string | null;
    highlights?: Array<{ icon: string; title: string; description: string }> | null;
    bedrooms_info?: Array<{ image: string; title: string; subtext: string }> | null;
    host_joined_label?: string;
    host_is_verified?: boolean;
    host_about?: string[] | null;
    co_hosts?: Array<{ name: string; avatar: string }> | null;
    cancellation_policy?: string | null;
    safety_property?: string[] | null;
    neighborhood_desc?: string | null;
    refundable_surcharge_rate?: number;
    cancellation_free_days?: number;
    beds?: number | null;
    cleaning_fee?: number | null;
    reviews_avg_rating?: string | number | null;
    reviews_count?: number;
    destination_id?: number | null;
    destination?: Destination | null;
    created_at?: string;
    updated_at?: string;
}

export interface Booking {
    id: number;
    booking_code: string;
    villa_id: number;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    check_in: string;
    check_out: string;
    total_nights: number;
    num_guests: number;
    base_price: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_status: 'unpaid' | 'pending' | 'paid' | 'refunded' | 'expired';
    notes: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    cancel_reason: string | null;
    cancelled_at: string | null;
    ktp_image?: string | null;
    created_at: string;
    updated_at: string;
    villa?: Villa;
    payment?: Payment;
    review?: Review;
    payment_method_id?: number | null;
    tax_amount?: number;
    admin_fee?: number;
    cleaning_fee?: number;
    payment_method?: PaymentMethod;
    user_id?: number | null;
}

export interface Payment {
    id: number;
    booking_id: number;
    amount: number;
    method: string;
    status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
    payment_url?: string | null;
    payment_code?: string | null;
    proof_image?: string | null;
    paid_at?: string | null;
    expired_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaymentMethod {
    id: number;
    name: string;
    type: 'bank_transfer' | 'ewallet' | 'payment_gateway' | 'cash';
    code: string;
    account_number?: string | null;
    account_name?: string | null;
    logo?: string | null;
    instructions?: string | null;
    is_active: boolean;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Review {
    id: number;
    booking_id: number;
    villa_id: number;
    guest_name: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    approved_at: string | null;
    approved_by: number | null;
    created_at: string;
    updated_at: string;
    guest_avatar?: string | null;
    guest_subtitle?: string | null;
    villa?: Villa;
    booking?: Booking;
}

export interface BlockedDate {
    id: number;
    villa_id: number;
    date: string;
    reason: string | null;
    created_by: number;
    created_at?: string;
    updated_at?: string;
    villa?: {
        id: number;
        name: string;
    };
}

export interface Destination {
    id: number;
    name: string;
    city: string;
    query: string;
    image: string;
    count_fallback: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface AppSettings {
    settings_prop_name?: string;
    settings_whatsapp?: string;
    settings_email?: string;
    settings_address?: string;
    settings_logo?: string | null;
    settings_meta_title?: string | null;
    settings_meta_description?: string | null;
    [key: string]: string | null | undefined;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface AdminStats {
    checkins_today: number;
    bookings_this_month: number;
    revenue_this_month: number;
    pending_payments: number;
    pending_reviews: number;
    occupancy_rate: number;
}
