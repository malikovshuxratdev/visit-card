import { Button } from 'antd';
import face from '../assets/images/face.jpg';
import faceId from '../assets/images/faceId.jpg';
import { useNavigate } from 'react-router-dom';

const ScienceIdInfo = () => {
    const navigate = useNavigate();

    const handleFaceScan = () => {
        navigate('/camera');
    };

    return (
        <div className="w-full h-full flex flex-col justify-between space-y-4">
            {/* Face orqali Science Card chiqarish */}
            <div className="flex flex-col items-center">
                <img
                    src={face}
                    alt="face"
                    className="w-[280px] h-auto mb-3 rounded-2xl shadow-lg"
                />
                <Button
                    type="primary"
                    size="large"
                    className="bg-gradient-to-r from-green-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl w-[280px] text-lg  py-3 h-auto"
                    onClick={handleFaceScan}
                >
                    Face Scan
                </Button>
            </div>

            {/* Science ID va Face orqali Science Card yaratish */}
            <div className="flex flex-col items-center">
                <img
                    src={faceId}
                    alt="faceId"
                    className="w-[280px] h-auto mb-3 rounded-2xl shadow-lg"
                />
                <Button
                    type="primary"
                    size="large"
                    className="bg-gradient-to-r from-green-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl w-[280px] text-lg py-3 h-auto"
                >
                    Science ID + Face Scan
                </Button>
            </div>
        </div>
    );
};

export default ScienceIdInfo;
