import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import { TokenService } from '../utils/storage';
import logo from '../assets/icons/innovation.svg';

const { Content, Header } = Layout;

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
        <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header className="bg-white shadow-sm mt-4 mx-4 rounded-lg !h-auto py-2">
                <div className="max-w-6xl mx-auto flex items-center gap-2">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-[40px] h-[40px] cursor-pointer"
                    />
                    <span className="gap-2 text-3xl font-bold">
                        Visit Card Generator
                    </span>
                </div>
            </Header>

            <Content className="p-4">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}

export default AppLayout;
