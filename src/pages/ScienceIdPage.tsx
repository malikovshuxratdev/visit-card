import React, { useState } from 'react';
import { Card, Button, Input, Alert, Typography, Space, Divider } from 'antd';
import {
    ArrowLeftOutlined,
    QrcodeOutlined,
    LinkOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const ScienceIdPage: React.FC = () => {
    const navigate = useNavigate();
    const [scienceId, setScienceId] = useState('');
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    const formatScienceId = (value: string) => {
        value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        let letters = value.slice(0, 3).replace(/[^A-Z]/g, '');
        let numbers = value.slice(3).replace(/[^0-9]/g, '');
        if (numbers.length > 8) numbers = numbers.slice(0, 8);
        let formatted = letters;
        if (numbers.length > 0) {
            formatted += '-' + numbers.slice(0, 4);
        }
        if (numbers.length > 4) {
            formatted += '-' + numbers.slice(4, 8);
        }
        return formatted;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScienceId(formatScienceId(e.target.value));
        setError('');
        setIsValid(formatScienceId(e.target.value).length === 13);
    };

    const handleContinue = () => {
        if (formatScienceId(scienceId)) {
            // Store Science ID in localStorage or pass as state
            localStorage.setItem('scienceId', scienceId);
            navigate('/camera');
        } else {
            setError(
                "Science ID formati noto'g'ri. BTV-0001-0001 formatida kiriting."
            );
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isValid) {
            handleContinue();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="max-w-2xl mx-auto w-full px-4">
                <Card className="glass-card border-0 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
                                <CheckCircleOutlined className="text-3xl text-white" />
                            </div>
                            <Title level={2} className="mb-2">
                                Science ID Kiriting
                            </Title>
                            <Text className="text-gray-600 text-lg">
                                Visiting karta yaratish uchun Science ID
                                raqamingizni kiriting
                            </Text>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="mb-4">
                            <Text strong className="text-lg block mb-2">
                                Science ID Format:
                            </Text>
                            <Input
                                size="large"
                                placeholder="BTV-0001-0001"
                                value={scienceId}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                maxLength={13}
                                className={`text-center text-xl font-mono ${
                                    isValid ? 'border-green-500' : ''
                                }`}
                                style={{ height: '60px' }}
                            />
                            {isValid && (
                                <div className="text-center mt-2">
                                    <Text className="text-green-600">
                                        ✅ Science ID formati to'g'ri
                                    </Text>
                                </div>
                            )}
                            {error && (
                                <Alert
                                    message={error}
                                    type="error"
                                    showIcon
                                    className="mt-4"
                                />
                            )}
                        </div>
                    </div>

                    <Divider />

                    <div className="mb-8">
                        <Title level={4} className="text-center mb-4">
                            Science ID yo'qmi?
                        </Title>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <LinkOutlined className="text-2xl text-blue-600" />
                                    </div>
                                    <Text strong className="block mb-2">
                                        id.ilmiy.uz
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        Saytga tashrif buyuring va Science ID
                                        oling
                                    </Text>
                                    <Button
                                        type="link"
                                        className="mt-2"
                                        onClick={() =>
                                            window.open(
                                                'https://id.ilmiy.uz',
                                                '_blank'
                                            )
                                        }
                                    >
                                        Saytga o'tish
                                    </Button>
                                </div>
                            </Card>

                            <Card className="border border-green-200 hover:border-green-400 transition-colors cursor-pointer">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <QrcodeOutlined className="text-2xl text-green-600" />
                                    </div>
                                    <Text strong className="block mb-2">
                                        QR Kod
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        QR kod skaner qiling va Science ID
                                        raqamingizni bilib oling
                                    </Text>
                                    <Button
                                        type="link"
                                        className="mt-2"
                                        onClick={() => {
                                            // QR scanner functionality can be added here
                                            alert(
                                                "QR kod skaner funksiyasi keyingi versiyada qo'shiladi"
                                            );
                                        }}
                                    >
                                        QR skaner
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="text-center">
                        <Space size="large">
                            <Button
                                size="large"
                                onClick={() => navigate('/')}
                                icon={<ArrowLeftOutlined />}
                                className="text-lg px-8 py-4 h-auto"
                            >
                                Orqaga Qaytish
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleContinue}
                                disabled={!isValid}
                                className={`text-lg px-8 py-4 h-auto ${
                                    isValid
                                        ? 'bg-gradient-to-r from-green-500 to-blue-600 border-0 shadow-lg'
                                        : ''
                                }`}
                            >
                                {isValid
                                    ? '✅ Davom Etish'
                                    : 'Science ID Kiriting'}
                            </Button>
                        </Space>
                    </div>

                    <div className="mt-6 text-center">
                        <Paragraph className="text-gray-500 text-sm">
                            Science ID raqamingiz xavfsiz saqlanadi va faqat
                            visiting karta yaratish uchun ishlatiladi
                        </Paragraph>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ScienceIdPage;
