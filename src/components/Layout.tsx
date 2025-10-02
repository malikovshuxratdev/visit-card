import { Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import '../App.css';

const { Content, Header } = Layout;
const { Title } = Typography;

function AppLayout() {
    return (
        <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Title level={2} className="bg-clip-text text-center">
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
