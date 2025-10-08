import React from 'react';

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
                <div className="w-24 h-24 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
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
