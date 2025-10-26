import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAuth } from '../contexts/AuthContext'; // V3 IMPORT

// SVG Icon for showing/hiding password
const EyeIcon = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.436-7.198a1.012 1.012 0 011.618 0l4.436 7.198a1.012 1.012 0 010 .639l-4.436 7.198a1.012 1.012 0 01-1.618 0l-4.436-7.198z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);

const LoginPage: React.FC = () => { // V3 REFACTOR: Removed onLogin prop
    const { loginMock } = useAuth(); // V3 REFACTOR: Get login function from context
    const [username, setUsername] = useState(''); // Pre-filled for demo
    const [password, setPassword] = useState(''); // Pre-filled for demo
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setIsSuccess(true);
                loginMock(); // V3 REFACTOR: Call context login function
                navigate('/admin'); // Redirect to admin page
            } else {
                setMessage(data.detail || 'Login failed!');
                setIsError(true);
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage('Backend Belum Jalan');
            setIsError(true);
            setIsSuccess(false);
            console.error('Login error:', error);
        }
    };

    return (
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
                        <h2>Admin Login</h2>
                        <p className="subtitle">Silakan masukkan kredensial Anda.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="contoh: user1" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit">Login</button>
                    </form>

                    {message && (
                        <p className={`login-message ${isSuccess ? 'success' : 'error'}`}>{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;