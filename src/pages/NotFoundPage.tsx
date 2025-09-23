import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    React.useEffect(() => {
        document.title = '404 - Page Not Found - My Website';
    }, []);

    return (
        <div className="page not-found-page">
            <h1>404 - Page Not Found</h1>
            <section className="content">
                <p>Oops! The page you are looking for doesn't exist.</p>
                <p>
                    <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
                        Go back to Home
                    </Link>
                </p>
            </section>
        </div>
    );
};

export default NotFoundPage;