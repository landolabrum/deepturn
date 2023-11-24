// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomer.scss';
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerModify from '../views/AdminCustomerModify/AdminCustomerModify';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomer: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [view, setView] = useState<string>('list');
  const handleView = (e: any) => {
    if(typeof e == 'string'){
      setView(e);
    }
    else if (e?.id) {
      const sd = async () => {
        return setData(e.id);
      }
      sd().then(()=>setView('modify'))
    };
  };

  const views: { [key: string]: any } = {
    'list': <AdminCustomerList onRowClick={handleView} />,
    'add': <AdminCustomerAdd />,
    'modify': <AdminCustomerModify customerId={data} />,
  }
  
  useEffect(() => {}, [setData]);
  return (
    <>
      <style jsx>{styles}</style>
      {/* {JSON.stringify(data)} */}
      <div className='admin-customer'>
        <div className='admin-customer__header'>
          <div className='admin-customer__actions'>
            <div className='admin-customer__actions'>
            </div>
            <UiButton traits={{afterIcon:'fa-circle-user'}} onClick={()=>handleView('list')}>customers</UiButton>
            <UiButton onClick={()=>handleView('add')}>add</UiButton>
          </div>
        </div>
        {views[view]}
      </div>
    </>
  );
};

export default AdminCustomer;
