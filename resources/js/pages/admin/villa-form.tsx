import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    format,
    parseISO,
    subMonths,
    addMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    startOfDay,
} from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Lock,
    Plus,
    Save,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { iconCatalog, getIconComponentByKey } from '@/lib/villaIcons';
import { getPhotoUrl, normaliseStorageUrl } from '@/lib/villaUtils';
import type { Villa, Destination, BlockedDate } from '@/types';

interface Props {
    villa: (Villa & { blocked_dates?: BlockedDate[] }) | null;
    destinations: Destination[];
}

export default function AdminVillaFormPage({ villa, destinations }: Props) {
    const isEdit = !!villa;
    const id = villa?.id ?? null;

    const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'blocked_dates'>('info');
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<any>({});

    // Form fields states
    const [name, setName] = useState(villa?.name || '');
    const [location, setLocation] = useState(villa?.location || '');
    const [pricePerNight, setPricePerNight] = useState(villa?.price_per_night ? String(Number(villa.price_per_night)) : '');
    const [weekendPrice, setWeekendPrice] = useState(villa?.weekend_price ? String(Number(villa.weekend_price)) : '');
    const [minNights, setMinNights] = useState(villa?.min_nights ? String(villa.min_nights) : '1');
    const [bedrooms, setBedrooms] = useState(villa?.bedrooms ? String(villa.bedrooms) : '1');
    const [bathrooms, setBathrooms] = useState(villa?.bathrooms ? String(villa.bathrooms) : '1');
    const [maxGuests, setMaxGuests] = useState(villa?.max_guests ? String(villa.max_guests) : '2');
    const [checkInTime, setCheckInTime] = useState(villa?.check_in_time ? villa.check_in_time.substring(0, 5) : '14:00');
    const [checkOutTime, setCheckOutTime] = useState(villa?.check_out_time ? villa.check_out_time.substring(0, 5) : '12:00');
    const [description, setDescription] = useState(villa?.description || '');
    const [shortDesc, setShortDesc] = useState(villa?.short_desc || '');
    const [mapsUrl, setMapsUrl] = useState(villa?.maps_url || '');
    const [rules, setRules] = useState(villa?.rules || '');
    const [isActive, setIsActive] = useState(villa?.is_active !== false);

    const [destinationId, setDestinationId] = useState(villa?.destination_id ? String(villa.destination_id) : '');

    // Inline new destination form
    const [showNewDestination, setShowNewDestination] = useState(false);
    const [newDestName, setNewDestName] = useState('');
    const [newDestCity, setNewDestCity] = useState('');
    const [savingDestination, setSavingDestination] = useState(false);

    // Amenities
    const [selectedAmenities, setSelectedAmenities] = useState<Array<{ name: string; icon: string }>>(villa?.amenities || []);
    const [newAmenityName, setNewAmenityName] = useState('');
    const [newAmenityIcon, setNewAmenityIcon] = useState('Check');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [iconSearch, setIconSearch] = useState('');

    const [beds, setBeds] = useState(villa?.beds ? String(villa.beds) : '');
    const [cleaningFee, setCleaningFee] = useState(villa?.cleaning_fee ? String(Number(villa.cleaning_fee)) : '');

    // Bedrooms Layout
    const [bedroomsList, setBedroomsList] = useState<Array<{ image: string; title: string; subtext: string }>>((villa as any)?.bedrooms_layout || []);
    const [brImage, setBrImage] = useState('');
    const [brTitle, setBrTitle] = useState('');
    const [brSubtext, setBrSubtext] = useState('');
    const [uploadingBrImage, setUploadingBrImage] = useState(false);

    // Host
    const [hostName, setHostName] = useState(villa?.host_name || 'Admin');
    const [hostYears, setHostYears] = useState(villa?.host_years || 1);
    const [hostAvatar, setHostAvatar] = useState(villa?.host_avatar ? normaliseStorageUrl(villa.host_avatar) : '');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [hostPhone, setHostPhone] = useState(villa?.host_phone || '');

    // Photo states
    const [photos, setPhotos] = useState<Array<string | { url: string; description: string; category?: string }>>(villa?.photos || []);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [savingPhotos, setSavingPhotos] = useState(false);

    // Blocked Dates states
    const [blockedDates, _setBlockedDates] = useState<BlockedDate[]>(villa?.blocked_dates || []);
    const [blockDateInput, setBlockDateInput] = useState('');
    const [blockReasonInput, setBlockReasonInput] = useState('');
    const [blockingDate, setBlockingDate] = useState(false);

    // Calendar state
    const [blockCalendarMonth, setBlockCalendarMonth] = useState(new Date());
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [bulkSelectedDates, setBulkSelectedDates] = useState<string[]>([]);
    const [bulkReason, setBulkReason] = useState('');

    const PHOTO_CATEGORIES = [
        'Ruang tamu',
        'Kamar tidur',
        'Kamar mandi',
        'Dapur',
        'Kolam renang',
        'Luar ruangan',
        'Lainnya',
    ];
    const [activeCategoryUpload, setActiveCategoryUpload] = useState<string>('Ruang tamu');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(PHOTO_CATEGORIES));

    const handleCreateDestination = async () => {
        if (!newDestName.trim() || !newDestCity.trim()) {
            toast.error('Nama dan kota destinasi wajib diisi.');

            return;
        }

        const matchName = destinations.find(d => d.name.toLowerCase() === newDestName.trim().toLowerCase());

        if (matchName) {
            toast.info(`"${newDestName.trim()}" sudah tersedia, menggunakan destinasi yang sudah ada.`);
            setDestinationId(String(matchName.id));
            setNewDestName('');
            setNewDestCity('');
            setShowNewDestination(false);

            return;
        }

        setSavingDestination(true);

        try {
            const response = await axios.post('/api/v1/admin/destinations', {
                name: newDestName.trim(),
                city: newDestCity.trim(),
                query: newDestName.trim(),
                image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
            });

            toast.success('Destinasi baru berhasil ditambahkan.');
            const newDest = response.data.data || response.data;
            
            router.reload({
                only: ['destinations'],
                onSuccess: () => {
                    setDestinationId(String(newDest.id));
                }
            });

            setNewDestName('');
            setNewDestCity('');
            setShowNewDestination(false);
        } catch (err: any) {
            console.error('Failed to create destination:', err);
            toast.error(err.response?.data?.message || 'Gagal menambahkan destinasi.');
        } finally {
            setSavingDestination(false);
        }
    };

    const addAmenity = () => {
        if (!newAmenityName.trim()) {
            toast.error('Nama fasilitas tidak boleh kosong');

            return;
        }

        setSelectedAmenities(prev => [...prev, { name: newAmenityName.trim(), icon: newAmenityIcon }]);
        setNewAmenityName('');
        setNewAmenityIcon('Check');
    };

    const removeAmenity = (index: number) => {
        setSelectedAmenities(prev => prev.filter((_, i) => i !== index));
    };

    const handleBrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // Reset so the same file can be picked again
        e.target.value = '';

        if (!file) {
return;
}

        setUploadingBrImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/v1/admin/villas/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setBrImage(normaliseStorageUrl(response.data.url));
            toast.success('Foto kamar berhasil diunggah.');
        } catch (err: any) {
            console.error('Upload bedroom image failed:', err);
            toast.error(err.response?.data?.message || 'Gagal mengunggah foto kamar.');
        } finally {
            setUploadingBrImage(false);
        }
    };

    const handleHostAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // Reset so the same file can be picked again
        e.target.value = '';

        if (!file) {
return;
}

        setUploadingAvatar(true);
        const formData = new FormData();

        // When creating: use upload-image endpoint (expects 'image' field)
        // When editing: use host-avatar endpoint (expects 'avatar' field)
        const fieldName = isEdit ? 'avatar' : 'image';
        formData.append(fieldName, file);

        try {
            const response = await axios.post(
                isEdit ? `/api/v1/admin/villas/${id}/host-avatar` : '/api/v1/admin/villas/upload-image', 
                formData, 
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const avatarUrl = response.data.host_avatar || response.data.url;
            setHostAvatar(normaliseStorageUrl(avatarUrl));
            toast.success('Avatar tuan rumah berhasil diunggah.');
        } catch (err: any) {
            console.error('Upload host avatar failed:', err);
            toast.error(err.response?.data?.message || 'Gagal mengunggah avatar.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const validateForm = () => {
        const errors: any = {};

        if (!name.trim()) {
errors.name = 'Nama villa wajib diisi.';
}

        if (!location.trim()) {
errors.location = 'Alamat/lokasi villa wajib diisi.';
}

        if (!destinationId) {
errors.destination_id = 'Destinasi wilayah wajib dipilih.';
}

        if (!pricePerNight || Number(pricePerNight) <= 0) {
            errors.price_per_night = 'Harga weekday harus lebih besar dari 0.';
        }

        if (!description.trim()) {
errors.description = 'Deskripsi villa wajib diisi.';
}

        if (!shortDesc.trim()) {
            errors.short_desc = 'Deskripsi singkat wajib diisi.';
        } else if (shortDesc.length > 150) {
            errors.short_desc = 'Deskripsi singkat maksimal berisi 150 karakter.';
        }

        if (!checkInTime) {
errors.check_in_time = 'Jam check-in wajib diisi.';
}

        if (!checkOutTime) {
errors.check_out_time = 'Jam check-out wajib diisi.';
}

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Silakan periksa kembali isian form Anda.');

            return;
        }

        setSubmitting(true);
        setFormErrors({});

        try {
            const payload = {
                name,
                location,
                destination_id: destinationId ? Number(destinationId) : null,
                price_per_night: Number(pricePerNight),
                weekend_price: weekendPrice ? Number(weekendPrice) : null,
                min_nights: Number(minNights),
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                max_guests: Number(maxGuests),
                check_in_time: checkInTime + ':00',
                check_out_time: checkOutTime + ':00',
                description,
                short_desc: shortDesc,
                maps_url: mapsUrl || null,
                rules: rules || null,
                amenities: selectedAmenities,
                is_active: isActive,
                beds: beds ? Number(beds) : null,
                cleaning_fee: cleaningFee ? Number(cleaningFee) : null,
                host_name: hostName,
                host_years: Number(hostYears),
                host_avatar: hostAvatar || null,
                host_phone: hostPhone || null,
                host_is_verified: true,
                co_hosts: [],
                bedrooms_info: bedroomsList,
                accessibility_features: [],
            };

            if (isEdit) {
                await axios.put(`/api/v1/admin/villas/${id}`, payload);
                toast.success('Detail villa berhasil diperbarui!');
                router.reload();
            } else {
                const response = await axios.post('/api/v1/admin/villas', payload);
                toast.success(response.data.message || 'Villa berhasil ditambahkan!');
                const newId = response.data?.villa?.id;

                if (!newId) {
                    toast.error('Data villa tersimpan, namun ID tidak ditemukan.');
                    router.visit('/admin/villas');

                    return;
                }

                router.visit(`/admin/villas/${newId}/edit`);
            }
        } catch (err: any) {
            console.error('Failed to save villa:', err);
            const errMsg = err.response?.data?.message || 'Gagal menyimpan villa.';
            toast.error(errMsg);

            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Photos tab methods
    const handlePhotoUploadForCategory = async (e: React.ChangeEvent<HTMLInputElement>, targetCategory: string) => {
        const filesList = e.target.files ? Array.from(e.target.files) : [];
        e.target.value = '';

        if (filesList.length === 0) {
return;
}

        setUploadingPhotos(true);
        setActiveCategoryUpload(targetCategory);
        const formData = new FormData();

        for (const file of filesList) {
            formData.append('photos[]', file);
        }

        try {
            const response = await axios.post(`/api/v1/admin/villas/${id}/photos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const serverPhotos: Array<string | { url: string; description: string; category?: string }> =
                response.data.photos || [];

            const existingCatMap = new Map<string, string>();
            photos.forEach(p => {
                const url = typeof p === 'string' ? p : p.url;
                const cat = typeof p === 'string' ? 'Lainnya' : (p.category || 'Lainnya');
                existingCatMap.set(url, cat);
            });

            const updatedPhotos = serverPhotos.map(p => {
                const url = typeof p === 'string' ? p : p.url;
                const existing = existingCatMap.get(url);

                if (existing) {
                    return typeof p === 'string'
                        ? { url: p, description: '', category: existing }
                        : { ...p, category: existing };
                }

                return typeof p === 'string'
                    ? { url: p, description: '', category: targetCategory }
                    : { ...p, category: targetCategory };
            });

            setPhotos(updatedPhotos);
            toast.success(`Foto berhasil diunggah ke kategori "${targetCategory}". Jangan lupa simpan galeri.`);
        } catch (err: any) {
            console.error('Upload photos failed:', err);
            toast.error(err.response?.data?.message || 'Gagal mengunggah foto.');
        } finally {
            setUploadingPhotos(false);
        }
    };

    const handleDeletePhoto = async (photoUrl: string) => {
        if (!confirm('Hapus foto ini dari galeri?')) {
return;
}

        try {
            const response = await axios.delete(`/api/v1/admin/villas/${id}/photos`, {
                data: { photo_url: photoUrl }
            });
            setPhotos(response.data.photos || []);
            toast.success('Foto villa berhasil dihapus.');
            router.reload();
        } catch (err: any) {
            console.error('Delete photo failed:', err);
            toast.error(err.response?.data?.message || 'Gagal menghapus foto.');
        }
    };

    const handlePhotoCategoryChange = (index: number, newCategory: string) => {
        setPhotos(prev => {
            const updated = [...prev];
            const item = updated[index];

            if (typeof item === 'string') {
                updated[index] = { url: item, description: '', category: newCategory };
            } else {
                updated[index] = { ...item, category: newCategory };
            }

            return updated;
        });
    };

    const savePhotoGallery = async () => {
        setSavingPhotos(true);

        try {
            const normalizedPhotos = photos.map(photo => {
                if (typeof photo === 'string') {
                    return { url: photo, description: '', category: 'Lainnya' };
                }

                return { 
                    url: photo.url, 
                    description: photo.description || '', 
                    category: photo.category || 'Lainnya' 
                };
            });

            const payload = {
                name,
                location,
                destination_id: destinationId ? Number(destinationId) : null,
                price_per_night: Number(pricePerNight),
                weekend_price: weekendPrice ? Number(weekendPrice) : null,
                min_nights: Number(minNights),
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                max_guests: Number(maxGuests),
                check_in_time: checkInTime + ':00',
                check_out_time: checkOutTime + ':00',
                description,
                short_desc: shortDesc,
                maps_url: mapsUrl || null,
                rules: rules || null,
                amenities: selectedAmenities,
                is_active: isActive,
                photos: normalizedPhotos,
                host_name: hostName,
                host_years: Number(hostYears),
                host_avatar: hostAvatar || null,
                host_phone: hostPhone || null,
                host_is_verified: true,
                co_hosts: [],
                bedrooms_info: bedroomsList,
                accessibility_features: [],
            };

            await axios.put(`/api/v1/admin/villas/${id}`, payload);
            toast.success('Galeri foto berhasil disimpan!');
            router.reload();
        } catch (err: any) {
            console.error('Failed to update photos:', err);
            toast.error(err.response?.data?.message || 'Gagal menyimpan galeri foto.');
        } finally {
            setSavingPhotos(false);
        }
    };

    const toggleCategoryExpand = (cat: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);

            if (next.has(cat)) {
                next.delete(cat);
            } else {
                next.add(cat);
            }

            return next;
        });
    };

    // Block Date methods
    const handleBlockDate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!blockDateInput) {
            toast.error('Silakan tentukan tanggal pemblokiran.');

            return;
        }

        setBlockingDate(true);

        try {
            await axios.post('/api/v1/admin/blocked-dates', {
                villa_id: id,
                date: blockDateInput,
                reason: blockReasonInput || 'Maintenance / Pemeliharaan'
            });
            toast.success('Tanggal berhasil diblokir.');
            setBlockDateInput('');
            setBlockReasonInput('');
            router.reload();
        } catch (err: any) {
            console.error('Failed to block date:', err);
            toast.error(err.response?.data?.message || 'Gagal memblokir tanggal.');
        } finally {
            setBlockingDate(false);
        }
    };

    const handleBulkBlock = async (dates: string[], reason: string) => {
        if (dates.length === 0) {
            toast.error('Pilih minimal satu tanggal.');

            return;
        }

        setBlockingDate(true);

        try {
            const promises = dates.map(date =>
                axios.post('/api/v1/admin/blocked-dates', {
                    villa_id: id,
                    date,
                    reason: reason || 'Maintenance / Pemeliharaan'
                })
            );
            await Promise.all(promises);
            toast.success(`${dates.length} tanggal berhasil diblokir.`);
            setBulkSelectedDates([]);
            setBulkReason('');
            setIsBulkMode(false);
            router.reload();
        } catch (err: any) {
            console.error('Failed to bulk block dates:', err);
            toast.error(err.response?.data?.message || 'Gagal memblokir tanggal.');
        } finally {
            setBlockingDate(false);
        }
    };

    const handleUnblockDate = async (blockedDateId: number) => {
        if (!confirm('Batalkan pemblokiran tanggal ini?')) {
return;
}

        try {
            await axios.delete(`/api/v1/admin/blocked-dates/${blockedDateId}`);
            toast.success('Pemblokiran tanggal berhasil dibatalkan.');
            router.reload();
        } catch (err: any) {
            console.error('Failed to unblock date:', err);
            toast.error(err.response?.data?.message || 'Gagal membatalkan pemblokiran.');
        }
    };

    const handleBulkUnblock = async (dates: string[]) => {
        if (dates.length === 0) {
return;
}

        if (!confirm(`Buka kembali ${dates.length} tanggal terpilih?`)) {
return;
}

        setBlockingDate(true);

        try {
            const recordsToDelete = blockedDates.filter(bd => dates.includes(bd.date));
            const promises = recordsToDelete.map(bd =>
                axios.delete(`/api/v1/admin/blocked-dates/${bd.id}`)
            );
            await Promise.all(promises);
            toast.success(`${recordsToDelete.length} tanggal berhasil dibuka.`);
            setBulkSelectedDates([]);
            setIsBulkMode(false);
            router.reload();
        } catch (err: any) {
            console.error('Failed to bulk unblock:', err);
            toast.error('Gagal membuka kunci tanggal.');
        } finally {
            setBlockingDate(false);
        }
    };

    const handleBlockDateSingle = async (dateStr: string) => {
        setBlockingDate(true);

        try {
            await axios.post('/api/v1/admin/blocked-dates', {
                villa_id: id,
                date: dateStr,
                reason: 'Maintenance / Pemeliharaan'
            });
            toast.success('Tanggal berhasil diblokir.');
            router.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal memblokir tanggal.');
        } finally {
            setBlockingDate(false);
        }
    };

    const goToPrevMonth = () => setBlockCalendarMonth(prev => subMonths(prev, 1));
    const goToNextMonth = () => setBlockCalendarMonth(prev => addMonths(prev, 1));

    const calendarStart = startOfMonth(blockCalendarMonth);
    const calendarEnd = endOfMonth(blockCalendarMonth);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const startDayOfWeek = calendarStart.getDay();
    const paddingDaysCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const paddingDays = Array(paddingDaysCount).fill(null);

    return (
        <>
            <Head title={isEdit ? `Edit Villa: ${name}` : 'Tambah Villa Baru'} />

            <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 py-2">
                {/* Header */}
                <div className="flex items-center space-x-3">
                    <Link href="/admin/villas" className="text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                            {isEdit ? `Edit Villa: ${name}` : 'Tambah villa baru'}
                        </h1>
                        <p className="text-slate-500 text-xs mt-0.5 font-medium">
                            {isEdit 
                                ? 'Ubah spesifikasi villa, unggah foto galeri, atau kelola pemblokiran jadwal.' 
                                : 'Definisikan spesifikasi, harga sewa, dan fasilitas properti baru Anda.'}
                        </p>
                    </div>
                </div>

                {/* Tabs Selector */}
                <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide">
                    <button 
                        type="button"
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 border-b-2 cursor-pointer transition-colors ${
                            activeTab === 'info' ? 'border-blue-600 text-blue-600 font-bold border-blue-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        1. Info Detail
                    </button>
                    <button 
                        type="button"
                        onClick={() => {
                            if (!isEdit) {
                                toast.info('Silakan simpan Informasi Dasar terlebih dahulu untuk dapat mengunggah foto.');

                                return;
                            }

                            setActiveTab('photos');
                        }}
                        className={`pb-3 border-b-2 transition-colors flex items-center space-x-1 ${
                            !isEdit 
                                ? 'text-slate-300 cursor-not-allowed border-transparent' 
                                : activeTab === 'photos' 
                                    ? 'border-blue-600 text-blue-600 font-bold cursor-pointer border-blue-600' 
                                    : 'border-transparent text-slate-400 hover:text-slate-700 cursor-pointer'
                        }`}
                    >
                        <span>2. Galeri Foto</span>
                        {!isEdit && <Lock className="w-3 h-3 inline-block ml-1" />}
                        {isEdit && <span>({photos.length})</span>}
                    </button>
                    <button 
                        type="button"
                        onClick={() => {
                            if (!isEdit) {
                                toast.info('Silakan simpan Informasi Dasar terlebih dahulu untuk dapat memblokir tanggal.');

                                return;
                            }

                            setActiveTab('blocked_dates');
                        }}
                        className={`pb-3 border-b-2 transition-colors flex items-center space-x-1 ${
                            !isEdit 
                                ? 'text-slate-300 cursor-not-allowed border-transparent' 
                                : activeTab === 'blocked_dates' 
                                    ? 'border-blue-600 text-blue-600 font-bold cursor-pointer border-blue-600' 
                                    : 'border-transparent text-slate-400 hover:text-slate-700 cursor-pointer'
                        }`}
                    >
                        <span>3. Blokir Tanggal</span>
                        {!isEdit && <Lock className="w-3 h-3 inline-block ml-1" />}
                        {isEdit && <span>({blockedDates.length})</span>}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form Section */}
                    <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
                        
                        {/* TAB 1: INFO DETAIL */}
                        {activeTab === 'info' && (
                            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                                
                                {/* 1. General Info */}
                                <div className="space-y-5">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">Informasi Dasar</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama villa *</label>
                                            <input 
                                                type="text" 
                                                placeholder="Contoh: Villa Kencana Cilember"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                 className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold transition-all duration-200 ${
                                                    formErrors.name ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
                                                 }`}
                                            />
                                            {formErrors.name && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.name}</p>}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi singkat card (max 150 karakter) *</label>
                                            <input 
                                                type="text" 
                                                placeholder="Tulis deskripsi singkat untuk listing card villa (maksimal 150 karakter)."
                                                value={shortDesc}
                                                onChange={(e) => setShortDesc(e.target.value)}
                                                maxLength={150}
                                                 className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold transition-all duration-200 ${
                                                    formErrors.short_desc ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
                                                 }`}
                                            />
                                            <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1 font-semibold">
                                                <span>Tampil di halaman katalog.</span>
                                                <span>{shortDesc.length}/150</span>
                                            </div>
                                            {formErrors.short_desc && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.short_desc}</p>}
                                        </div>

                                        <div className="min-w-0">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi / alamat ringkas *</label>
                                            <input 
                                                type="text" 
                                                placeholder="Contoh: Cilember, Cisarua, Bogor"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                 className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold transition-all duration-200 ${
                                                    formErrors.location ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
                                                 }`}
                                            />
                                            {formErrors.location && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.location}</p>}
                                        </div>

                                        <div className="min-w-0">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Destinasi Wilayah *
                                            </label>
                                            {!showNewDestination ? (
                                                <div className="space-y-2">
                                                    <select 
                                                        value={destinationId}
                                                        onChange={(e) => setDestinationId(e.target.value)}
                                                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold transition-all duration-200 cursor-pointer ${
                                                            formErrors.destination_id ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <option value="">-- Pilih Destinasi --</option>
                                                        {destinations.map((dest) => (
                                                            <option key={dest.id} value={dest.id}>{dest.name}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewDestination(true)}
                                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline transition-colors"
                                                    >
                                                        + Tambah destinasi baru
                                                    </button>
                                                    {formErrors.destination_id && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.destination_id}</p>}
                                                </div>
                                            ) : (
                                                <div className="space-y-2 p-3 border border-blue-200 bg-blue-50/30 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-blue-700">Tambah Destinasi Baru</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewDestination(false)}
                                                            className="text-[9px] text-slate-400 hover:text-slate-650"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Nama destinasi (misal: Cisarua, Bogor) *"
                                                        value={newDestName}
                                                        onChange={(e) => setNewDestName(e.target.value)}
                                                 className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                                                     />
                                                     <input
                                                         type="text"
                                                         placeholder="Kota/kabupaten *"
                                                         value={newDestCity}
                                                         onChange={(e) => setNewDestCity(e.target.value)}
                                                         className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleCreateDestination}
                                                        disabled={savingDestination}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-[10px] py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5"
                                                    >
                                                        {savingDestination ? (
                                                            <>
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                <span>Menyimpan...</span>
                                                            </>
                                                        ) : (
                                                            <span>Simpan Destinasi</span>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Google Maps Embed URL</label>
                                            <input 
                                                type="text" 
                                                value={mapsUrl}
                                                onChange={(e) => {
                                                    const val = e.target.value.trim();

                                                    // Extract src from iframe embed code
                                                    if (val.includes('<iframe')) {
                                                        const match = val.match(/src=["']([^"']+)["']/);
                                                        if (match?.[1]) { setMapsUrl(match[1]); return; }
                                                    }

                                                    // Convert short share links (maps.app.goo.gl or goo.gl)
                                                    // to embed URL — store as-is, frontend renders in iframe
                                                    // Accept any google maps URL or embed URL directly
                                                    setMapsUrl(val);
                                                }}
                                                placeholder="Tempel iframe embed, link Google Maps, atau URL embed"
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                     </div>

                                     <div>
                                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Lengkap Villa *</label>
                                         <textarea 
                                             rows={6}
                                             value={description}
                                             onChange={(e) => setDescription(e.target.value)}
                                             className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold ${
                                                formErrors.description ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        />
                                        {formErrors.description && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.description}</p>}
                                    </div>
                                </div>

                                {/* 2. Pricing & Capacity */}
                                <div className="space-y-5 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">Harga & Kapasitas</h3>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga Weekday *</label>
                                            <input 
                                                type="number" 
                                                value={pricePerNight}
                                                onChange={(e) => setPricePerNight(e.target.value)}
                                                 className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold ${
                                                    formErrors.price_per_night ? 'border-red-500' : 'border-slate-200'
                                                 }`}
                                            />
                                            {formErrors.price_per_night && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.price_per_night}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga Weekend (Opsional)</label>
                                            <input 
                                                type="number" 
                                                value={weekendPrice}
                                                onChange={(e) => setWeekendPrice(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kamar Tidur</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={bedrooms}
                                                onChange={(e) => setBedrooms(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kamar Mandi</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={bathrooms}
                                                onChange={(e) => setBathrooms(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kapasitas Tamu</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={maxGuests}
                                                onChange={(e) => setMaxGuests(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Beds (Kasur)</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={beds}
                                                onChange={(e) => setBeds(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Biaya Kebersihan</label>
                                            <input 
                                                type="number" 
                                                value={cleaningFee}
                                                onChange={(e) => setCleaningFee(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Min Menginap (Malam)</label>
                                             <input 
                                                 type="number" 
                                                 min="1"
                                                 value={minNights}
                                                 onChange={(e) => setMinNights(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Times & Additional Rules */}
                                <div className="space-y-5 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">Jam & Aturan</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jam Check-in *</label>
                                            <input 
                                                type="text" 
                                                value={checkInTime}
                                                onChange={(e) => setCheckInTime(e.target.value)}
                                                placeholder="Misal: 14:00"
                                                 className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold ${
                                                    formErrors.check_in_time ? 'border-red-500' : 'border-slate-200'
                                                 }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jam Check-out *</label>
                                            <input 
                                                type="text" 
                                                value={checkOutTime}
                                                onChange={(e) => setCheckOutTime(e.target.value)}
                                                placeholder="Misal: 12:00"
                                                 className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold ${
                                                    formErrors.check_out_time ? 'border-red-500' : 'border-slate-200'
                                                 }`}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Aturan Villa</label>
                                            <textarea 
                                                rows={3}
                                                value={rules}
                                                onChange={(e) => setRules(e.target.value)}
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                                             />
                                         </div>
                                         <div className="sm:col-span-2 flex items-center space-x-3 pt-2">
                                            <input 
                                                type="checkbox" 
                                                id="isActive"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-605 w-4 h-4 cursor-pointer"
                                            />
                                            <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                                                Aktifkan Villa (Tampilkan langsung di katalog website)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Facility Pickers */}
                                <div className="space-y-5 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">Fasilitas</h3>
                                    
                                    {selectedAmenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {selectedAmenities.map((amenity, idx) => {
                                                const IconComp = getIconComponentByKey(amenity.icon);

                                                return (
                                                    <span key={idx} className="flex items-center gap-1.5 bg-slate-55 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
                                                        <IconComp className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{amenity.name}</span>
                                                        <button type="button" onClick={() => removeAmenity(idx)} className="text-red-500 hover:text-red-750 font-bold pl-1">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Fasilitas</label>
                                            <input 
                                                type="text" 
                                                placeholder="Misal: WiFi 100Mbps"
                                                value={newAmenityName}
                                                onChange={(e) => setNewAmenityName(e.target.value)}
                                                 className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-505 font-semibold"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ikon</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                                                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold cursor-pointer min-w-[150px] flex items-center justify-between"
                                            >
                                                {(() => {
                                                    const CurrentIcon = getIconComponentByKey(newAmenityIcon);
                                                    const currentItem = iconCatalog.find(i => i.key === newAmenityIcon);

                                                    return (
                                                        <span className="flex items-center space-x-2">
                                                            <CurrentIcon className="w-4 h-4 text-slate-650" />
                                                            <span>{currentItem?.label || 'Pilih Ikon'}</span>
                                                        </span>
                                                    );
                                                })()}
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
                                            </button>

                                            {isIconPickerOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => {
 setIsIconPickerOpen(false); setIconSearch(''); 
}} />
                                                    <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-3 space-y-2">
                                                        <input 
                                                            type="text"
                                                            value={iconSearch}
                                                            onChange={(e) => setIconSearch(e.target.value)}
                                                            placeholder="Cari ikon..."
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-505 font-semibold"
                                                            autoFocus
                                                        />
                                                        <div className="grid grid-cols-4 gap-1 max-h-[160px] overflow-y-auto">
                                                            {iconCatalog
                                                                .filter(item => item.label.toLowerCase().includes(iconSearch.toLowerCase()) || item.key.toLowerCase().includes(iconSearch.toLowerCase()))
                                                                .map((item) => {
                                                                    const IconComp = item.component;
                                                                    const isSelected = item.key === newAmenityIcon;

                                                                    return (
                                                                        <button
                                                                            key={item.key}
                                                                            type="button"
                                                                            title={item.label}
                                                                            onClick={() => {
                                                                                setNewAmenityIcon(item.key);
                                                                                setIsIconPickerOpen(false);
                                                                                setIconSearch('');
                                                                            }}
                                                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                                                                                isSelected 
                                                                                    ? 'border-blue-500 bg-blue-50 text-blue-650' 
                                                                                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-600'
                                                                            }`}
                                                                        >
                                                                            <IconComp className="w-4 h-4 mb-1" />
                                                                            <span className="text-[8px] font-medium text-center truncate w-full">{item.label}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={addAmenity}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                                        >
                                            Tambah
                                        </button>
                                    </div>
                                </div>

                                {/* 5. Tuan Rumah (Host) */}
                                <div className="space-y-5 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">Tuan Rumah</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Tuan Rumah</label>
                                             <input 
                                                 type="text" 
                                                 value={hostName} 
                                                 onChange={(e) => setHostName(e.target.value)} 
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold" 
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">No. WhatsApp Host</label>
                                             <input 
                                                 type="text" 
                                                 placeholder="081234567890" 
                                                 value={hostPhone} 
                                                 onChange={(e) => setHostPhone(e.target.value)} 
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold" 
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tahun Pengalaman (Tahun)</label>
                                             <input 
                                                 type="number" 
                                                 min="0" 
                                                 value={hostYears} 
                                                 onChange={(e) => setHostYears(Number(e.target.value))} 
                                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold" 
                                             />
                                         </div>

                                        <div className="sm:col-span-3 space-y-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avatar Tuan Rumah</label>
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                    {hostAvatar ? (
                                                        <img src={hostAvatar} alt="Host Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center p-1">Kosong</span>
                                                    )}
                                                    {uploadingAvatar && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center space-x-2">
                                                        <label className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <span>{uploadingAvatar ? 'Mengunggah...' : 'Unggah Avatar'}</span>
                                                            <input 
                                                                type="file" 
                                                                accept="image/*" 
                                                                onChange={handleHostAvatarUpload} 
                                                                className="hidden" 
                                                                disabled={uploadingAvatar} 
                                                            />
                                                        </label>
                                                        {hostAvatar && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setHostAvatar('')}
                                                                className="border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-600 font-bold text-[10px] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-[9px] text-slate-400">Rekomendasi rasio 1:1, maks 2MB (JPG, PNG, WebP).</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Bedroom Details */}
                                <div className="space-y-5 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">Detail Kamar</h3>
                                    
                                    {bedroomsList.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                                            {bedroomsList.map((br, idx) => (
                                                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-55">
                                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                                                        <img src={br.image} alt={br.title} className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => setBedroomsList(prev => prev.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-650 text-white hover:bg-red-700 p-1.5 rounded-lg cursor-pointer">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="p-3 text-xs">
                                                        <h5 className="font-bold text-slate-800">{br.title}</h5>
                                                        <p className="text-[10px] text-slate-505 mt-0.5">{br.subtext}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                        <div className="sm:col-span-3 space-y-2">
                                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Foto Kamar</label>
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                    {brImage ? (
                                                        <img src={brImage} alt="Bedroom Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider text-center p-1 leading-tight">Belum ada foto</span>
                                                    )}
                                                    {uploadingBrImage && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => document.getElementById('br-image-upload')?.click()}
                                                            disabled={uploadingBrImage}
                                                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                                                        >
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <span>Pilih Foto</span>
                                                        </button>
                                                        <input 
                                                            id="br-image-upload"
                                                            type="file" 
                                                            accept="image/*" 
                                                            onChange={handleBrImageUpload} 
                                                            className="hidden" 
                                                            disabled={uploadingBrImage} 
                                                        />
                                                        {brImage && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setBrImage('')}
                                                                className="border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-655 font-bold text-[10px] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-[9px] text-slate-400">Pilih foto kamar (maks 5MB).</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Kamar</label>
                                             <input type="text" placeholder="Misal: Kamar utama" value={brTitle} onChange={(e) => setBrTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold" />
                                         </div>
                                         <div className="sm:col-span-2">
                                             <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Keterangan Tempat Tidur</label>
                                             <input type="text" placeholder="Misal: 1 tempat tidur king size" value={brSubtext} onChange={(e) => setBrSubtext(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold" />
                                        </div>
                                        <div className="sm:col-span-3 flex justify-end">
                                            <button 
                                                type="button" 
                                                onClick={() => { 
                                                    if (!brImage.trim() || !brTitle.trim() || !brSubtext.trim()) {
 toast.error('Semua field kamar tidur wajib diisi.');

 return; 
}
 
                                                    setBedroomsList(prev => [...prev, { image: brImage, title: brTitle, subtext: brSubtext }]); 
                                                    setBrImage(''); 
                                                    setBrTitle(''); 
                                                    setBrSubtext(''); 
                                                }} 
                                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Tambah Kamar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Buttons */}
                                <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 flex-wrap">
                                    <Link 
                                        href="/admin/villas"
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors text-center cursor-pointer"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>{isEdit ? 'Simpan Perubahan' : 'Tambah Villa'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 2: GALERI FOTO */}
                        {activeTab === 'photos' && isEdit && (
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-1">Galeri Foto Villa</h3>
                                        <p className="text-slate-505 text-xs font-medium">
                                            Pilih kategori di bawah, unggah foto, lalu simpan perubahan galeri untuk mematangkan deskripsi atau kategori.
                                        </p>
                                    </div>
                                    {photos.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={savePhotoGallery}
                                            disabled={savingPhotos}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                                        >
                                            {savingPhotos ? (
                                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Menyimpan...</span></>
                                            ) : (
                                                <><Save className="w-3.5 h-3.5" /><span>Simpan Galeri</span></>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {PHOTO_CATEGORIES.map((cat) => {
                                    const catPhotos = photos
                                        .map((p, i) => ({ photo: p, index: i }))
                                        .filter(({ photo }) => {
                                            const category = typeof photo === 'string' ? 'Lainnya' : (photo.category || 'Lainnya');

                                            return category === cat;
                                        });
                                    const isExpanded = expandedCategories.has(cat);
                                    const isActiveUpload = activeCategoryUpload === cat;

                                    return (
                                        <div key={cat} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                                            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCategoryExpand(cat)}
                                                    className="flex items-center space-x-3 flex-1 text-left cursor-pointer font-bold text-slate-805 text-xs uppercase tracking-wider"
                                                >
                                                    <ChevronRight className={`w-4 h-4 text-slate-405 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                                    <span>{cat}</span>
                                                    {catPhotos.length > 0 && (
                                                        <span className="text-[9px] font-bold text-blue-650 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full lowercase">
                                                            {catPhotos.length} foto
                                                        </span>
                                                    )}
                                                </button>

                                                <label className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all active:scale-95 ${
                                                    isActiveUpload && uploadingPhotos
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'bg-white border border-slate-200 text-slate-655 hover:bg-slate-50'
                                                }`}>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        disabled={uploadingPhotos}
                                                        onChange={(e) => handlePhotoUploadForCategory(e, cat)}
                                                    />
                                                    {uploadingPhotos && isActiveUpload ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Upload className="w-3.5 h-3.5" />
                                                    )}
                                                    <span>Unggah Foto</span>
                                                </label>
                                            </div>

                                            {isExpanded && (
                                                <div className="p-5 bg-white">
                                                    {catPhotos.length === 0 ? (
                                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50">
                                                            <Upload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                                            <p className="text-[11px] text-slate-400 font-bold">Belum ada foto.</p>
                                                            <p className="text-[9px] text-slate-350 mt-0.5">Unggah foto ke kategori ini menggunakan tombol di atas.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {catPhotos.map(({ photo, index }) => {
                                                                const photoUrl = getPhotoUrl(photo);
                                                                const isMainPhoto = index === 0 && cat === PHOTO_CATEGORIES[0];
                                                                const category = typeof photo === 'string' ? 'Lainnya' : (photo.category || 'Lainnya');

                                                                return (
                                                                    <div key={index} className="group border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs flex flex-col">
                                                                        <div className="relative aspect-video bg-slate-50 overflow-hidden">
                                                                            <img src={photoUrl} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                                                                            {isMainPhoto && (
                                                                                <span className="absolute top-2.5 left-2.5 bg-blue-650 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-xs">
                                                                                    UTAMA
                                                                                </span>
                                                                            )}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleDeletePhoto(photoUrl)}
                                                                                className="absolute top-2.5 right-2.5 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-md"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2 text-xs flex-1">
                                                                            <div>
                                                                                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kategori</label>
                                                                                <select 
                                                                                    value={category} 
                                                                                    onChange={(e) => handlePhotoCategoryChange(index, e.target.value)}
                                                                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer font-semibold"
                                                                                >
                                                                                    {PHOTO_CATEGORIES.map(c => (
                                                                                        <option key={c} value={c}>{c}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {photos.length > 0 && (
                                    <div className="flex justify-end pt-3">
                                        <button
                                            type="button"
                                            onClick={savePhotoGallery}
                                            disabled={savingPhotos}
                                            className="bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                                        >
                                            {savingPhotos ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            <span>Simpan Galeri</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: BLOKIR TANGGAL */}
                        {activeTab === 'blocked_dates' && isEdit && (
                            <div className="p-6 sm:p-8 space-y-6">
                                {/* Calendar Nav */}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-sm font-bold text-slate-800 capitalize font-black">
                                            {format(blockCalendarMonth, 'MMMM yyyy', { locale: localeID })}
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsBulkMode(!isBulkMode);
                                                setBulkSelectedDates([]);
                                            }}
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${
                                                isBulkMode
                                                    ? 'bg-blue-600 border-blue-600 text-white font-bold'
                                                    : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                                            }`}
                                        >
                                            {isBulkMode ? 'Batal Pilih Banyak' : 'Pilih Banyak Tanggal'}
                                        </button>
                                        <button onClick={goToPrevMonth} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-90 transition-all cursor-pointer">
                                            <ChevronLeft className="w-4 h-4 text-slate-500" />
                                        </button>
                                        <button onClick={() => setBlockCalendarMonth(new Date())} className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-600 active:scale-90 transition-all cursor-pointer">
                                            Hari Ini
                                        </button>
                                        <button onClick={goToNextMonth} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-90 transition-all cursor-pointer">
                                            <ChevronRight className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar grid */}
                                <div className="space-y-1">
                                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                                        <div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div><div>Min</div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {[...paddingDays, ...calendarDays].map((day, idx) => {
                                            if (day === null) {
                                                return <div key={`pad-${idx}`} className="h-12 bg-slate-50/50 rounded-xl border border-slate-100" />;
                                            }

                                            const dateStr = format(day, 'yyyy-MM-dd');
                                            const dayNum = format(day, 'd');
                                            const isToday = isSameDay(day, new Date());
                                            const isPast = startOfDay(day) < startOfDay(new Date());
                                            const blockRecord = blockedDates.find(bd => isSameDay(parseISO(bd.date), day));
                                            const isBlocked = !!blockRecord;
                                            const isSelected = bulkSelectedDates.includes(dateStr);

                                            let cellBg = 'bg-white hover:bg-slate-55 border-slate-200';
                                            let textColor = 'text-slate-800';

                                            if (isBlocked) {
                                                cellBg = 'bg-slate-800 border-slate-800';
                                                textColor = 'text-white';
                                            } else if (isPast) {
                                                cellBg = 'bg-slate-50/50 border-slate-100 cursor-not-allowed opacity-50';
                                                textColor = 'text-slate-300';
                                            }

                                            if (isSelected && !isBlocked) {
                                                cellBg = 'bg-blue-600 border-blue-600';
                                                textColor = 'text-white';
                                            }

                                            return (
                                                <button
                                                    key={dateStr}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isPast && !isBlocked) {
return;
}

                                                        if (isBlocked && !isBulkMode) {
                                                            handleUnblockDate(blockRecord.id);

                                                            return;
                                                        }

                                                        if (isBlocked && isBulkMode) {
                                                            toast.info('Tanggal yang sudah diblokir tidak dapat dipilih.');

                                                            return;
                                                        }

                                                        if (isBulkMode) {
                                                            setBulkSelectedDates(prev =>
                                                                prev.includes(dateStr)
                                                                    ? prev.filter(d => d !== dateStr)
                                                                    : [...prev, dateStr]
                                                            );
                                                        } else {
                                                            if (confirm(`Blokir tanggal ${format(day, 'dd MMM yyyy')}?`)) {
                                                                handleBlockDateSingle(dateStr);
                                                            }
                                                        }
                                                    }}
                                                    className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer relative ${cellBg} ${isToday && !isBlocked ? 'ring-2 ring-blue-500' : ''}`}
                                                >
                                                    <span className={`text-xs font-bold ${textColor}`}>{dayNum}</span>
                                                    {isBlocked && (
                                                        <span className="text-[8px] truncate max-w-full px-0.5 opacity-80 text-white leading-none mt-0.5">blokir</span>
                                                    )}
                                                    {isBulkMode && !isBlocked && !isPast && (
                                                        <div className={`absolute top-1 right-1 w-3 h-3 rounded border flex items-center justify-center text-[8px] ${
                                                            isSelected ? 'bg-white border-white text-blue-600' : 'bg-white/50 border-slate-300'
                                                        }`}>
                                                            {isSelected && <Check className="w-2.5 h-2.5" />}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold text-slate-500 border-t border-slate-100 pt-3">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-3 h-3 rounded bg-slate-800" />
                                        <span>Diblokir</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-3 h-3 rounded bg-blue-600" />
                                        <span>Dipilih</span>
                                    </div>
                                    <span className="text-slate-400">| Total: {blockedDates.length} tanggal diblokir</span>
                                </div>

                                {/* Bulk action form */}
                                {isBulkMode && bulkSelectedDates.length > 0 && (
                                    <div className="bg-blue-50/50 border border-blue-150 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-blue-700">{bulkSelectedDates.length} tanggal dipilih</span>
                                            <button type="button" onClick={() => setBulkSelectedDates([])} className="text-[10px] text-slate-450 hover:text-slate-600 font-bold">
                                                Hapus Pilihan
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Sebutkan alasan pemblokiran massal..."
                                                value={bulkReason}
                                                onChange={(e) => setBulkReason(e.target.value)}
                                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleBulkBlock(bulkSelectedDates, bulkReason)}
                                                disabled={blockingDate}
                                                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-1"
                                            >
                                                {blockingDate && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                <span>Blokir</span>
                                            </button>
                                        </div>
                                        {blockedDates.some(bd => bulkSelectedDates.includes(bd.date)) && (
                                            <button
                                                type="button"
                                                onClick={() => handleBulkUnblock(bulkSelectedDates)}
                                                disabled={blockingDate}
                                                className="w-full bg-white hover:bg-red-50 text-red-650 font-bold text-xs py-2 rounded-lg border border-slate-200 cursor-pointer"
                                            >
                                                Buka Kunci Tanggal Terpilih
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Manual blocking form */}
                                {!isBulkMode && (
                                    <form onSubmit={handleBlockDate} className="bg-slate-55 p-4 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                        <div>
                                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal</label>
                                            <input 
                                                type="date" 
                                                value={blockDateInput} 
                                                onChange={(e) => setBlockDateInput(e.target.value)} 
                                                min={format(new Date(), 'yyyy-MM-dd')}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Alasan Pemblokiran</label>
                                            <input 
                                                type="text" 
                                                placeholder="Misal: Perbaikan atap bocor" 
                                                value={blockReasonInput} 
                                                onChange={(e) => setBlockReasonInput(e.target.value)} 
                                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold" 
                                            />
                                        </div>
                                        <div>
                                            <button 
                                                type="submit" 
                                                disabled={blockingDate}
                                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
                                            >
                                                {blockingDate && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                <span>Blokir Tanggal</span>
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Blocked Dates List */}
                                <div className="border-t border-slate-100 pt-4">
                                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Daftar Pemblokiran Aktif ({blockedDates.length})</h4>
                                    {blockedDates.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl">Belum ada jadwal pemblokiran.</p>
                                    ) : (
                                        <div className="max-h-48 overflow-y-auto space-y-1.5">
                                            {blockedDates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((bd) => (
                                                <div key={bd.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                                                    <div>
                                                        <span className="font-bold text-slate-805">
                                                            {format(parseISO(bd.date), 'EEEE, dd MMM yyyy', { locale: localeID })}
                                                        </span>
                                                        {bd.reason && <span className="text-slate-450 ml-2">— {bd.reason}</span>}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUnblockDate(bd.id)}
                                                        className="text-red-500 hover:text-red-750 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors active:scale-95 cursor-pointer"
                                                    >
                                                        Buka
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}
