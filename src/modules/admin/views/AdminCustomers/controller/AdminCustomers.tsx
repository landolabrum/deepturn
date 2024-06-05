import React, { useEffect, useState } from 'react';
import styles from './AdminCustomers.scss'; // Changed to .css import
import AdminCustomerAdd from '~/src/modules/admin/views/AdminCustomers/views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '~/src/modules/admin/views/AdminCustomers/views/AdminCustomerList/AdminCustomerList';
import AdminCustomerDetails from '~/src/modules/admin/views/AdminCustomers/views/AdminCustomerDetail/controller/AdminCustomerDetail';
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';
import { useRouter } from 'next/router';
import UiHeader from '@webstack/components/Header/views/UiHeader/UiHeader';


const AdminCustomers: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<string>();
  const cid = router?.query?.cid;
  const vid = router?.query?.vid;
  
  const updateViewUrl = (newView?: string, customer?: UserContext) => {
    if (!newView && !view) {
      setView(cid ? 'modify' : 'list');
    } else if (newView) {
      setView(newView);
      const query = { ...router.query };
      if (newView === 'modify' && customer) {
        query.cid = customer.id;
        query.vid = vid; // Keep existing vid if present
      } else {
        delete query.cid;
        delete query.vid;
      }
      router.push({ query });
    }
  };
  
  useEffect(() => {
    updateViewUrl();
  }, [cid, vid]); // Update on cid or vid change
  
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header-container'>
          <UiHeader title='Customer' subTitle={view}/>
          <div className='actions'>
            {view !== 'add' && (
              <UiButton
                traits={{ afterIcon: 'fa-user-plus' }}
                onClick={() => updateViewUrl('add')}
              >
                Add
              </UiButton>
            )}
            {view !== 'list' && (
              <UiButton
                traits={{ afterIcon: 'fa-user-group' }}
                onClick={() => updateViewUrl('list')}
              >
                Customers
              </UiButton>
            )}
          </div>
        </div>
        {view === 'list' && (
          <AdminCustomerList onSelect={(customer: UserContext) => updateViewUrl('modify', customer)} />
        )}
        {view === 'modify' && (
          <AdminCustomerDetails
            id={cid}
            setView={(e: any) => {
              updateViewUrl(e);
            }}
          />
        )}
        {view === 'add' && <AdminCustomerAdd />}
      </div>
    </>
  );
};

export default AdminCustomers;
