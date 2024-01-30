// Relative Path: ./AdminInvoices.tsx
import React, { useState } from 'react';
import styles from './AdminInvoices.scss';
import UiInput from '@webstack/components/UiInput/UiInput';

const AdminInvoices: React.FC = () => {
  const [view, setview] = useState<string>('list')
  const views = {
    list: 'list view',
    create: 'create view'
  }
  const handleView = (e: any) => {
    const { value } = e?.target
    console.log(value)
    setview(value);
  }
  return (
    <>
      <style jsx>{styles}</style>

      <div className='admin-invoices'>
        <div className='admin-invoices__header'>
          <div>
            Invoice
          </div>
          <div className='admin-invoices__header-actions'>
            <UiInput value='list' type='button' size='md' onClick={handleView} />
            <UiInput value='create' type='button' size='md' onClick={handleView} />
          </div>
        </div>

        <div className='admin-invoices__content'>
          {view == 'list' && <div className='admin-invoices__content--list'>
            </div>}
          {view == 'create' && <div className='admin-invoices__content--create'>
            </div>}
        </div>
      </div>
    </>
  );
};

export default AdminInvoices;