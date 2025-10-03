import React from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useLoginMutate } from '../hooks/useLogin';
import { LoginBodyType } from '../types/login';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const { mutate, isPending } = useLoginMutate();

    const onFinish = async (values: LoginBodyType) => {
        await mutate({
            username: values.username,
            password: values.password,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md">
                <Card className="glass-card border-0 shadow-xl">
                    <div className="text-center mb-8">
                        <Title
                            level={2}
                            className="!mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            Tizimga Kirish
                        </Title>
                        <Text type="secondary">
                            Visit Card generatoriga kirish uchun login va
                            parolingizni kiriting
                        </Text>
                    </div>

                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            label="Login"
                            rules={[
                                { required: true, message: 'Login kiriting!' },
                                {
                                    min: 3,
                                    message:
                                        "Login kamida 3 ta belgi bo'lishi kerak!",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Loginingizni kiriting"
                                className="h-12"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Parol"
                            rules={[
                                { required: true, message: 'Parol kiriting!' },
                                {
                                    min: 6,
                                    message:
                                        "Parol kamida 6 ta belgi bo'lishi kerak!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Parolingizni kiriting"
                                className="h-12"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isPending}
                                icon={<LoginOutlined />}
                                disabled={isPending}
                                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg text-lg"
                            >
                                Kirish
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
