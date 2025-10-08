import { Card, Button, Typography } from 'antd';
import {
    CameraOutlined,
    ArrowRightOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FrontCard from '../components/FrontCard';
import BackCard from '../components/BackCard';

const { Title, Text } = Typography;

function HomePage() {
    const navigate = useNavigate();

    const handleGetVisitCard = () => {
        navigate('/camera');
    };

    const steps = [
        {
            number: 1,
            title: 'Visit Card Olish tugmasini bosing',
            description: 'Boshlash uchun tugmani bosing',
            icon: <CameraOutlined className="text-blue-600" />,
        },
        {
            number: 2,
            title: 'Yuzingizni kameraning ramkasida joylashtiring',
            description: "Yuzingizni to'g'ri joylashtiring",
            icon: <CheckCircleOutlined className="text-green-600" />,
        },
        {
            number: 3,
            title: "To'g'ri joylashganda rasm avtomatik olinadi",
            description: 'Avtomatik surat olish jarayoni',
            icon: <ArrowRightOutlined className="text-purple-600" />,
        },
        {
            number: 4,
            title: 'Kartangizni oling',
            description: 'Tayyor karta bilan tanishing',
            icon: <CheckCircleOutlined className="text-emerald-600" />,
        },
    ];

    return (
        <div className="mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
                <Card className="flex items-center justify-center border-0 shadow-2xl">
                    <div className="space-y-8">
                        <FrontCard />
                        <BackCard />
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card className="border-0 shadow-2xl">
                        <div className="text-center mb-8">
                            <Title level={3} className="text-gray-800">
                                🚀 Qanday ishlaydi
                            </Title>
                            <Text className="text-gray-600 text-base">
                                Faqat 4 oddiy qadamda kartangiz tayyor!
                            </Text>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <div key={index} className="group relative">
                                    <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-lg">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                                <span className="text-white font-bold text-lg">
                                                    {step.number}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center space-x-2 mb-1">
                                                {step.icon}
                                                <Text className="font-semibold text-gray-800 text-base">
                                                    {step.title}
                                                </Text>
                                            </div>
                                            <Text className="text-gray-600 text-sm">
                                                {step.description}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* CTA Button */}
                    <div className="text-center">
                        <Button
                            type="primary"
                            size="large"
                            icon={<CameraOutlined />}
                            onClick={handleGetVisitCard}
                            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 border-0 shadow-2xl text-lg px-12 py-6 h-auto rounded-full hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-semibold"
                            style={{
                                backgroundSize: '200% 200%',
                                animation: 'gradientShift 3s ease infinite',
                            }}
                        >
                            <span className="flex items-center space-x-3">
                                <span> Visit Card Olish</span>
                                <ArrowRightOutlined className="animate-pulse" />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
