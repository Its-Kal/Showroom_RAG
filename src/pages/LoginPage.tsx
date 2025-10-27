import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css'; // Your original CSS file

// --- SVG Icons ---
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.436-7.198a1.012 1.012 0 011.618 0l4.436 7.198a1.012 1.012 0 010 .639l-4.436 7.198a1.012 1.012 0 01-1.618 0l-4.436-7.198z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);

interface DecodedToken {
    sub: string;
    role: string;
    exp: number;
}

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('sales');
    const [password, setPassword] = useState('sales123');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.access_token;
                login(token);
                const decodedToken = jwtDecode<DecodedToken>(token);
                const userRole = decodedToken.role;
                setMessage('Login successful! Redirecting...');
                setIsSuccess(true);
                setTimeout(() => {
                    if (userRole === 'admin' || userRole === 'sales') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/');
                    }
                }, 500);
            } else {
                setMessage(data.detail || 'Login failed!');
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage('An error occurred. Is the backend server running?');
            setIsSuccess(false);
            console.error('Login error:', error);
        }
    };

    // Restoring the JSX structure to match LoginPage.css
    return (
        <div className="login-container">
            <div className="login-info-panel">
                <div className="login-info-content">
                    <img src="/asset/logo-putih.png" alt="Garasix Logo" className="logo-login-img" />
                    <h1>Selamat Datang Kembali di Garasix</h1>
                    <p>Platform terpercaya untuk menemukan mobil impian Anda. Silakan login untuk mengakses dasbor Anda.</p>
                </div>
            </div>

            <div className="login-form-panel">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2>Login Akun</h2>
                        <p className="subtitle">Masukkan kredensial Anda untuk melanjutkan.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="contoh: sales"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit">Login</button>

                        {message && (
                            <p className={`login-message ${isSuccess ? 'success' : 'error'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
