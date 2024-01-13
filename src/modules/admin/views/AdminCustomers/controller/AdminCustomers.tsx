// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomers.scss';
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomer from '../views/AdminCustomer/AdminCustomer';
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';

// Remember to create a sibling SCSS file with the same name as this component
interface IAdminData {
  view: string,
  data?: string
}

const AdminCustomers: React.FC = () => {
  const initialData = {
    view: 'list'
  }
  const [pgData, setPgData] = useState<IAdminData>(initialData);

  const handlePgData = ({ view, data }: IAdminData) => {
    setPgData({ view, data });
  };
  const views: any = {
    list: <AdminCustomerList onRowClick={(customer: UserContext) => {
      handlePgData(
        { view: 'modify', data: String(customer.id) }
      )
    }} />,
    modify: <AdminCustomer customerId={pgData.data} />,
    add: <AdminCustomerAdd />
  }

  useEffect(() => { }, [handlePgData]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header'>
          <div className='admin-customer__actions'>
            {pgData.view != 'add' && <UiButton
              traits={{ afterIcon: 'fa-user-plus' }}
              onClick={() => setPgData({view:'add'})}>add</UiButton>
            }
            {pgData.view != 'list' && <UiButton
              traits={{ afterIcon: 'fa-user-group' }}
              onClick={() => setPgData(initialData)}>customers</UiButton>
            }
          </div>
        </div>
        {views[pgData.view]}
      </div>
    </>
  );
};

export default AdminCustomers;