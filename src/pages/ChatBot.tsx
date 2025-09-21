import React, { useState, useEffect, useRef } from 'react';

// Definisi tipe untuk setiap pesan dalam obrolan
interface Message {
  sender: 'user' | 'CS'; // Pengirim pesan: 'user' (pengguna) atau 'bot' (chatbot)
  text: string; // Isi teks pesan
}

// Batasan jumlah pesan yang disimpan dalam riwayat obrolan
// Ini mencegah riwayat obrolan menjadi terlalu panjang dan memakan banyak memori
const CHAT_HISTORY_LIMIT = 5;

// Komponen utama ChatBot
const ChatBot: React.FC = () => {
  // State untuk menyimpan semua pesan dalam obrolan
  // Dimulai dengan pesan pembuka dari bot
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'CS', text: 'Halo! Selamat datang di Chatbot Rekomendasi Mobil Showroom Impian. Ada yang bisa saya bantu?' }
  ]);
  // State untuk menyimpan teks yang sedang diketik pengguna di kolom input
  const [input, setInput] = useState('');
  // State untuk menunjukkan apakah bot sedang memproses atau menunggu jawaban
  const [isLoading, setIsLoading] = useState(false);
  // Ref untuk mengontrol scroll otomatis ke bawah pada kontainer obrolan
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Efek samping yang berjalan setiap kali 'messages' atau 'isLoading' berubah
  // Bertujuan untuk menggulir (scroll) tampilan obrolan ke pesan terbaru secara otomatis
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]); // Bergantung pada 'messages' dan 'isLoading'

  // Fungsi untuk menangani pengiriman pesan oleh pengguna
  const handleSendMessage = async () => {
    // Jika input kosong atau bot sedang memuat, jangan lakukan apa-apa
    if (input.trim() === '' || isLoading) return;

    // Buat objek pesan pengguna
    const userMessage: Message = { sender: 'user', text: input };
    // Tambahkan pesan pengguna ke riwayat dan batasi jumlah pesan
    setMessages(prevMessages => [...prevMessages, userMessage].slice(-CHAT_HISTORY_LIMIT));
    // Kosongkan kolom input
    setInput('');
    // Set status loading menjadi true karena bot akan memproses
    setIsLoading(true);

    // URL webhook tempat pesan akan dikirim untuk diproses oleh bot
    const webhookUrl = 'https://n8n-mihwklraj3fx.bgxy.sumopod.my.id/webhook/a410e854-71fa-4b86-b7d5-d591cd2e675f';

    try {
      // Kirim pesan pengguna ke webhook menggunakan metode POST
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Beri tahu server bahwa kita mengirim JSON
        },
        body: JSON.stringify({ message: input }), // Kirim pesan dalam format JSON
      });

      // Periksa apakah respons dari server berhasil (status 200 OK)
      if (!response.ok) {
        throw new Error('Network response was not ok'); // Jika tidak, lempar error
      }

      // Ambil teks respons dari webhook
      const responseText = await response.text();
      console.log('Webhook response:', responseText); // Tampilkan respons di konsol (untuk debugging)
      // Buat objek pesan bot dari respons, atau pesan default jika respons kosong
      const botMessage: Message = { sender: 'CS', text: responseText || 'Maaf, saya tidak mengerti.' };
      // Tambahkan pesan bot ke riwayat dan batasi jumlah pesan
      setMessages(prevMessages => [...prevMessages, botMessage].slice(-CHAT_HISTORY_LIMIT));

    } catch (error) {
      // Tangani error jika ada masalah saat mengirim atau menerima pesan
      console.error('Error sending message to webhook:', error);
      // Tampilkan pesan error dari bot kepada pengguna
      const errorMessage: Message = { sender: 'CS', text: 'Maaf, terjadi kesalahan. Coba lagi nanti.' };
      setMessages(prevMessages => [...prevMessages, errorMessage].slice(-CHAT_HISTORY_LIMIT));
    } finally {
      // Setelah semua proses selesai (berhasil atau gagal), set loading menjadi false
      setIsLoading(false);
    }
  };

  // Tampilan (render) komponen ChatBot
  return (
    <main style={{ padding: '4rem 2rem', minHeight: '70vh', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Customer Service Rekomendasi Mobil</h2>
      {/* Kontainer utama untuk tampilan obrolan */}
      <div style={{
        border: '1px solid #ccc', // Garis tepi abu-abu
        borderRadius: '8px', // Sudut membulat
        padding: '20px', // Ruang di dalam kontainer
        marginTop: '30px', // Jarak dari atas
        backgroundColor: '#f9f9f9', // Warna latar belakang abu-abu muda
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Efek bayangan
      }}>
        {/* Area tampilan pesan obrolan */}
        <div ref={chatContainerRef} style={{
          height: '300px', // Tinggi tetap
          overflowY: 'scroll', // Aktifkan scroll vertikal jika konten melebihi tinggi
          border: '1px solid #eee', // Garis tepi sangat tipis
          borderRadius: '4px', // Sudut membulat
          padding: '10px', // Ruang di dalam area pesan
          backgroundColor: '#fff', // Latar belakang putih
          marginBottom: '15px', // Jarak dari elemen di bawahnya
          textAlign: 'left' // Teks rata kiri
        }}>
          {/* Menampilkan setiap pesan dalam array 'messages' */}
          {messages.map((msg, index) => (
            <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', marginBottom: '10px' }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#fff',
                border: '1px solid #eee',
                maxWidth: '70%'
              }}>
                <strong>{msg.sender === 'CS' ? 'CS' : 'Anda'}:</strong> {msg.text}
              </div>
            </div>
          ))}
          {/* Menampilkan indikator loading jika bot sedang memproses */}
          {isLoading && <p><strong>Bot:</strong> ...</p>}
        </div>
        {/* Bagian input teks dan tombol kirim */}
        <div style={{ display: 'flex' }}>
          {/* Kolom input teks */}
          <input
            type="text"
            placeholder="Ketik pesan Anda..." // Teks placeholder
            value={input} // Nilai input terikat dengan state 'input'
            onChange={(e) => setInput(e.target.value)} // Update state 'input' saat teks berubah
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Kirim pesan saat tombol Enter ditekan
            style={{
              flexGrow: 1, // Mengisi ruang yang tersedia
              padding: '10px', // Ruang di dalam input
              border: '1px solid #ccc', // Garis tepi
              borderRadius: '4px', // Sudut membulat
              marginRight: '10px' // Jarak dari tombol kirim
            }}
            disabled={isLoading} // Nonaktifkan input saat bot sedang memuat
          />
          {/* Tombol Kirim */}
          <button
            onClick={handleSendMessage} // Panggil fungsi handleSendMessage saat tombol diklik
            style={{
              padding: '10px 20px', // Ruang di dalam tombol
              backgroundColor: isLoading ? '#ccc' : '#1a237e', // Warna latar belakang (berubah saat loading)
              color: 'white', // Warna teks putih
              border: 'none', // Tanpa garis tepi
              borderRadius: '4px', // Sudut membulat
              cursor: isLoading ? 'not-allowed' : 'pointer' // Kursor (berubah saat loading)
            }}
            disabled={isLoading} // Nonaktifkan tombol saat bot sedang memuat
          >
            {isLoading ? '...Wait...' : 'Kirim'} {/* Teks tombol (berubah saat loading) */}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatBot;
