import FrontCard from '../components/FrontCard';
import BackCard from '../components/BackCard';
import ScienceId from '../components/ScienceId';
import ScienceIdInfo from '../components/ScienceIdInfo';

function HomePage() {
    return (
        <div className="grid grid-cols-10 gap-6 mx-auto px-32 mt-6">
            <div className="col-span-3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md flex flex-col items-center justify-center p-6 rounded-3xl shadow-2xl space-y-24 border border-white/30 hover:shadow-3xl transition-all duration-300">
                <div className="transform hover:scale-105 transition-transform duration-300">
                    <FrontCard />
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300">
                    <BackCard />
                </div>
            </div>

            <div className="col-span-4 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 transition-all duration-300 border border-white/30 hover:shadow-3xl">
                <ScienceId />
            </div>

            <div className="col-span-3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md flex flex-col items-center justify-center p-6 rounded-3xl shadow-2xl space-y-6 border border-white/30 hover:shadow-3xl transition-all duration-300">
                <ScienceIdInfo />
            </div>
        </div>
    );
}

export default HomePage;
