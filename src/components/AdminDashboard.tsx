import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { CarOutlined, TeamOutlined, MessageOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Paragraph } = Typography;

// Data ini nantinya akan diambil dari API backend, misal: /api/v1/dashboard/summary
const summaryData = {
    totalCars: 78,
    totalUsers: 12,
    activeChats: 8,
    monthlySales: 3,
};

const inventoryByCategory = [
    { name: 'SUV', count: 25 },
    { name: 'Sedan', count: 30 },
    { name: 'Sport', count: 10 },
    { name: 'MPV', count: 8 },
    { name: 'Lainnya', count: 5 },
];

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <Title level={2}>Dashboard Administrator</Title>
            <Paragraph>Selamat datang! Berikut adalah ringkasan data dari sistem showroom.</Paragraph>

            {/* Bagian Statistik Utama */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic title="Total Mobil di Inventaris" value={summaryData.totalCars} prefix={<CarOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic title="Total Pengguna Terdaftar" value={summaryData.totalUsers} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic title="Sesi Chat Aktif" value={summaryData.activeChats} prefix={<MessageOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic title="Penjualan Bulan Ini" value={summaryData.monthlySales} prefix={<DollarCircleOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Bagian Grafik */}
            <Row style={{ marginTop: '32px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Inventaris Mobil Berdasarkan Kategori</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={inventoryByCategory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name="Jumlah Mobil" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;