import { Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import '../App.css';

const { Content } = Layout;
const { Title } = Typography;

function AppLayout() {
    return (
        <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Content className="p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <Title
                            level={1}
                            className="!text-4xl !font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            Visit Card
                        </Title>
                    </div>
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}

export default AppLayout;
