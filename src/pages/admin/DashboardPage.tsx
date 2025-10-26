import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert } from 'antd';

import { MasterLayout } from '../../layouts/MasterLayout';
import { ProtectedComponent } from '../../components/auth/ProtectedComponent';
import { SalesChart } from '../../components/dashboard/SalesChart';

// Re-defining interface here to avoid circular dependencies if SalesChart also imports something from a page
// In a real large-scale app, this would live in a dedicated types file (e.g., src/types/dashboard.ts)
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
                // The endpoint from T-003. Ensure your dev server is proxied to the backend.
                const response = await axios.get('/dashboard/sales-chart');
                setData(response.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 403) {
                    setError("Akses ditolak. Anda tidak memiliki izin untuk melihat data ini.");
                } else {
                    setError("Gagal memuat data penjualan.");
                }
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
            <ProtectedComponent permission="CAN_VIEW_SALES_CHART">
                {error && <Alert message={error} type="error" showIcon />}
                
                <div style={{ marginTop: '24px' }}>
                    <SalesChart data={data} isLoading={isLoading} />
                </div>

            </ProtectedComponent>
        </MasterLayout>
    );
};
