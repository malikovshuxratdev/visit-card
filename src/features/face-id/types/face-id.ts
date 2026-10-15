export interface RecognizeFaceBody {
    image: File;
}

export interface RecognizeFaceResponse {
    pnfl_code: string | null;
    message: string;
    processing_time_seconds: number;
    search_method: string;
    total_faces_checked: number;
}

export interface VerifyFaceBody {
    pnfl_code: string;
    image: File;
}

export interface VerifyFaceResponse {
    is_match: boolean;
    pnfl_code: string;
    similarity_percentage: number;
    confidence_score: number;
    processing_time_seconds: number;
    threshold_used: string;
}

export interface CapturedPhoto {
    dataUrl: string;
    file: File;
}

export type CameraErrorCode =
    | 'denied'
    | 'not-found'
    | 'unsupported'
    | 'unavailable';
