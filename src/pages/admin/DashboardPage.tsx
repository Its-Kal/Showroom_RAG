import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert } from 'antd';

import { MasterLayout } from '../../layouts/MasterLayout';
import { ProtectedComponent } from '../../components/auth/ProtectedComponent';
import { SalesChart } from '../../components/dashboard/SalesChart';

interface SalesDataPoint {
    tanggal: string;
    total_penjualan: number;
}

export const DashboardPage: React.FC = () => {
    const [data, setData] = useState<SalesDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/dashboard/sales-chart');
                setData(response.data);
            } catch (err) {
                // This check is now simplified as the component won't even render for unauthorized users
                setError("Gagal memuat data penjualan.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <MasterLayout>
            <h1>Dashboard Penjualan</h1>
            {/* CORRECTED: Use the 'requiredRole' prop instead of 'permission' */}
            <ProtectedComponent requiredRole="admin">
                {error && <Alert message={error} type="error" showIcon />}
                
                <div style={{ marginTop: '24px' }}>
                    <SalesChart data={data} isLoading={isLoading} />
                </div>

            </ProtectedComponent>
        </MasterLayout>
    );
};
