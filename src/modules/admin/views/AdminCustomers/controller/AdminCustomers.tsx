// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomers.scss';
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerDetails from '../views/AdminCustomerDetail/controller/AdminCustomerDetail';
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';
import { useRouter } from 'next/router';

const AdminCustomers: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<string>('list');
  const qry = router?.query;
  const updateViewUrl = (newView:string, customer?: UserContext)=>{
    const baseUrl = '/admin?vid=customers';
    if(newView === 'modify' && customer?.id){
      router.replace(`${baseUrl}&cid=${customer.id}`);
    }else router.push(baseUrl);
    newView !== view && setView(newView);
  };

  
  useEffect(() => {
    if(qry.cid)setView('modify');
  }, [qry]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header'>
          <div className='admin-customer__header--title'>customer {view}</div>
          <div className='admin-customer__header--actions'>
            {view != 'add' && <UiButton
              traits={{ afterIcon: 'fa-user-plus' }}
              onClick={() => updateViewUrl( 'add' )}>add</UiButton>
            }
            {view != 'list' && <UiButton
              traits={{ afterIcon: 'fa-user-group' }}
              onClick={() => updateViewUrl('list')}>customers</UiButton>
            }
          </div>
        </div>
        {view === 'list' && <AdminCustomerList onSelect={(customer:UserContext)=>updateViewUrl('modify',customer)} /> }
        {view === 'modify' && <AdminCustomerDetails />}
        {view === 'add' && <AdminCustomerAdd /> }
      </div>
    </>
  );
};

export default AdminCustomers;