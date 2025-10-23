import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

// --- INTERFACES & CONSTANTS ---
interface Message {
  sender: 'user' | 'CS';
  text: string;
}

const CHAT_HISTORY_LIMIT = 10;

// --- SVG ICONS ---
const AiAvatar = () => (
    <div className="ai-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 17c-2.76 0-5-2.24-5-5h2c0 1.65 1.35 3 3 3s3-1.35 3-3h2c0 2.76-2.24 5-5 5z" />
            <circle cx="9" cy="10" r="1" />
            <circle cx="15" cy="10" r="1" />
        </svg>
    </div>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- CHATBOT COMPONENT ---
interface ChatBotProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'CS', text: 'Halo! Saya AI virtual consultant Anda. Ingin mencari mobil impian atau ada pertanyaan tentang koleksi kami?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Efek untuk menutup popup saat klik di luar area
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Cek apakah popup terbuka dan klik terjadi di luar area popup
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            // Tambahkan event listener saat popup terbuka
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Bersihkan event listener saat komponen unmount atau popup tertutup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Reset state saat popup ditutup
    useEffect(() => {
        if (!isOpen) {
            setInput('');
            // Anda bisa memilih untuk mereset history atau tidak saat ditutup
            // setMessages([{ sender: 'CS', text: 'Halo!...' }]);
        }
    }, [isOpen]);

    const handleSendMessage = async (messageText: string = input) => {
        if (messageText.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: messageText };
        setMessages(prevMessages => [...prevMessages, userMessage].slice(-CHAT_HISTORY_LIMIT));
        setInput('');
        setIsLoading(true);

        const webhookUrl = 'https://n8n-mihwklraj3fx.bgxy.sumopod.my.id/webhook/a410e854-71fa-4b86-b7d5-d591cd2e675f';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const responseText = await response.text();
            const botMessage: Message = { sender: 'CS', text: responseText || 'Maaf, saya tidak mengerti.' };
            setMessages(prevMessages => [...prevMessages, botMessage].slice(-CHAT_HISTORY_LIMIT));

        } catch (error) {
            console.error('Error sending message to webhook:', error);
            const errorMessage: Message = { sender: 'CS', text: 'Maaf, terjadi kesalahan. Coba lagi nanti.' };
            setMessages(prevMessages => [...prevMessages, errorMessage].slice(-CHAT_HISTORY_LIMIT));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-popup-container" ref={popupRef}>
            <div className="chat-modern-container">
                <div className="chat-header">
                    <div className="chat-header-info">
                        <AiAvatar />
                        <div>
                            <h4>AI Consultant</h4>
                        </div>
                    </div>
                </div>
                <div className="chat-body" ref={chatContainerRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                            <div className={`chat-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-bubble-wrapper ai">
                            <div className="chat-bubble ai typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="chat-input-area">
                    <input
                        type="text"
                        placeholder="Ketik pesan Anda..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                        className="chat-input"
                    />
                    <button onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()} className="chat-send-btn">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;