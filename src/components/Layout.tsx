import { Layout, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import { TokenService } from '../utils/storage';
import logo from '../assets/icons/innovation.svg';

const { Content, Header } = Layout;
const { Title } = Typography;

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
            <Header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
                <div className="max-w-6xl mx-auto">
                    <Title
                        level={2}
                        className="flex text-2xl text-center items-center gap-2"
                    >
                        <img src={logo} alt="Logo" className="w-10 h-10" />
                        Visit Card Generator
                    </Title>
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
