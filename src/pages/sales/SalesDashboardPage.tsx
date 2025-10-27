import React from 'react';
import { MasterLayout } from '../../layouts/MasterLayout';
import { useAuth } from '../../contexts/AuthContext';

export const SalesDashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <MasterLayout>
            <h1>Dasbor Sales</h1>
            <p>Selamat datang, <strong>{user?.username ?? 'Sales Person'}</strong>!</p>
            <p>Ini adalah halaman dasbor Anda. Fitur-fitur khusus untuk sales akan ditampilkan di sini.</p>
            
            {/* Anda bisa menambahkan komponen yang dilindungi dengan izin di sini */}
            {/* Contoh:
            <ProtectedComponent requiredPermission="chat.reply">
                <ChatPanel />
            </ProtectedComponent>
            */}
        </MasterLayout>
    );
};
