import React from 'react';
import { Typography } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';

import { MasterLayout } from '../../layouts/MasterLayout';
import { useAuth } from '../../contexts/AuthContext';

// Import the management components
import { SalesReport } from '../../components/dashboard/SalesReport';
import { CarManagementTable } from '../../components/CarManagementTable';
import { UserManagement } from '../../components/dashboard/UserManagement';
import { ChatManagement } from '../../components/dashboard/ChatManagement';
import { RoleManagement } from '../../components/dashboard/RoleManagement';


// Komponen Gabungan
export const DashboardPage: React.FC = () => {
    const { user, checkPermission } = useAuth();

    // Determine the default redirect path, prioritizing cars
    const defaultRedirectPath = [
        checkPermission('CAN_VIEW_CARS') && '/admin/dashboard/cars',
        checkPermission('CAN_MANAGE_USERS') && '/admin/dashboard/users',
        checkPermission('chat.view_all') && '/admin/dashboard/chat',
        checkPermission('CAN_MANAGE_ROLES') && '/admin/dashboard/roles',
    ].find(path => path !== false);

    return (
        <MasterLayout>
            {/* REMOVED: Static title is no longer needed */}
            {/* <Typography.Title level={2} style={{ marginBottom: '24px' }}>Dasbor Admin</Typography.Title> */}
            
            <Routes>
                {/* Redirect to the first accessible dashboard page */}
                <Route path="/" element={<Navigate to={defaultRedirectPath || '/404'} replace />} />

                {/* Define sub-routes for each management section */}
                <Route path="/sales-report" element={<SalesReport />} />
                <Route path="/cars" element={<CarManagementTable />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/chat" element={<ChatManagement />} />
                <Route path="/roles" element={<RoleManagement />} />

                {/* Fallback for any unmatched sub-route within /admin/dashboard */}
                <Route path="*" element={<Typography.Text type="secondary">Pilih menu dari sidebar.</Typography.Text>} />
            </Routes>
        </MasterLayout>
    );
};
