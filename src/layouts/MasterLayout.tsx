import React from 'react';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { 
  HomeOutlined, // Added for Beranda
  LogoutOutlined, // Added for Keluar
  DashboardOutlined, 
  CarOutlined, 
  UserOutlined, 
  MessageOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

interface MasterLayoutProps {
  children: React.ReactNode;
}

interface DashboardMenuItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    permission: string;
    path: string;
}

export const MasterLayout: React.FC<MasterLayoutProps> = ({ children }) => {
  const { user, logout, checkPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const allDashboardMenuItems: DashboardMenuItem[] = [
    {
      key: 'dashboard-cars',
      icon: <CarOutlined />,
      label: 'Manajemen Mobil',
      permission: 'CAN_VIEW_CARS',
      path: '/admin/dashboard/cars',
    },
    {
      key: 'dashboard-users',
      icon: <UserOutlined />,
      label: 'Manajemen User',
      permission: 'CAN_MANAGE_USERS',
      path: '/admin/dashboard/users',
    },
    {
      key: 'dashboard-chat',
      icon: <MessageOutlined />,
      label: 'Manajemen Chat',
      permission: 'chat.view_all', 
      path: '/admin/dashboard/chat',
    },
    {
      key: 'dashboard-roles',
      icon: <SettingOutlined />,
      label: 'Manajemen Role & Izin',
      permission: 'CAN_MANAGE_ROLES',
      path: '/admin/dashboard/roles',
    },
  ];

  const accessibleMenuItems = allDashboardMenuItems.filter(item => checkPermission(item.permission));

  const defaultSelectedKey = accessibleMenuItems.find(item => location.pathname.startsWith(item.path))?.key || accessibleMenuItems[0]?.key;

  const handleMenuSelect = ({ key }: { key: string }) => {
    const selectedItem = allDashboardMenuItems.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible width={280} theme="dark">
        <div className="logo" style={{ padding: '16px', textAlign: 'center' }}> 
          <img src="/asset/logo-putih.png" alt="Garasix Logo" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[defaultSelectedKey]}
          selectedKeys={[defaultSelectedKey]}
          onSelect={handleMenuSelect}
        >
          {/* Static Menu Item for Beranda */}
          <Menu.Item key="beranda" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            Kembali ke Situs
          </Menu.Item>

          {/* Dynamic Menu Items */}
          {accessibleMenuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        {/* CORRECTED: Header now has content */}
        <Header style={{ padding: '0 24px', background: '#ffffff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Space>
            <Text>Selamat datang, <strong>{user?.username ?? 'Admin'}</strong></Text>
            <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
              Keluar
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#ffffff' }}>
            {children} 
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
