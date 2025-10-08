import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import { TokenService } from '../utils/storage';
import bgImage from '../assets/images/bgImage.png';
import logoInno from '../assets/images/logo.svg';

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
        <Layout
            className="min-h-screen"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
            <div className="bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm border-b border-white/20 shadow-lg">
                <div className="flex px-4 justify-center items-center">
                    <div className="z-10 py-2 transform hover:scale-105 transition-transform duration-300">
                        <img
                            className="w-[800px] drop-shadow-2xl rounded-lg"
                            src={logoInno}
                            alt="Innovation Logo"
                        />
                    </div>
                </div>
            </div>
            <Content className="p-6 relative z-10">
                <div className="w-full mx-auto">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}

export default AppLayout;
