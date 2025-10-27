import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert, Button, Table, Space } from 'antd'; // Added Table, Button, Space

import { MasterLayout } from '../../layouts/MasterLayout';
import { ProtectedComponent } from '../../components/auth/ProtectedComponent';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to check permissions directly

interface SalesDataPoint {
    tanggal: string;
    total_penjualan: number;
}

// Placeholder for Car data type
interface CarData {
    id: number;
    name: string;
    year: number;
    price: number;
    // Add other car properties as needed
}

export const DashboardPage: React.FC = () => {
    const { checkPermission } = useAuth(); // Get checkPermission from context
    const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
    const [carsData, setCarsData] = useState<CarData[]>([]); // State for cars data
    const [isLoadingSales, setIsLoadingSales] = useState<boolean>(true);
    const [isLoadingCars, setIsLoadingCars] = useState<boolean>(true); // Loading state for cars
    const [errorSales, setErrorSales] = useState<string | null>(null);
    const [errorCars, setErrorCars] = useState<string | null>(null); // Error state for cars

    // Fetch Sales Data
    useEffect(() => {
        if (checkPermission("CAN_VIEW_DASHBOARD")) { // Only fetch if user has permission
            const fetchSalesData = async () => {
                try {
                    // The endpoint from T-003. Ensure your dev server is proxied to the backend.
                    // This endpoint is not yet implemented in main.py, so it will likely 404
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
        } else {
            setIsLoadingSales(false);
            setErrorSales("Anda tidak memiliki izin untuk melihat data penjualan.");
        }
    }, [checkPermission]);

    // Fetch Cars Data (for car management section)
    useEffect(() => {
        if (checkPermission("CAN_VIEW_CARS")) { // Only fetch if user has permission
            const fetchCarsData = async () => {
                try {
                    const response = await axios.get<CarData[]>('/cars'); // Use the /cars endpoint
                    setCarsData(response.data);
                } catch (err) {
                    setErrorCars("Gagal memuat data mobil.");
                    console.error(err);
                } finally {
                    setIsLoadingCars(false);
                }
            };
            fetchCarsData();
        } else {
            setIsLoadingCars(false);
            setErrorCars("Anda tidak memiliki izin untuk melihat daftar mobil.");
        }
    }, [checkPermission]);

    // Columns for the Cars Table
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

    return (
        <MasterLayout>
            <h1>Dasbor Admin</h1>

            {/* --- Bagian Dashboard Penjualan --- */}
            <ProtectedComponent requiredPermission="CAN_VIEW_DASHBOARD">
                <h2>Dashboard Penjualan</h2>
                {errorSales && <Alert message={errorSales} type="error" showIcon />}
                <div style={{ marginTop: '24px' }}>
                    <SalesChart data={salesData} isLoading={isLoadingSales} />
                </div>
            </ProtectedComponent>

            {/* --- Bagian Manajemen Mobil --- */}
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
                    pagination={{ pageSize: 5 }} // Example pagination
                />
            </ProtectedComponent>

            {/* --- Bagian Manajemen Pengguna --- */}
            <ProtectedComponent requiredPermission="CAN_MANAGE_USERS">
                <h2 style={{ marginTop: '40px' }}>Manajemen Pengguna</h2>
                {/* Placeholder for User Management UI */}
                <p>Di sini akan ada daftar pengguna dan opsi untuk mengelola mereka.</p>
                <Button type="default">Lihat Semua Pengguna</Button>
            </ProtectedComponent>
        </MasterLayout>
    );
};
