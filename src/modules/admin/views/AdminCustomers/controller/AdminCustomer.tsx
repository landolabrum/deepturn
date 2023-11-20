// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomer.scss';
import UiTabsLayout from '@webstack/layouts/UiTabsLayout/UiTabsLayout';
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerModify from '../views/AdminCustomerModify/AdminCustomerModify';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomer: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [view, setView] = useState<string>('list');
  const handleView = (e: any) => {
    if(e.customer){

      console.log(e)
    }
    else if(typeof e == 'string'){
      setView(e);
    }
    else if (e?.id) {
      setData(e.id);
      setView('modify');
    };
  };

  const views: { [key: string]: any } = {
    'list': <AdminCustomerList onRowClick={handleView} />,
    'add': <AdminCustomerAdd />,
    'modify': <AdminCustomerModify customerId={data} />,
  }

  useEffect(() => { }, [handleView]);
  return (
    <>
      <style jsx>{styles}</style>view: {view}
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
