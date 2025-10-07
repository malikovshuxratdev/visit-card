import { QRCodeSVG } from 'qrcode.react';
import backCardImage from '../assets/images/backImage.svg';
import innovation from '../assets/icons/innovation.svg';
import phone from '../assets/icons/phone.svg';
import email from '../assets/icons/email.svg';
import website from '../assets/icons/internet.svg';

function BackCard() {
    return (
        <div className="relative rounded-[8px] w-[450px] h-[280px] overflow-hidden">
            <img
                src={backCardImage}
                alt="Back Card"
                className="w-[450px] h-[280px]"
            />
            <div className="w-[450px] h-[280px] absolute top-0 left-0 flex flex-col ml-[20px]">
                <div className="mt-[48px]">
                    <div className="font-medium text-[18px] text-[#212121] w-[360px]">
                        Ilmiy-innovatsion faoliyat bilan shug’ullanuvchi
                        jismoniy shaxslarni identifikatori
                    </div>
                    <div className="flex items-center mt-[16px]">
                        <div className="w-[110px] h-[110px] bg-white border-2 border-gray-300 flex items-center justify-center relative">
                            <QRCodeSVG
                                value={`https://id.ilmiy.uz`}
                                size={110}
                                level="M"
                                includeMargin={false}
                            />
                            <img
                                src={innovation}
                                alt="Innovation"
                                className="w-[30px] h-[30px] absolute bottom-[42px] rounded-full right-[42px] bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-[10px] ml-[20px]">
                            <div className="flex items-center">
                                <img
                                    src={phone}
                                    alt="Phone"
                                    className="w-[20px] h-[20px]"
                                />
                                <div className="text-[16px] font-medium text-[#212121] ml-[8px]">
                                    +998901234567
                                </div>
                            </div>
                            <div className="flex items-center">
                                <img
                                    src={email}
                                    alt="Email"
                                    className="w-[20px] h-[20px]"
                                />
                                <div className="text-[16px] font-medium text-[#212121] ml-[8px]">
                                    example@gmail.com
                                </div>
                            </div>
                            <div className="flex items-center">
                                <img
                                    src={website}
                                    alt="Website"
                                    className="w-[20px] h-[20px]"
                                />
                                <div className="text-[16px] font-medium text-[#212121] ml-[8px]">
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
