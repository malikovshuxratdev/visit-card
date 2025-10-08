import React, { useRef, useState, useEffect } from 'react';
import { Button, Space, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
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
import { useNavigate, useParams } from 'react-router-dom';
import PrintPreviewModal from '../components/PrintPreviewModal';
import FullPageLoading from '../components/FullPageLoading';
import { useGetUserQuery } from '../hooks/useVisitCard';
import moment from 'moment';

const GeneratorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const frontCardRef = useRef<HTMLDivElement>(null);
    const backCardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { data, isLoading } = useGetUserQuery(id!);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [frontImage, setFrontImage] = useState<string>();
    const [backImage, setBackImage] = useState<string>();
    const [isImagesLoading, setIsImagesLoading] = useState(true);
    const [isGeneratingPng, setIsGeneratingPng] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    const handleStartOver = () => {
        navigate('/');
    };

    const handlePrintStart = () => {
        setIsPrinting(true);
        setIsModalOpen(false);

        // 40 seconds loading, then navigate to home page
        setTimeout(() => {
            setIsPrinting(false);
            navigate('/');
        }, 45000);
    };

    // SVG rasmlar yuklash holatini kuzatish
    useEffect(() => {
        const frontImg = new Image();
        const backImg = new Image();
        let loadedCount = 0;

        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount === 2) {
                setIsImagesLoading(false);
            }
        };

        frontImg.onload = checkAllLoaded;
        backImg.onload = checkAllLoaded;

        frontImg.src = frontCardImage;
        backImg.src = backCardImage;
    }, []);

    const toPng = async (ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const scale = 2; // render at a much higher DPI for maximum PNG sharpness
        return await htmlToImage.toPng(ref.current, {
            cacheBust: true,
            pixelRatio: scale,
            width: rect.width,
            height: rect.height,
            canvasWidth: rect.width * scale,
            canvasHeight: rect.height * scale,
            backgroundColor: '#ffffff',
            style: { margin: '0' },
        });
    };

    // Modalni ochish
    const handleOpenPrintPreview = async () => {
        setIsGeneratingPng(true);
        try {
            const frontUrl = await toPng(frontCardRef);
            const backUrl = await toPng(backCardRef);
            setFrontImage(frontUrl);
            setBackImage(backUrl);
            setIsModalOpen(true);
        } catch (error) {
            console.error('PNG yaratishda xatolik:', error);
        } finally {
            setIsGeneratingPng(false);
        }
    };

    if (isPrinting) {
        return <FullPageLoading />;
    }

    if (isLoading || isImagesLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4">
                <Spin size="large" />
                <div className="text-lg text-gray-600">
                    {isLoading
                        ? "Ma'lumotlar yuklanmoqda..."
                        : 'Visit card yuklanmoqda...'}
                </div>
            </div>
        );
    }

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
                    <div className="w-[450px] h-[280px] absolute top-0 left-0 flex flex-col ml-[15px]">
                        {/* Science ID */}
                        <div className="mt-[65px]">
                            <div className="bg-[#8DAAD433] rounded-md p-1 inline-flex items-center justify-center">
                                <div className="italic text-[11px] text-[#2b2e33] whitespace-nowrap">
                                    Science ID:
                                </div>
                                <div className="text-[12px] font-semibold ml-1 text-[#000] whitespace-nowrap">
                                    {data?.profile?.science_id}
                                </div>
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex items-center mt-[px]">
                            <div className="flex items-center justify-center">
                                <div className="border border-[#6D88B1] rounded-[2px] w-[114px] h-[148px] flex items-center justify-center relative">
                                    <img
                                        src={
                                            data?.profile?.photo ??
                                            defaultAvatar
                                        }
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
                                        <div className="text-[11px] text-[#2b2e33] italic">
                                            Familiyasi
                                        </div>
                                        <div className="text-[12px] font-semibold text-[#000]">
                                            {data?.profile?.sur_name}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[11px] text-[#2b2e33] italic">
                                            Ismi
                                        </div>
                                        <div className="text-[12px] font-semibold text-[#000]">
                                            {data?.profile?.first_name}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[11px] text-[#2b2e33] italic">
                                            Otasining ismi
                                        </div>
                                        <div className="text-[12px] font-semibold text-[#000]">
                                            {data?.profile?.mid_name}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[11px] text-[#2b2e33] italic">
                                            Ilmiy darajasi
                                        </div>
                                        <div className="text-[12px] font-semibold text-[#000]">
                                            {data?.profile?.degree_name ??
                                                "Yo'q"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[11px] text-[#2b2e33] italic">
                                            Ilmiy unvoni
                                        </div>
                                        <div className="text-[12px] font-semibold text-[#000]">
                                            {data?.profile?.title ?? "Yo'q"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col ml-[35px] mt-[-35px]">
                                <div className="flex flex-col">
                                    <div className="text-[11px] text-[#535862] italic">
                                        Tug'ilgan sanasi
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#000]">
                                        {moment(
                                            data?.profile?.birth_date
                                        ).format('DD.MM.YYYY') ?? "Yo'q"}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[11px] text-[#535862] italic">
                                        Ro'yxatdan o'tgan sana
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#000]">
                                        {moment(
                                            data?.profile?.registered_at
                                        ).format('DD.MM.YYYY') ?? "Yo'q"}
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
                    <div className="w-[450px] h-[280px] absolute top-0 left-0 flex flex-col ml-[20px]">
                        <div className="mt-[48px]">
                            <div className="font-medium text-[18px] text-[#212121] w-[360px]">
                                Ilmiy-innovatsion faoliyat bilan shug’ullanuvchi
                                jismoniy shaxslarni identifikatori
                            </div>
                            <div className="flex items-center mt-[16px]">
                                <div className="w-[110px] h-[110px] bg-white border-2 border-gray-300 flex items-center justify-center relative">
                                    <QRCodeSVG
                                        value={`https://id.ilmiy.uz/user/card/${data?.profile?.science_id}`}
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
                                            +{data?.profile?.phone_number}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            src={email}
                                            alt="Email"
                                            className="w-[20px] h-[20px]"
                                        />
                                        <div className="text-[16px] font-medium text-[#212121] ml-[8px]">
                                            {data?.profile?.email}
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
            </div>

            {/* Buttons */}
            <div className="text-center mt-8">
                <Space size="large">
                    <Button
                        size="large"
                        onClick={handleStartOver}
                        icon={<ReloadOutlined />}
                        className=" text-lg px-4 py-2 h-auto"
                    >
                        Boshiga Qaytarish
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleOpenPrintPreview}
                        className="border-0 text-lg px-4 py-2 h-auto"
                        loading={isGeneratingPng}
                        disabled={isGeneratingPng}
                    >
                        {isGeneratingPng
                            ? 'Tayyorlanmoqda...'
                            : 'Printerga yuborish'}
                    </Button>
                </Space>
            </div>

            {/* Modal */}
            <PrintPreviewModal
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                frontImage={frontImage}
                backImage={backImage}
                onPrintStart={handlePrintStart}
            />
        </div>
    );
};

export default GeneratorPage;
