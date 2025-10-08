import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ScienceIdComponent from '../components/ScienceIdComponent';

const ScienceIdPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Back Button */}
                <div className="mb-4">
                    <Button
                        size="large"
                        onClick={() => navigate('/')}
                        icon={<ArrowLeftOutlined />}
                        className="shadow-lg"
                    >
                        Orqaga
                    </Button>
                </div>

                {/* Main Card */}
                <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/30">
                    <ScienceIdComponent />
                </div>
            </div>
        </div>
    );
};

export default ScienceIdPage;
