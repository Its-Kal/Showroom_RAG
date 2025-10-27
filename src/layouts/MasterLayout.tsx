import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

interface MasterLayoutProps {
  children: React.ReactNode;
}

export const MasterLayout: React.FC<MasterLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" /> 
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<CarOutlined />}>
            Manajemen Mobil
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Manajemen User
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#ffffff' }} />
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#ffffff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
