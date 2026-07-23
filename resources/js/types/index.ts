export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type AppSettings = {
    settings_prop_name: string;
    settings_whatsapp: string;
    settings_email: string;
    settings_address: string;
    settings_meta_title: string;
    settings_meta_description: string;
    [key: string]: string;
};
