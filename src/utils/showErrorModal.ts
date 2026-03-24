import { Modal } from 'antd';

function formatDetail(detail: unknown): string {
    if (detail == null) return 'Tizimda xatolik yuz berdi';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map(String).join(', ');
    return String(detail);
}

type ShowErrorModalOptions = {
    title?: string;
    content: string;
};

export function showErrorModal({
    title = 'Xatolik',
    content,
}: ShowErrorModalOptions) {
    Modal.error({
        title,
        content,
        okText: 'Yaxshi',
        centered: true,
    });
}

export function showErrorModalFromApiError(error: unknown) {
    const detail = (error as { response?: { data?: { detail?: unknown } } })
        ?.response?.data?.detail;
    showErrorModal({ content: formatDetail(detail) });
}
