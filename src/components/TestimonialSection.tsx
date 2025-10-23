import React from 'react';
import '../App.css';

const testimonials = [
    {
        id: 1,
        name: 'Budi Santoso',
        role: 'Pengusaha',
        quote: 'Pelayanan di Premium Auto sangat luar biasa. Mereka membantu saya menemukan SUV yang sempurna untuk keluarga. Prosesnya cepat dan transparan. Sangat direkomendasikan!',
        avatar: 'https://i.pravatar.cc/150?u=budi'
    },
    {
        id: 2,
        name: 'Citra Lestari',
        role: 'Desainer Grafis',
        quote: 'Saya mencari mobil sport bekas dengan kondisi prima. Tim di sini tidak hanya menemukannya, tetapi juga memberikan harga yang sangat kompetitif. Saya sangat puas!',
        avatar: 'https://i.pravatar.cc/150?u=citra'
    },
    {
        id: 3,
        name: 'Ahmad Dahlan',
        role: 'Dokter',
        quote: 'Kejujuran dan profesionalisme adalah dua kata yang menggambarkan showroom ini. Semua informasi diberikan secara detail. Pengalaman membeli mobil terbaik saya sejauh ini.',
        avatar: 'https://i.pravatar.cc/150?u=ahmad'
    },
    {
        id: 4,
        name: 'Dewi Anggraini',
        role: 'Manajer Pemasaran',
        quote: 'Dari konsultasi awal hingga serah terima kunci, semuanya berjalan mulus. Koleksi mobilnya juga sangat terawat. Terima kasih Premium Auto!',
        avatar: 'https://i.pravatar.cc/150?u=dewi'
    }
];

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.681 3.462 3.82.555c.734.107 1.028.997.494 1.51l-2.764 2.693.654 3.803c.124.72-.643 1.274-1.286.943L10 15.347l-3.417 1.795c-.643.33-1.41-.223-1.286-.943l.654-3.803-2.764-2.693c-.534-.513-.24-1.403.494-1.51l3.82-.555 1.681-3.462z" clipRule="evenodd" />
    </svg>
);

const TestimonialSection: React.FC = () => {
    return (
        <section className="testimonial-section">
            <div className="collection-header">
                <h2>Apa Kata Pelanggan Kami</h2>
                <p>Pengalaman mereka adalah bukti komitmen kami terhadap kualitas dan kepuasan.</p>
            </div>
            {/* Container untuk efek marquee/geser */}
            <div className="testimonial-container-autoscroll">
                {/* Trek yang akan digeser, berisi dua set testimoni untuk loop yang mulus */}
                <div className="testimonial-track">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="rating">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                            </div>
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <div className="testimonial-author">
                                <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                                <div className="author-info">
                                    <h4>{testimonial.name}</h4>
                                    <p>{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;