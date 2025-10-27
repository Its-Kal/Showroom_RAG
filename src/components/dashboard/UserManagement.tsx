import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Switch, message, Popconfirm, Typography, type TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedComponent } from '../auth/ProtectedComponent';

const { Option } = Select;

// 1. Define the data types
interface UserDataType {
    key: React.Key;
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    role_id: number;
}

interface RoleType {
    id: number;
    name: string;
}

export const UserManagement: React.FC = () => {
    const { token, checkPermission } = useAuth();
    const [users, setUsers] = useState<UserDataType[]>([]);
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDataType | null>(null);
    const [form] = Form.useForm();

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersResponse, rolesResponse] = await Promise.all([
                axiosInstance.get('/users'),
                axiosInstance.get('/roles')
            ]);
            const formattedUsers = usersResponse.data.map((user: any) => ({
                ...user,
                key: user.id,
                role_id: user.role_id
            }));
            setUsers(formattedUsers);
            setRoles(rolesResponse.data);
        } catch (error) {
            message.error('Gagal memuat data!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (checkPermission("CAN_MANAGE_USERS")) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [checkPermission, token]);

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: UserDataType) => {
        setEditingUser(record);
        form.setFieldsValue({ ...record, role_id: record.role_id }); 
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            message.success('Pengguna berhasil dihapus!');
            fetchData(); // Refresh data
        } catch (error) {
            message.error('Gagal menghapus pengguna.');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = { ...values };

            if (editingUser && !payload.plain_password) {
                delete payload.plain_password;
            }

            if (editingUser) {
                await axiosInstance.put(`/users/${editingUser.id}`, payload);
                message.success('Pengguna berhasil diperbarui!');
            } else {
                await axiosInstance.post('/users', payload);
                message.success('Pengguna berhasil ditambahkan!');
            }
            setIsModalVisible(false);
            fetchData(); // Refresh data
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || 'Gagal menyimpan data pengguna.';
            message.error(errorMsg);
        }
    };

    const columns: TableProps<UserDataType>['columns'] = [
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        { title: 'Aktif', dataIndex: 'is_active', key: 'is_active', render: (isActive) => <Switch checked={isActive} disabled /> },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm title="Yakin ingin menghapus pengguna ini?" onConfirm={() => handleDelete(record.id)} okText="Ya" cancelText="Tidak">
                        <Button icon={<DeleteOutlined />} danger>Hapus</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>Manajemen Pengguna</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Tambah Pengguna
                </Button>
            </div>
            <Table columns={columns} dataSource={users} loading={isLoading} rowKey="id" />

            <Modal
                title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Simpan"
                cancelText="Batal"
            >
                <Form form={form} layout="vertical" name="userForm" initialValues={{ is_active: true }}>
                    <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username tidak boleh kosong!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email tidak valid!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="plain_password" label="Password" rules={[{ required: !editingUser, message: 'Password tidak boleh kosong saat membuat pengguna baru!' }]}>
                        <Input.Password placeholder={editingUser ? "Kosongkan jika tidak ingin mengubah" : ""} />
                    </Form.Item>
                    <Form.Item name="role_id" label="Role" rules={[{ required: true, message: 'Pilih role!' }]}>
                        <Select placeholder="Pilih role untuk pengguna">
                            {roles.map(role => (
                                <Option key={role.id} value={role.id}>{role.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="is_active" label="Aktif" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};