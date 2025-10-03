export interface VisitCardRequestType {
    image: File;
}

export interface VisitCardResponseType {
    pnfl_code: string | null;
    message: string;
    processing_time_seconds: number;
    search_method: string;
    total_faces_checked: number;
}

export interface ProfileResponseType {
    pnfl_code: string;
    profile: Profile;
    profile_found: boolean;
}

export interface Profile {
    science_id: string;
    first_name: string;
    sur_name: string;
    mid_name: string;
    birth_date: string;
    email: string;
    phone_number: string;
    registered_at: string;
    degree_name: string;
    title: string;
    photo: string;
}
