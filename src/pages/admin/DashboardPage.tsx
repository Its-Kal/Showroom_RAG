import React, { useEffect, useState } from 'react';
import { Layout, Menu, Spin } from 'antd';
import {
    DashboardOutlined,
    CarOutlined,
    UserOutlined,
    MessageOutlined,
    BarChartOutlined,
    KeyOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from '../../components/AdminDashboard'; // Path sudah benar
import SalesDashboard from '../../components/SalesDashboard'; // Path sudah benar
import CarManagementTable from '../../components/CarManagementTable'; // Path diperbaiki untuk konsistensi
// Placeholder untuk komponen yang belum dibuat
const UserManagement = ({ userRole }: { userRole: string }) => <p>Halaman Manajemen User (Role: {userRole})</p>;
const ChatManagement = ({ userRole }: { userRole: string }) => <p>Halaman Manajemen Chat (Role: {userRole})</p>;

const { Sider, Content } = Layout;

// Mendefinisikan item menu untuk setiap role
const menuItems: Record<string, { key: string; icon: React.ReactNode; label: string }[]> = {
    admin_utama: [
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'cars', icon: <CarOutlined />, label: 'Manajemen Mobil' },
        { key: 'users', icon: <UserOutlined />, label: 'Manajemen User' },
        { key: 'chats', icon: <MessageOutlined />, label: 'Manajemen Chat' },
        { key: 'reports', icon: <BarChartOutlined />, label: 'Laporan Penjualan' },
        { key: 'roles', icon: <KeyOutlined />, label: 'Manajemen Role' },
    ],
    admin: [
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'cars', icon: <CarOutlined />, label: 'Manajemen Mobil' },
        { key: 'users', icon: <UserOutlined />, label: 'Manajemen User' },
        { key: 'chats', icon: <MessageOutlined />, label: 'Manajemen Chat' },
    ],
    sales: [
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard Saya' },
        { key: 'my-chats', icon: <MessageOutlined />, label: 'Chat Saya' },
        { key: 'cars-view', icon: <CarOutlined />, label: 'Lihat Mobil' },
    ],
};

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [selectedMenu, setSelectedMenu] = useState('dashboard');

    if (!user) {
        return <Spin tip="Memuat data pengguna..." style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />;
    }

    const userRole = user.role;
    const availableMenuItems = menuItems[userRole] || [];

    const renderContent = () => {
        // Tampilkan konten berdasarkan peran dan menu yang dipilih
        switch (selectedMenu) {
            case 'dashboard':
                return userRole === 'sales' ? <SalesDashboard /> : <AdminDashboard />;
            case 'cars':
            case 'cars-view':
                return <CarManagementTable userRole={userRole} />;
            case 'users':
                return <UserManagement userRole={userRole} />;
            case 'chats':
            case 'my-chats':
                return <ChatManagement userRole={userRole} />;
            case 'reports':
                return <p>Halaman untuk Laporan Penjualan.</p>;
            case 'roles':
                // Hanya admin_utama yang bisa melihat ini, sesuai definisi menuItems
                return <p>Halaman untuk Manajemen Role & Permission.</p>;
            default:
                return <p>Selamat datang di Dasbor. Silakan pilih menu untuk memulai.</p>;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Sider width={250} theme="dark" collapsible>
                <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px', color: 'white', textAlign: 'center', lineHeight: '32px', overflow: 'hidden' }}>
                    Garasix
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    onClick={(e) => setSelectedMenu(e.key)}
                    items={availableMenuItems}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280, borderRadius: '8px' }}>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};
