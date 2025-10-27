import React from 'react';
import { Table, Button, Space, Tag, type TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface CarManagementTableProps {
    userRole: string;
}

// 1. Definisikan tipe data untuk setiap baris di tabel
interface DataType {
    key: React.Key;
    name: string;
    year: number;
    price: number;
    status: string;
}

const CarManagementTable: React.FC<CarManagementTableProps> = ({ userRole }) => {
    // Data dummy, nantinya dari API
    const data: DataType[] = [
        { key: '1', name: 'Toyota Avanza', year: 2022, price: 250000000, status: 'Tersedia' },
        { key: '2', name: 'Honda Brio', year: 2023, price: 180000000, status: 'Dipesan' },
        { key: '3', name: 'Mitsubishi Pajero', year: 2021, price: 550000000, status: 'Tersedia' },
    ];

    const canManage = userRole === 'admin_utama' || userRole === 'admin';

    // 2. Berikan tipe eksplisit pada 'columns' menggunakan tipe dari Ant Design
    const columns: TableProps<DataType>['columns'] = [
        { title: 'Nama Mobil', dataIndex: 'name', key: 'name' },
        { title: 'Tahun', dataIndex: 'year', key: 'year' },
        { title: 'Harga', dataIndex: 'price', key: 'price', render: (price: number) => `Rp ${price.toLocaleString('id-ID')}` },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Tersedia' ? 'green' : 'orange'}>{status}</Tag> },
    ];

    if (canManage) {
        columns.push({
            title: 'Aksi',
            key: 'action',
            render: (_, record: DataType) => ( // 3. (Opsional tapi direkomendasikan) Gunakan DataType untuk 'record'
                <Space size="middle">
                    <Button icon={<EditOutlined />}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger>Hapus</Button>
                </Space>
            ),
        });
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Daftar Mobil</h2>
                {canManage && (
                    <Button type="primary" icon={<PlusOutlined />}>
                        Tambah Mobil
                    </Button>
                )}
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default CarManagementTable;
