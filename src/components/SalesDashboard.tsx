import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { MessageOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const SalesDashboard: React.FC = () => {
    // Data ini nantinya akan diambil dari API /chats/metrics/me
    const metrics = {
        active_sessions: 5,
        closed_sessions: 28,
        avgResponseTime: '5m 32s', // Contoh data tambahan
    };

    return (
        <div>
            <h1>Dashboard Sales</h1>
            <p>Berikut adalah ringkasan performa chat Anda.</p>
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic title="Chat Aktif (Ditugaskan)" value={metrics.active_sessions} prefix={<MessageOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic title="Chat Selesai (Bulan Ini)" value={metrics.closed_sessions} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic title="Rata-rata Waktu Balas" value={metrics.avgResponseTime} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SalesDashboard;
