import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
    React.useEffect(() => {
        document.title = '404 - Halaman Tidak Ditemukan';
    }, []);

    return (
        <div className="not-found-page">
            <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTBrZ3ZpZzZqY2l4c3k4c3pnaXg2c3o4c3JqY3k4c3ZqY3k4c3ZqYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8L0Pky6C83SzkzU55a/giphy.gif" 
                alt="Page Not Found GIF" 
                className="not-found-gif"
            />
            <h1>Oops! Halaman Tidak Ditemukan</h1>
            <p>Sepertinya Anda tersesat. Mari kami bantu Anda kembali ke jalan yang benar.</p>
            <Link to="/" className="btn-home">
                Kembali ke Beranda
            </Link>
        </div>
    );
};

export default NotFoundPage;