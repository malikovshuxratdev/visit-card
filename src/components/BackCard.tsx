import { QRCodeSVG } from 'qrcode.react';
import backCardImage from '../assets/images/backImage.svg';
import innovation from '../assets/icons/innovation.svg';
import phone from '../assets/icons/phone.svg';
import email from '../assets/icons/email.svg';
import website from '../assets/icons/internet.svg';

function BackCard() {
    return (
        <div className="relative rounded-[8px] w-[400px] h-[250px] overflow-hidden">
            <img
                src={backCardImage}
                alt="Back Card"
                className="w-[400px] h-[250px]"
            />
            <div className="w-[400px] h-[250px] absolute top-0 left-0 flex flex-col ml-[16px]">
                <div className="mt-[40px]">
                    <div className="font-medium text-[14px] text-[#212121] w-[310px]">
                        Ilmiy-innovatsion faoliyat bilan <br /> shug'ullanuvchi
                        jismoniy shaxslarni <br /> identifikatori
                    </div>
                    <div className="flex items-center mt-[12px]">
                        <div className="w-[95px] h-[95px] bg-white border-2 border-gray-300 flex items-center justify-center relative">
                            <QRCodeSVG
                                value={`https://id.ilmiy.uz`}
                                size={95}
                                level="M"
                                includeMargin={false}
                            />
                            <img
                                src={innovation}
                                alt="Innovation"
                                className="w-[24px] h-[24px] absolute bottom-[36px] rounded-full right-[36px] bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-[8px] ml-[16px]">
                            <div className="flex items-center">
                                <img
                                    src={phone}
                                    alt="Phone"
                                    className="w-[16px] h-[16px]"
                                />
                                <div className="text-[13px] font-medium text-[#212121] ml-[6px]">
                                    +998901234567
                                </div>
                            </div>
                            <div className="flex items-center">
                                <img
                                    src={email}
                                    alt="Email"
                                    className="w-[16px] h-[16px]"
                                />
                                <div className="text-[13px] font-medium text-[#212121] ml-[6px]">
                                    example@gmail.com
                                </div>
                            </div>
                            <div className="flex items-center">
                                <img
                                    src={website}
                                    alt="Website"
                                    className="w-[16px] h-[16px]"
                                />
                                <div className="text-[13px] font-medium text-[#212121] ml-[6px]">
                                    https://id.ilmiy.uz
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BackCard;
