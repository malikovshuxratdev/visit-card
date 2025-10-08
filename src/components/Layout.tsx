import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import { TokenService } from '../utils/storage';
import BgImage from '../assets/images/bgImage.png';
import navimg2 from '../assets/images/logoInno.jpg';

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
                backgroundImage: `url(${BgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* <div className="absolute inset-0 bg-black/30" />
            <div className="bg-white/15">
                <div className="flex px-4 justify-center items-center">
                    <div className="z-10 py-4">
                        <img className="w-[550px]" src={navimg2} alt="" />
                    </div>
                </div>
            </div> */}
            <Content className="p-4">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}

export default AppLayout;
