import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Menu, Spin, Alert, Button, Table, Space } from 'antd'; // Impor digabung
import {
    DashboardOutlined,
    CarOutlined,
    UserOutlined,
    MessageOutlined,
    BarChartOutlined,
    KeyOutlined,
} from '@ant-design/icons';

import { useAuth } from '../../contexts/AuthContext'; // Cukup satu
import { ProtectedComponent } from '../../components/auth/ProtectedComponent'; // Dari master
import { SalesChart } from '../../components/dashboard/SalesChart'; // Dari master

// Komponen dari ANISA (tapi kita tidak pakai Admin/Sales dashboard dari file lain dulu)
// import AdminDashboard from '../../components/AdminDashboard'; 
// import SalesDashboard from '../../components/SalesDashboard';

// Placeholder dari ANISA
const UserManagement = ({ userRole }: { userRole: string }) => <p>Halaman Manajemen User (Role: {userRole})</p>;
const ChatManagement = ({ userRole }: { userRole: string }) => <p>Halaman Manajemen Chat (Role: {userRole})</p>;

const { Sider, Content } = Layout; // Dari ANISA

// Mendefinisikan item menu untuk setiap role (DARI ANISA)
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

// Interface data dari MASTER
interface CarData {
    id: number;
    name: string;
    year: number;
    price: number;
}
interface SalesDataPoint {
    // Tentukan struktur data sales di sini, contoh:
    month: string;
    sales: number;
}


// Komponen Gabungan
export const DashboardPage: React.FC = () => {
    // --- State dari KEDUA versi ---
    const { user, checkPermission } = useAuth(); // Gabungan
    const [selectedMenu, setSelectedMenu] = useState('dashboard'); // Dari ANISA

    // State dari MASTER
    const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
    const [carsData, setCarsData] = useState<CarData[]>([]); 
    const [isLoadingSales, setIsLoadingSales] = useState<boolean>(true);
    const [isLoadingCars, setIsLoadingCars] = useState<boolean>(true); 
    const [errorSales, setErrorSales] = useState<string | null>(null);
    const [errorCars, setErrorCars] = useState<string | null>(null);

    // --- Loading check dari ANISA ---
    if (!user || !checkPermission) {
        return <Spin tip="Memuat data pengguna..." style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />;
    }

    // --- Data Fetching dari MASTER ---
    // Fetch Sales Data
    useEffect(() => {
        // Hanya fetch jika menu 'dashboard' aktif DAN punya izin
        if (selectedMenu === 'dashboard' && checkPermission("CAN_VIEW_DASHBOARD")) { 
            const fetchSalesData = async () => {
                setIsLoadingSales(true);
                try {
                    const response = await axios.get('/dashboard/sales-chart');
                    setSalesData(response.data);
                } catch (err) {
                    setErrorSales("Gagal memuat data penjualan.");
                    console.error(err);
                } finally {
                    setIsLoadingSales(false);
                }
            };
            fetchSalesData();
        } else if (selectedMenu === 'dashboard') {
            setIsLoadingSales(false);
            setErrorSales("Anda tidak memiliki izin untuk melihat data penjualan.");
        }
    }, [checkPermission, selectedMenu]); // Ditambah 'selectedMenu'

    // Fetch Cars Data (for car management section)
    useEffect(() => {
        // Hanya fetch jika menu 'cars' atau 'cars-view' aktif DAN punya izin
        if ((selectedMenu === 'cars' || selectedMenu === 'cars-view') && checkPermission("CAN_VIEW_CARS")) { 
            const fetchCarsData = async () => {
                setIsLoadingCars(true);
                try {
                    const response = await axios.get<CarData[]>('/cars'); 
                    setCarsData(response.data);
                } catch (err) {
                    setErrorCars("Gagal memuat data mobil.");
                    console.error(err);
                } finally {
                    setIsLoadingCars(false);
                }
            };
            fetchCarsData();
        } else if (selectedMenu === 'cars' || selectedMenu === 'cars-view') {
            setIsLoadingCars(false);
            setErrorCars("Anda tidak memiliki izin untuk melihat daftar mobil.");
        }
    }, [checkPermission, selectedMenu]); // Ditambah 'selectedMenu'

    // Columns for the Cars Table (dari MASTER)
    const carColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nama', dataIndex: 'name', key: 'name' },
        { title: 'Tahun', dataIndex: 'year', key: 'year' },
        { title: 'Harga', dataIndex: 'price', key: 'price' },
        { 
            title: 'Aksi', 
            key: 'action', 
            render: (_: any, record: CarData) => (
                <Space size="middle">
                    <ProtectedComponent requiredPermission="CAN_EDIT_CARS">
                        <Button type="link">Edit</Button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredPermission="CAN_DELETE_CARS">
                        <Button type="link" danger>Hapus</Button>
                    </ProtectedComponent>
                </Space>
            ),
        },
    ];

    // --- Logika dari ANISA ---
    const userRole = user.role;
    const availableMenuItems = menuItems[userRole] || [];

    // --- renderContent dari ANISA, tapi diisi konten dari MASTER ---
    const renderContent = () => {
        switch (selectedMenu) {
            case 'dashboard':
                // Konten Dashboard dari MASTER
                return (
                    <ProtectedComponent requiredPermission="CAN_VIEW_DASHBOARD">
                        <h2>Dashboard Penjualan</h2>
                        {errorSales && <Alert message={errorSales} type="error" showIcon />}
                        <div style={{ marginTop: '24px' }}>
                            <SalesChart data={salesData} isLoading={isLoadingSales} />
                        </div>
                    </ProtectedComponent>
                );
            case 'cars':
            case 'cars-view':
                // Konten Tabel Mobil dari MASTER
                return (
                    <ProtectedComponent requiredPermission="CAN_VIEW_CARS">
                        <h2 style={{ marginTop: '40px' }}>Manajemen Mobil</h2>
                        <ProtectedComponent requiredPermission="CAN_CREATE_CARS">
                            <Button type="primary" style={{ marginBottom: '16px' }}>Tambah Mobil Baru</Button>
                        </ProtectedComponent>
                        {errorCars && <Alert message={errorCars} type="error" showIcon />}
                        <Table 
                            columns={carColumns} 
                            dataSource={carsData} 
                            rowKey="id" 
                            loading={isLoadingCars} 
                            pagination={{ pageSize: 5 }} 
                        />
                    </ProtectedComponent>
                );
            case 'users':
                return <UserManagement userRole={userRole} />;
            case 'chats':
            case 'my-chats':
                return <ChatManagement userRole={userRole} />;
            case 'reports':
                return <p>Halaman untuk Laporan Penjualan.</p>;
            case 'roles':
                return <p>Halaman untuk Manajemen Role & Permission.</p>;
            default:
                return <p>Selamat datang di Dasbor. Silakan pilih menu untuk memulai.</p>;
        }
    };

    // --- Return Layout dari ANISA ---
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