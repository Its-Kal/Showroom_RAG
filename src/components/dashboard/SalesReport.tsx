import React from 'react';
import { Typography, Alert } from 'antd';
import { ProtectedComponent } from '../auth/ProtectedComponent';
import { SalesChart } from './SalesChart'; // Assuming SalesChart is already defined

interface SalesDataPoint {
    tanggal: string;
    total_penjualan: number;
}

export const SalesReport: React.FC = () => {
    // Placeholder data for chart
    const data: SalesDataPoint[] = [
        { tanggal: '2023-01', total_penjualan: 1200000000 },
        { tanggal: '2023-02', total_penjualan: 1500000000 },
        { tanggal: '2023-03', total_penjualan: 1300000000 },
        { tanggal: '2023-04', total_penjualan: 1800000000 },
        { tanggal: '2023-05', total_penjualan: 2000000000 },
    ];

    return (
        <div>
            <Typography.Title level={3}>Laporan Penjualan</Typography.Title>
            <ProtectedComponent requiredPermission="CAN_VIEW_DASHBOARD">
                <SalesChart data={data} isLoading={false} />
            </ProtectedComponent>
            <ProtectedComponent requiredPermission="CAN_VIEW_DASHBOARD">
                <Alert message="Ini adalah placeholder untuk laporan penjualan. Data akan dimuat dari backend." type="info" showIcon style={{ marginTop: '16px' }} />
            </ProtectedComponent>
        </div>
    );
};