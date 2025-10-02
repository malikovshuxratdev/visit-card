import { useNavigate } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';

function CameraPage() {
    const navigate = useNavigate();

    const handleImageCaptured = (imageData: string) => {
        navigate('/generator', { state: { capturedImage: imageData } });
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <CameraCapture
            onImageCaptured={handleImageCaptured}
            onCancel={handleCancel}
        />
    );
}

export default CameraPage;
