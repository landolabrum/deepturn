

// Relative Path: ./AdminFinance.tsx
import React from 'react';
import styles from './AdminFinance.scss';

// Remember to create a sibling SCSS file with the same name as this component

const AdminFinance: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-finance">
        <div className="admin-finance__header">
          <h1>Admin Finance</h1>
        </div>
        <div className="admin-finance__content"></div>
      </div>
    </>
  );
};

export default AdminFinance;