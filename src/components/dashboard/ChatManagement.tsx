import React from 'react';
import { Typography, Alert, Button, Table, Space } from 'antd';
import { ProtectedComponent } from '../auth/ProtectedComponent';

interface ChatData {
    id: number;
    customer_name: string;
    sales_assigned: string;
    status: string;
    last_message: string;
}

export const ChatManagement: React.FC = () => {
    // Placeholder data
    const chats: ChatData[] = [
        { id: 1, customer_name: 'Budi Santoso', sales_assigned: 'sales', status: 'Open', last_message: 'Mobil A masih ada?', },
        { id: 2, customer_name: 'Siti Aminah', sales_assigned: 'admin', status: 'Pending', last_message: 'Bisa nego harga?', },
    ];

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Pelanggan', dataIndex: 'customer_name', key: 'customer_name' },
        { title: 'Sales', dataIndex: 'sales_assigned', key: 'sales_assigned' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Pesan Terakhir', dataIndex: 'last_message', key: 'last_message' },
        {
            title: 'Aksi',
            key: 'action',
            render: (_: any, record: ChatData) => (
                <Space size="middle">
                    <ProtectedComponent requiredPermission="chat.reply">
                        <Button type="link">Balas</Button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredPermission="chat.transfer">
                        <Button type="link">Transfer</Button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredPermission="chat.close">
                        <Button type="link" danger>Tutup</Button>
                    </ProtectedComponent>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Typography.Title level={3}>Manajemen Chat</Typography.Title>
            <ProtectedComponent requiredPermission="chat.view_all">
                <Button type="primary" style={{ marginBottom: '16px' }}>Lihat Semua Chat</Button>
                <Table columns={columns} dataSource={chats} rowKey="id" pagination={{ pageSize: 5 }} />
            </ProtectedComponent>
            <ProtectedComponent requiredPermission="chat.view_all">
                <Alert message="Ini adalah placeholder untuk manajemen chat. Data akan dimuat dari backend." type="info" showIcon style={{ marginTop: '16px' }} />
            </ProtectedComponent>
        </div>
    );
};