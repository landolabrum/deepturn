// Relative Path: ./AdminDataHeader.tsx
import React from 'react';
import styles from './AdminDataHeader.scss';
import UiButtonGroup from '@webstack/components/UiForm/components/UiButtonGroup/controller/UiButtonGroup';

// Remember to create a sibling SCSS file with the same name as this component

const AdminDataHeader: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-data-header'>
        <h1>Data Management</h1>
        <p>Manage your data efficiently.</p>
        <div className='admin-data-header__actions'>
        <UiButtonGroup 
        size={{ xs: 1, sm: 2, md: 3 }}
        btns={[
          {
            label: 'Add',
            onClick: () => console.log('Add clicked'),
          },
          {
            label: 'Edit',
            onClick: () => console.log('Edit clicked'),
          },
          {
            label: 'Delete',
            onClick: () => console.log('Delete clicked'),
          },
        ]} />
        </div>
      <div className='admin-data-header__actions'>
        <UiButtonGroup 
                size={{ xs: 1, sm: 2, md: 3 }}

        btns={[
          {
            label: 'Export',
            onClick: () => console.log('Export clicked'),
          },
          {
            label: 'Import',
            onClick: () => console.log('Import clicked'),
          },
        ]} />
      </div>
        </div>
    </>
  );
};

export default AdminDataHeader;