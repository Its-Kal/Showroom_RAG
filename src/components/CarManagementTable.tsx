import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Typography, type TableProps } from 'antd'; // ADDED Select
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedComponent } from './auth/ProtectedComponent';

const { Option } = Select; // Destructure Option from Select

// 1. Define the data type for a car
interface CarDataType {
    key: React.Key;
    id: number;
    name: string;
    year: number;
    price: number;
    status: string | null;
    description: string;
    image: string | null;
    category: string | null;
    acceleration: string | null;
    fuel_consumption: string | null;
}

export const CarManagementTable: React.FC = () => {
    const { token, checkPermission } = useAuth();
    const [cars, setCars] = useState<CarDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCar, setEditingCar] = useState<CarDataType | null>(null);
    const [form] = Form.useForm();

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const fetchCars = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get<CarDataType[]>('/cars');
            const formattedData = response.data.map((car: any) => ({ ...car, key: car.id }));
            setCars(formattedData);
        } catch (error) {
            message.error('Gagal memuat data mobil!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (checkPermission("CAN_VIEW_CARS")) {
            fetchCars();
        } else {
            setIsLoading(false);
            setCars([]);
            message.warning("Anda tidak memiliki izin untuk melihat daftar mobil.");
        }
    }, [checkPermission, token]);

    const handleAdd = () => {
        setEditingCar(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: CarDataType) => {
        setEditingCar(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/cars/${id}`);
            message.success('Mobil berhasil dihapus!');
            fetchCars();
        } catch (error) {
            message.error('Gagal menghapus mobil. Anda mungkin tidak memiliki izin.');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCar) {
                await axiosInstance.put(`/cars/${editingCar.id}`, values);
                message.success('Mobil berhasil diperbarui!');
            } else {
                await axiosInstance.post('/cars', values);
                message.success('Mobil berhasil ditambahkan!');
            }
            setIsModalVisible(false);
            fetchCars();
        } catch (error) {
            message.error('Gagal menyimpan data mobil. Pastikan semua field terisi.');
        }
    };

    const columns: TableProps<CarDataType>['columns'] = [
        { title: 'Nama Mobil', dataIndex: 'name', key: 'name' },
        { title: 'Tahun', dataIndex: 'year', key: 'year' },
        { title: 'Harga', dataIndex: 'price', key: 'price', render: (price) => `Rp ${price.toLocaleString('id-ID')}` },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Available' ? 'green' : 'orange'}>{status || 'N/A'}</Tag> },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <ProtectedComponent requiredPermission="CAN_EDIT_CARS">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredPermission="CAN_DELETE_CARS">
                        <Popconfirm title="Yakin ingin menghapus mobil ini?" onConfirm={() => handleDelete(record.id)} okText="Ya" cancelText="Tidak">
                            <Button icon={<DeleteOutlined />} danger>Hapus</Button>
                        </Popconfirm>
                    </ProtectedComponent>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>Manajemen Mobil</Typography.Title>
                <ProtectedComponent requiredPermission="CAN_CREATE_CARS">
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Tambah Mobil
                    </Button>
                </ProtectedComponent>
            </div>
            <Table columns={columns} dataSource={cars} loading={isLoading} rowKey="id" />

            <Modal
                title={editingCar ? 'Edit Mobil' : 'Tambah Mobil Baru'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Simpan"
                cancelText="Batal"
            >
                <Form form={form} layout="vertical" name="carForm">
                    {/* ... other form items ... */}
                    <Form.Item name="name" label="Nama Mobil" rules={[{ required: true, message: 'Nama mobil tidak boleh kosong!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="year" label="Tahun" rules={[{ required: true, message: 'Tahun tidak boleh kosong!' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="price" label="Harga" rules={[{ required: true, message: 'Harga tidak boleh kosong!' }]}>
                        <InputNumber style={{ width: '100%' }} formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} parser={(value) => value?.replace(/Rp\s?|(\,*)/g, '') ?? ''} />
                    </Form.Item>
                    <Form.Item name="description" label="Deskripsi">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    {/* CORRECTED: Changed Input to Select for Status */}
                    <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Pilih status mobil!' }]}>
                        <Select placeholder="Pilih status">
                            <Option value="Available">Available</Option>
                            <Option value="Reserved">Reserved</Option>
                            <Option value="Sold">Sold</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="image" label="URL Gambar">
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Kategori">
                        <Input />
                    </Form.Item>
                    <Form.Item name="acceleration" label="Akselerasi">
                        <Input />
                    </Form.Item>
                    <Form.Item name="fuel_consumption" label="Konsumsi Bahan Bakar">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};