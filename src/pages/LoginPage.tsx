import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Space, message, App as AntApp } from 'antd';
import './LoginPage.css';
import { useAuth } from '../contexts/AuthContext'; // V3 IMPORT

const LoginPage: React.FC = () => { // V3 REFACTOR: Removed onLogin prop
    const { loginMock } = useAuth(); // V3 REFACTOR: Get login function from context
    const { modal } = AntApp.useApp();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', values.username);
            formData.append('password', values.password);

            const response = await fetch('http://localhost:8000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                loginMock(); // V3 REFACTOR: Call context login function
                navigate('/admin'); // Redirect to admin page
            } else {
                // Login failed - show modal error
                modal.error({
                    title: 'Login Gagal',
                    content: 'Nama Pengguna atau Kata Sandi salah.',
                });
            }
        } catch (error) {
            // Network error or other exception - show modal error
            modal.error({
                title: 'Login Gagal',
                content: 'Nama Pengguna atau Kata Sandi salah.',
            });
            console.error('Login error:', error);
        }
    };

    return (
        <AntApp>
        <div className="login-container">
            {/* Kolom Kiri: Informasi & Branding */}
            <div className="login-info-panel">
                <div className="login-info-content">
                    <img src="/asset/logo-putih.png" alt="Logo Garasix Showroom" className="logo-login-img" />
                    <h1>Selamat Datang Kembali</h1>
                    <p>Kelola inventaris mobil Anda dengan mudah melalui dasbor admin kami yang intuitif dan powerful.</p>
                </div>
            </div>

            {/* Kolom Kanan: Form Login */}
            <div className="login-form-panel">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2>Login Admin</h2>
                        <p className="subtitle">Silakan masukkan kredensial Anda.</p>
                    </div>

                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Nama Pengguna"
                            name="username"
                            rules={[{ required: true, message: 'Masukkan nama pengguna' }]}
                        >
                            <Input placeholder="Masukkan nama pengguna" />
                        </Form.Item>

                        <Form.Item
                            label="Kata Sandi"
                            name="password"
                            rules={[{ required: true, message: 'Masukkan kata sandi' }]}
                        >
                            <Input.Password placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" size="large">
                                    Masuk
                                </Button>
                                <Link to="/">
                                    <Button type="default" size="large">
                                        Beranda
                                    </Button>
                                </Link>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
        </AntApp>
    );
};

export default LoginPage;
