import { Button, Form, Input } from 'antd';
import { Lock, LogIn, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import innovationIcon from '@/assets/icons/innovation.svg';
import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation';
import type { LoginBody } from '@/features/auth/types';
import { paths } from '@/routes/path';
import { BrandBackground, Panel } from '@/shared/ui';
import { TokenService } from '@/shared/utils';

function LoginPage() {
    const { t } = useTranslation();
    const { mutate, isPending } = useLoginMutation();

    if (TokenService.getToken()) {
        return <Navigate to={paths.HOME} replace />;
    }

    const onFinish = (values: LoginBody) => {
        mutate({
            username: values.username.trim(),
            password: values.password,
        });
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <BrandBackground />

            <Panel className="w-full max-w-md animate-fade-up">
                <div className="mb-8 flex flex-col items-center gap-4 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card">
                        <img src={innovationIcon} alt="" className="h-11 w-11" />
                    </span>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-300">
                            {t('common.app-name')}
                        </p>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">
                            {t('pages.login.title')}
                        </h1>
                        <p className="text-base text-white/70">
                            {t('pages.login.subtitle')}
                        </p>
                    </div>
                </div>

                <Form<LoginBody>
                    name="login"
                    layout="vertical"
                    size="large"
                    requiredMark={false}
                    onFinish={onFinish}
                    disabled={isPending}
                >
                    <Form.Item
                        name="username"
                        label={t('pages.login.username')}
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: t('pages.login.username-required'),
                            },
                            { min: 3, message: t('pages.login.username-min') },
                        ]}
                    >
                        <Input
                            autoFocus
                            autoComplete="username"
                            prefix={<User size={18} className="text-white/45" />}
                            placeholder={t('pages.login.username-placeholder')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={t('pages.login.password')}
                        rules={[
                            {
                                required: true,
                                message: t('pages.login.password-required'),
                            },
                            { min: 6, message: t('pages.login.password-min') },
                        ]}
                    >
                        <Input.Password
                            autoComplete="current-password"
                            prefix={<Lock size={18} className="text-white/45" />}
                            placeholder={t('pages.login.password-placeholder')}
                        />
                    </Form.Item>

                    <Form.Item className="!mb-0 !mt-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isPending}
                            icon={<LogIn size={18} />}
                        >
                            {t('pages.login.submit')}
                        </Button>
                    </Form.Item>
                </Form>
            </Panel>
        </main>
    );
}

export default LoginPage;
