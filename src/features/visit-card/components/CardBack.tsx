import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import backCardImage from '@/assets/images/backImage.png';
import emailIcon from '@/assets/icons/email.svg';
import innovationIcon from '@/assets/icons/innovation.svg';
import websiteIcon from '@/assets/icons/internet.svg';
import phoneIcon from '@/assets/icons/phone.svg';
import { CARD_HEIGHT, CARD_WIDTH } from '@/features/visit-card/constants';
import { SCIENCE_ID_URL } from '@/shared/constants';
import type { Profile } from '@/shared/types';
import { formatPhone } from '@/shared/utils/format';

type CardBackProps = {
    profile: Profile;
};

export const CardBack = forwardRef<HTMLDivElement, CardBackProps>(
    ({ profile }, ref) => {
        const { t } = useTranslation();
        const phone = formatPhone(profile.phone_number);
        /** The QR always links to the Science ID platform home page. */
        const qrValue = SCIENCE_ID_URL;

        const contacts = [
            { icon: phoneIcon, value: phone },
            { icon: emailIcon, value: profile.email },
            { icon: websiteIcon, value: SCIENCE_ID_URL },
        ].filter((item) => item.value);

        return (
            <div
                ref={ref}
                className="relative overflow-hidden rounded-[8px] bg-white font-card text-black"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
                <img
                    src={backCardImage}
                    alt=""
                    className="absolute inset-0 h-full w-full"
                    draggable={false}
                />

                <div className="absolute inset-0 flex flex-col pl-[20px] pt-[48px]">
                    <p className="w-[360px] text-[20px] font-medium leading-[28px] text-black">
                        {t('components.card.back-description')}
                    </p>

                    <div className="mt-[16px] flex items-center">
                        <div className="relative flex h-[110px] w-[110px] shrink-0 items-center justify-center border-2 border-gray-300 bg-white">
                            <QRCodeSVG
                                value={qrValue}
                                size={106}
                                level="M"
                                fgColor="#000000"
                                bgColor="#ffffff"
                            />
                            <img
                                src={innovationIcon}
                                alt=""
                                className="absolute left-1/2 top-1/2 h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                            />
                        </div>

                        <ul className="ml-[20px] flex min-w-0 flex-col gap-[10px]">
                            {contacts.map((item) => (
                                <li
                                    key={item.icon}
                                    className="flex items-center"
                                >
                                    <img
                                        src={item.icon}
                                        alt=""
                                        className="h-[20px] w-[20px] shrink-0"
                                    />
                                    <span className="ml-[8px] truncate text-[16px] font-medium text-black">
                                        {item.value}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
);

CardBack.displayName = 'CardBack';

export default CardBack;
