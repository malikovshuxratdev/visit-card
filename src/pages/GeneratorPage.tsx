import React, { useRef, useState } from 'react';
import { Button, Space } from 'antd';
import { PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import frontCardImage from '../assets/images/frontImage.svg';
import backCardImage from '../assets/images/backImage.svg';
import verify from '../assets/icons/verify.svg';
import defaultAvatar from '../assets/images/default-avatar.png';
import phone from '../assets/icons/phone.svg';
import email from '../assets/icons/email.svg';
import website from '../assets/icons/internet.svg';
import innovation from '../assets/icons/innovation.svg';
import { useNavigate } from 'react-router-dom';
import PrintPreviewModal from '../components/PrintPreviewModal';

const GeneratorPage: React.FC = () => {
    const frontCardRef = useRef<HTMLDivElement>(null);
    const backCardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [frontImage, setFrontImage] = useState<string>();
    const [backImage, setBackImage] = useState<string>();

    const handleStartOver = () => {
        navigate('/');
    };

    const toPng = async (ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        return await htmlToImage.toPng(ref.current, {
            cacheBust: true,
            pixelRatio: 2,
            width: rect.width,
            height: rect.height,
            style: { margin: '0' },
        });
    };

    // Modalni ochish
    const handleOpenPrintPreview = async () => {
        const frontUrl = await toPng(frontCardRef);
        const backUrl = await toPng(backCardRef);
        setFrontImage(frontUrl);
        setBackImage(backUrl);
        setIsModalOpen(true);
    };

    return (
        <div className="mx-auto">
            <div className="flex flex-col items-center space-y-8">
                {/* Front Card */}
                <div
                    ref={frontCardRef}
                    className="relative rounded-[8px] w-[450px] h-[280px] overflow-hidden"
                >
                    <img
                        src={frontCardImage}
                        alt="Front Card"
                        className="w-[450px] h-[280px]"
                    />
                    <div className="w-[450px] h-[280px] absolute top-0 left-0 flex flex-col ml-[10px]">
                        {/* Science ID */}
                        <div className="mt-[70px]">
                            <div className="bg-[#8DAAD433] rounded-md p-1 w-[170px] flex items-center justify-center">
                                <div className="italic text-[11px] text-[#535862]">
                                    Science ID:
                                </div>
                                <div className="text-[11px] font-semibold ml-1 text-[#000]">
                                    BNV-0125-0002
                                </div>
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex items-center mt-[8px]">
                            <div className="flex items-center justify-center">
                                <div className="border border-[#6D88B1] rounded-[2px] w-[114px] h-[148px] flex items-center justify-center relative">
                                    <img
                                        src={defaultAvatar}
                                        className="w-[112px] h-[146px] object-cover rounded-[2px]"
                                        alt="Avatar"
                                    />
                                    <img
                                        src={verify}
                                        className="w-[14px] h-[14px] absolute bottom-[8px] right-[4px]"
                                        alt="Verify"
                                    />
                                </div>
                                <div className="flex flex-col ml-[12px]">
                                    <div className="flex flex-col">
                                        <div className="text-[10px] text-[#535862] italic">
                                            Familiyasi
                                        </div>
                                        <div className="text-[11px] font-medium text-[#000]">
                                            ISLOMOV
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[10px] text-[#535862] italic">
                                            Ismi
                                        </div>
                                        <div className="text-[11px] font-medium text-[#000]">
                                            DUSTMUROD
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[10px] text-[#535862] italic">
                                            Otasining ismi
                                        </div>
                                        <div className="text-[11px] font-medium text-[#000]">
                                            G'AYBULLA O'G'LI
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[10px] text-[#535862] italic">
                                            Ilmiy darajasi
                                        </div>
                                        <div className="text-[11px] font-medium text-[#000]">
                                            PHD
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[10px] text-[#535862] italic">
                                            Ilmiy unvoni
                                        </div>
                                        <div className="text-[11px] font-medium text-[#000]">
                                            Yo'q
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col ml-[35px] mt-[-35px]">
                                <div className="flex flex-col">
                                    <div className="text-[10px] text-[#535862] italic">
                                        Tug'ilgan sanasi
                                    </div>
                                    <div className="text-[11px] font-medium text-[#000]">
                                        22.02.1999
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[10px] text-[#535862] italic">
                                        Ro'yxatdan o'tgan sana
                                    </div>
                                    <div className="text-[11px] font-medium text-[#000]">
                                        22.02.2025
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Card */}
                <div
                    ref={backCardRef}
                    className="relative rounded-[8px] w-[450px] h-[280px] overflow-hidden"
                >
                    <img
                        src={backCardImage}
                        alt="Back Card"
                        className="w-[450px] h-[280px]"
                    />
                    <div className="w-[450px] h-[280px] absolute top-0 left-0 flex flex-col ml-[10px]">
                        <div className="mt-[48px]">
                            <div className="font-medium text-[18px] text-[#212121] w-[360px]">
                                Ilmiy-innovatsion faoliyat bilan shug’ullanuvchi
                                jismoniy shaxslarni identifikatori
                            </div>
                            <div className="flex items-center mt-[16px]">
                                {/* Qr code*/}
                                <div className="w-[110px] h-[110px] bg-white border-2 border-gray-300 flex items-center justify-center relative">
                                    <QRCodeSVG
                                        value="BNV-0125-0002"
                                        size={110}
                                        level="M"
                                        includeMargin={false}
                                    />
                                    <img
                                        src={innovation}
                                        alt="Innovation"
                                        className="w-[26px] h-[26px] absolute bottom-[38px] right-[38px] bg-white"
                                    />
                                </div>

                                {/* Social media */}
                                <div className="flex flex-col gap-[10px] ml-[20px]">
                                    <div className="flex items-center">
                                        <img
                                            src={phone}
                                            alt="Phone"
                                            className="w-[16px] h-[16px]"
                                        />
                                        <div className="text-[12px] font-medium text-[#212121] ml-[8px]">
                                            +998 99 123 45 67
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            src={email}
                                            alt="Email"
                                            className="w-[16px] h-[16px]"
                                        />
                                        <div className="text-[12px] font-medium text-[#212121] ml-[8px]">
                                            mobiledeveloper@gmail.com
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            src={website}
                                            alt="Website"
                                            className="w-[16px] h-[16px]"
                                        />
                                        <div className="text-[12px] font-medium text-[#212121] ml-[8px]">
                                            https://id.ilmiy.uz
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="text-center mt-8">
                <Space size="large">
                    <Button
                        type="primary"
                        size="large"
                        icon={<PrinterOutlined />}
                        onClick={handleOpenPrintPreview}
                    >
                        Chop etish
                    </Button>
                    <Button
                        size="large"
                        onClick={handleStartOver}
                        icon={<ReloadOutlined />}
                    >
                        Boshiga Qaytarish
                    </Button>
                </Space>
            </div>

            {/* Modal */}
            <PrintPreviewModal
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                frontImage={frontImage}
                backImage={backImage}
            />
        </div>
    );
};

export default GeneratorPage;
