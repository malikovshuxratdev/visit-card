import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import frontCardImage from '@/assets/images/frontImage.png';
import defaultAvatar from '@/assets/images/default-avatar.png';
import verifyIcon from '@/assets/icons/verify.svg';
import { CARD_HEIGHT, CARD_WIDTH } from '@/features/visit-card/constants';
import type { Profile } from '@/shared/types';
import { formatDate } from '@/shared/utils/date';
import CardField from './CardField';

type CardFrontProps = {
    profile: Profile;
};

export const CardFront = forwardRef<HTMLDivElement, CardFrontProps>(
    ({ profile }, ref) => {
        const { t } = useTranslation();
        const [photoFailed, setPhotoFailed] = useState(false);
        const empty = t('common.not-available');
        const photo = !photoFailed && profile.photo ? profile.photo : defaultAvatar;

        return (
            <div
                ref={ref}
                className="relative overflow-hidden rounded-[8px] bg-white font-card text-black"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
                <img
                    src={frontCardImage}
                    alt=""
                    className="absolute inset-0 h-full w-full"
                    draggable={false}
                />

                <div className="absolute inset-0 flex flex-col pl-[15px]">
                    <div className="mt-[65px]">
                        <div className="inline-flex items-center rounded-md bg-[#8DAAD433] p-1">
                            <span className="whitespace-nowrap text-[11px] italic text-black">
                                {t('components.card.science-id')}
                            </span>
                            <span className="ml-1 whitespace-nowrap text-[12px] font-semibold text-black">
                                {profile.science_id}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="relative flex h-[148px] w-[114px] shrink-0 items-center justify-center rounded-[2px] border border-[#6D88B1]">
                            <img
                                src={photo}
                                alt={t('components.card.avatar-alt')}
                                onError={() => setPhotoFailed(true)}
                                className="h-[146px] w-[112px] rounded-[2px] object-cover"
                                draggable={false}
                            />
                            <img
                                src={verifyIcon}
                                alt={t('components.card.verified-alt')}
                                className="absolute bottom-[8px] right-[4px] h-[14px] w-[14px]"
                            />
                        </div>

                        <div className="ml-[12px] flex min-w-0 flex-col">
                            <CardField
                                label={t('components.card.surname')}
                                value={profile.sur_name || empty}
                            />
                            <CardField
                                label={t('components.card.first-name')}
                                value={profile.first_name || empty}
                            />
                            <CardField
                                label={t('components.card.middle-name')}
                                value={profile.mid_name || empty}
                            />
                            <CardField
                                label={t('components.card.degree')}
                                value={profile.degree_name || empty}
                            />
                            <CardField
                                label={t('components.card.academic-title')}
                                value={profile.title || empty}
                            />
                        </div>

                        <div className="ml-[35px] mt-[-35px] flex flex-col">
                            <CardField
                                label={t('components.card.birth-date')}
                                value={formatDate(profile.birth_date, empty)}
                            />
                            <CardField
                                label={t('components.card.registered-at')}
                                value={formatDate(profile.registered_at, empty)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

CardFront.displayName = 'CardFront';

export default CardFront;
