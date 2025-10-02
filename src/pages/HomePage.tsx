import { Card, Button, Typography } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FrontCard from '../assets/images/front.png';
import BackCard from '../assets/images/back.png';

const { Title, Text } = Typography;

function HomePage() {
    const navigate = useNavigate();

    const handleGetVisitCard = () => {
        navigate('/camera');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
                <Card className="glass-card border-0 shadow-xl">
                    <div className="text-center">
                        <div className="space-y-4">
                            {/* Front Side */}
                            <div
                                className=" mx-auto"
                                style={{
                                    width: '450px',
                                    height: '280px',
                                }}
                            >
                                <img src={FrontCard} alt="Front Card" />
                            </div>

                            {/* Back Side */}
                            <div
                                className=" mx-auto"
                                style={{
                                    width: '450px',
                                    height: '280px',
                                }}
                            >
                                <img src={BackCard} alt="Back Card" />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                <Card className="glass-card border-0 shadow-xl">
                    <Title level={3} className="!mb-4">
                        Qanday ishlaydi
                    </Title>
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
                                Yuzingizni kameraning ramkasida joylashtiring
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
    );
}

export default HomePage;
