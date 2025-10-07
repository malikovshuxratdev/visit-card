import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface FullPageLoadingProps {
    message?: string;
    subMessage?: string;
}

const FullPageLoading: React.FC<FullPageLoadingProps> = ({
    message = 'Tayyorlanmoqda...',
    subMessage = 'Kartani chop etish jarayoni davom etmoqda',
}) => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <Spin
                    indicator={
                        <LoadingOutlined style={{ fontSize: 64 }} spin />
                    }
                    size="large"
                />
                <div className="text-2xl font-medium text-gray-700 text-center">
                    {message}
                </div>
                <div className="text-base text-gray-500 text-center max-w-md">
                    {subMessage}
                </div>
            </div>
        </div>
    );
};

export default FullPageLoading;
