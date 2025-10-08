import React, { useState } from 'react';
import { Button, Input, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import innovation from '../assets/icons/innovation.svg';

const { Text } = Typography;

const ScienceId: React.FC = () => {
    const navigate = useNavigate();
    const [scienceId, setScienceId] = useState('');
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
        setIsValid(formatScienceId(e.target.value).length === 13);
    };

    const handleContinue = () => {
        if (formatScienceId(scienceId)) {
            navigate('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isValid) {
            handleContinue();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-full space-y-4 px-10">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <img
                            src={innovation}
                            className="w-[5   0px] h-[50px]"
                        />
                    </div>
                    <Text className="text-white/90 text-2xl font-medium">
                        Science Card yaratish uchun <br /> Science ID
                        raqamingizni kiriting
                    </Text>
                </div>

                <div className="mt-2">
                    <div className="mb-2">
                        <Input
                            size="large"
                            placeholder="BTV-0001-0001"
                            value={scienceId}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            maxLength={13}
                            className={`text-center text-xl font-mono ${
                                isValid
                                    ? 'border-green-500 border-2'
                                    : 'border-white/30'
                            }`}
                            style={{
                                height: '60px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            }}
                        />
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Space size="large" direction="vertical" className="w-full">
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleContinue}
                            disabled={!isValid}
                            className={`text-lg px-10 py-6 h-auto w-full ${
                                isValid
                                    ? 'bg-gradient-to-r from-green-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl'
                                    : 'bg-gray-400'
                            }`}
                        >
                            {isValid ? '✅ Davom Etish' : 'Davom Etish'}
                        </Button>
                    </Space>
                </div>

                <div className="mt-6 text-center">
                    <h2 className="text-center mb-4 text-white text-2xl font-bold drop-shadow-md">
                        Science ID yo'qmi?
                    </h2>
                </div>
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-[120px] h-[120px] bg-white rounded-2xl shadow-lg p-2 border-2 border-gray-200 flex items-center justify-center relative hover:shadow-xl transition-shadow">
                            <QRCodeSVG
                                value={`https://id.ilmiy.uz`}
                                size={110}
                                level="M"
                                includeMargin={false}
                            />
                            <img
                                src={innovation}
                                alt="Innovation"
                                className="w-[35px] h-[35px] absolute bottom-[40px] rounded-full right-[40px] bg-white shadow-md border-2 border-white"
                            />
                        </div>
                    </div>
                    <h2 className="text-center text-white text-xl font-bold drop-shadow-md mt-4">
                        QR kod skaner qiling va Science ID raqamingizni <br />{' '}
                        bilib oling
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default ScienceId;
