import { Modal } from 'antd';
import { isAxiosError } from 'axios';
import i18n from '@/i18n';
import { getModalApi } from './modalHolder';

type ShowErrorModalOptions = {
    title?: string;
    content: string;
};

export function showErrorModal({ title, content }: ShowErrorModalOptions) {
    const modal = getModalApi() ?? Modal;
    modal.error({
        title: title ?? i18n.t('common.errors.title'),
        content,
        okText: i18n.t('common.ok'),
        centered: true,
    });
}

function formatDetail(detail: unknown): string | null {
    if (detail == null || detail === '') return null;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
        return detail
            .map((item) =>
                typeof item === 'object' && item && 'msg' in item
                    ? String((item as { msg: unknown }).msg)
                    : String(item)
            )
            .join(', ');
    }
    return String(detail);
}

export function getApiErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const detail = formatDetail(
            (error.response?.data as { detail?: unknown } | undefined)?.detail
        );
        if (detail) return detail;
        if (!error.response) return i18n.t('common.errors.network');
    }
    return i18n.t('common.errors.unknown');
}

export function showErrorModalFromApiError(error: unknown) {
    showErrorModal({ content: getApiErrorMessage(error) });
}
