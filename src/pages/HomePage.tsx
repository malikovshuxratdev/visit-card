import { Card, Button, Typography } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FrontCard from '../components/FrontCard';
import BackCard from '../components/BackCard';

const { Title, Text } = Typography;

function HomePage() {
    const navigate = useNavigate();

    const handleGetVisitCard = () => {
        navigate('/camera');
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <Card className="glass-card border-0 shadow-xl p-6">
                        <div className="text-center">
                            <div className="space-y-6">
                                {/* <FrontCard />
                                <BackCard /> */}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="glass-card border-0 shadow-xl p-6">
                        <Title level={3} className="!mb-2">
                            Qanday ishlaydi
                        </Title>
                        <Text className="block !mb-4 opacity-80">
                            Bir necha oddiy qadamda shaxsiy kartangizni oling.
                        </Text>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">
                                        1
                                    </span>
                                </div>
                                <Text>"Visit Card Olish" tugmasini bosing</Text>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">
                                        2
                                    </span>
                                </div>
                                <Text>
                                    Yuzingizni kameraning ramkasida
                                    joylashtiring
                                </Text>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">
                                        3
                                    </span>
                                </div>
                                <Text>
                                    To'g'ri joylashganda rasm avtomatik olinadi
                                </Text>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">
                                        4
                                    </span>
                                </div>
                                <Text>Kartangizni oling</Text>
                            </div>
                        </div>
                    </Card>
                    <div className="text-center">
                        <Button
                            type="primary"
                            size="large"
                            icon={<CameraOutlined />}
                            onClick={handleGetVisitCard}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg text-lg px-8 py-4 h-auto"
                        >
                            Visit Card Olish
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
