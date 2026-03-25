import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import { TokenService } from '../utils/storage';
import logoInno from '../assets/images/logo.svg';
import innoVideo from '../assets/images/Innovator.mp4';

const { Content } = Layout;

function AppLayout() {
    const token = TokenService.getToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    return (
        <Layout className="min-h-screen relative overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={innoVideo} type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/0 z-[1]" />

            {/* Header */}
            <div className="bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm border-b border-white/20 shadow-lg relative z-10">
                <div className="flex px-4 justify-center items-center">
                    <div className="z-10 py-2 transform hover:scale-105 transition-transform duration-300 h-[120px]">
                        {/* <img
                            className="w-[800px] drop-shadow-2xl rounded-lg"
                            src={logoInno}
                            alt="Innovation Logo"
                        /> */}
                    </div>
                </div>
            </div>

            {/* Content */}
            <Content className="p-6 relative z-10">
                <div className="w-full mx-auto">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}

export default AppLayout;
