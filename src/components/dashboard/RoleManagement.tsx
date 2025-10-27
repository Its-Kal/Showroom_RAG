import React from 'react';
import { Typography, Alert, Button, Table, Space } from 'antd';
import { ProtectedComponent } from '../auth/ProtectedComponent';

interface RoleData {
    id: number;
    name: string;
    description?: string;
}

export const RoleManagement: React.FC = () => {
    // Placeholder data
    const roles: RoleData[] = [
        { id: 1, name: 'admin_utama', description: 'Administrator Utama Sistem' },
        { id: 2, name: 'admin', description: 'Administrator Operasional' },
        { id: 3, name: 'sales', description: 'Tim Penjualan' },
    ];

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nama Role', dataIndex: 'name', key: 'name' },
        { title: 'Deskripsi', dataIndex: 'description', key: 'description' },
        {
            title: 'Aksi',
            key: 'action',
            render: (_: any, record: RoleData) => (
                <Space size="middle">
                    <ProtectedComponent requiredPermission="CAN_MANAGE_ROLES">
                        <Button type="link">Edit Izin</Button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredPermission="CAN_MANAGE_ROLES">
                        <Button type="link" danger>Hapus Role</Button>
                    </ProtectedComponent>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Typography.Title level={3}>Manajemen Role & Izin</Typography.Title>
            <ProtectedComponent requiredPermission="CAN_MANAGE_ROLES">
                <Button type="primary" style={{ marginBottom: '16px' }}>Tambah Role Baru</Button>
                <Table columns={columns} dataSource={roles} rowKey="id" pagination={{ pageSize: 5 }} />
            </ProtectedComponent>
            <ProtectedComponent requiredPermission="CAN_MANAGE_ROLES">
                <Alert message="Ini adalah placeholder untuk manajemen role dan izin. Data akan dimuat dari backend." type="info" showIcon style={{ marginTop: '16px' }} />
            </ProtectedComponent>
        </div>
    );
};