// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomers.scss';
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerDetails from '../views/AdminCustomerDetail/controller/AdminCustomerDetail';
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';
import capitalize from '@webstack/helpers/Capitalize';
import { useRouter } from 'next/router';
import AuthQuery from '~/src/pages/authentication/[function]';

// Remember to create a sibling SCSS file with the same name as this component
interface IAdminData {
  view: string,
  data?: { [key: string]: string | undefined };
}

const AdminCustomers: React.FC = () => {
  const router = useRouter();
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
        { view: 'modify', data: { id: customer.id, name: customer.name } }
      )
    }} />,
    modify: pgData?.data?.id && <AdminCustomerDetails customer_id={pgData.data.id} /> || <>error (admin cust [31])</>,
    add: <AdminCustomerAdd />
  }
  useEffect(() => {
    if(router.query && Object.keys(router.query).includes('id')){
      setPgData({view: 'modify', data: {id: String(router.query.id)}})
    }
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header'>
          {pgData?.data?.name && pgData.view == 'modify' && <div className='admin-customer__header--title'>
            {capitalize(pgData.data.name)}
          </div> || <div/>}
          <div className='admin-customer__header--actions'>
            {pgData.view != 'add' && <UiButton
              traits={{ afterIcon: 'fa-user-plus' }}
              onClick={() => setPgData({ view: 'add' })}>add</UiButton>
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