export interface Profile {
    science_id: string;
    first_name: string;
    sur_name: string;
    mid_name: string;
    birth_date: string;
    email: string;
    phone_number: string;
    registered_at: string;
    degree_name: string | null;
    title: string | null;
    photo: string | null;
}

export interface ProfileResponse {
    pnfl_code: string | null;
    profile: Profile | null;
    profile_found: boolean;
    message?: string;
}
