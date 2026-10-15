import { useId, useState, type FormEvent } from 'react';
import { Button, Input } from 'antd';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScienceIdLookupMutation } from '@/features/science-id/hooks/useScienceIdLookupMutation';
import {
    formatScienceId,
    isValidScienceId,
    SCIENCE_ID_LENGTH,
} from '@/features/science-id/utils';

export function ScienceIdForm() {
    const { t } = useTranslation();
    const inputId = useId();
    const hintId = useId();
    const { mutate, isPending } = useScienceIdLookupMutation();
    const [scienceId, setScienceId] = useState('');
    const isValid = isValidScienceId(scienceId);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (isValid && !isPending) mutate(scienceId);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
                <label
                    htmlFor={inputId}
                    className="text-sm font-semibold text-white/80"
                >
                    {t('pages.home.input-label')}
                </label>
                <Input
                    id={inputId}
                    size="large"
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    aria-describedby={hintId}
                    placeholder={t('pages.home.input-placeholder')}
                    value={scienceId}
                    maxLength={SCIENCE_ID_LENGTH}
                    onChange={(event) =>
                        setScienceId(formatScienceId(event.target.value))
                    }
                    status={
                        scienceId.length === SCIENCE_ID_LENGTH && !isValid
                            ? 'error'
                            : undefined
                    }
                    suffix={
                        <CheckCircle2
                            size={22}
                            aria-hidden
                            className={
                                isValid
                                    ? 'text-brand-400 transition-opacity'
                                    : 'opacity-0 transition-opacity'
                            }
                        />
                    }
                    className="!h-16 !text-2xl !font-semibold !tracking-[0.12em] [&_input]:!font-mono [&_input]:uppercase"
                />
                <p id={hintId} className="text-sm text-white/55">
                    {t('pages.home.input-hint')}
                </p>
            </div>

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                disabled={!isValid}
                loading={isPending}
                icon={<ArrowRight size={20} />}
                iconPosition="end"
                className="!h-14 !text-lg"
            >
                {t('pages.home.submit')}
            </Button>
        </form>
    );
}

export default ScienceIdForm;
