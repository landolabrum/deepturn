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
  const [view, setView] = useState<string>();
  const cid = router?.query?.cid;
  const baseUrl = '/admin?vid=customers';    
  
  const updateViewUrl = (newView?:string, customer?: UserContext)=>{
    if(!newView && !view)setView(cid?'modify':'list');
    else if(newView){
      setView(newView);
      if(newView === 'list' && router.asPath !== baseUrl)router.replace(baseUrl);
      else if(newView === 'modify' && router.asPath === baseUrl && customer)router.push(`${baseUrl}&cid=${customer.id}`);
    }
  };
 
  
  useEffect(() => {
    updateViewUrl();
  }, [updateViewUrl]);
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
        {view === 'modify' && <AdminCustomerDetails id={cid} setView={(e:any)=>{
          console.log('detaiuls:::: ',e );
          updateViewUrl(e)
        }}/>}
        {view === 'add' && <AdminCustomerAdd /> }
      </div>
    </>
  );
};

export default AdminCustomers;