
import face from '../assets/images/face.jpg';
import faceId from '../assets/images/faceId.jpg';

const ScienceIdInfo = () => {

    return (
        <div className="w-full h-full flex flex-col justify-between space-y-4">
            <div className="flex flex-col items-center">
                <img
                    src={face}
                    alt="face"
                    className="w-[280px] h-auto mb-3 rounded-2xl shadow-lg"
                />

            </div>

            <div className="flex flex-col items-center">
                <img
                    src={faceId}
                    alt="faceId"
                    className="w-[280px] h-auto mb-3 rounded-2xl shadow-lg"
                />
            </div>
        </div>
    );
};

export default ScienceIdInfo;
