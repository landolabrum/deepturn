// Relative Path: ./AdminData.tsx
import React from 'react';
import styles from './AdminData.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import AdminDataHeader from '../views/AdminDataHeader/AdminDataHeader';
import UserDocs from '~/src/modules/user-account/views/UserDocs/controller/UserDocs';
import { useUser } from '~/src/core/authentication/hooks/useUser';

// Remember to create a sibling SCSS file with the same name as this component

const AdminData: React.FC = () => {
    const memberService = getService<IMemberService>('IMemberService',);
    const adminService = getService<IAdminService>('IAdminService',);
    const [isEditing, setIsEditing] = React.useState(false);    
    const user=useUser();
        return (
        <>
        <style jsx>{styles}</style>
        <div className='admin-data'>
            <h1>Data Management</h1>
            <p>Manage your data efficiently.</p>
            {user && isEditing && (
                <UserDocs/>
            )}
            <AdminDataHeader />
            <AdapTable

                data={[
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email',
                        key: 'email',
                    },
                    {
                        title: 'Role',
                        dataIndex: 'role',
                        key: 'role',
                    },
                ]}

                loading={false}
          />
        </div>
        </>
    );
};

export default AdminData;