// Relative Path: ./AdminStreamEventDemo.tsx
import React from 'react';
import styles from './AdminStreamEventDemo.scss';

// Remember to create a sibling SCSS file with the same name as this component

const AdminStreamEventDemo: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-stream-event-demo'>
        <div className='admin-stream-event-demo__header'>
          <h2>Event Demo</h2>
        </div>
        <div className='admin-stream-event-demo__body'>
          <p>This is a demo for the Admin Stream Event component.</p>
          {/* Add your demo content here */}
        </div>
      </div>
    </>
  );
};

export default AdminStreamEventDemo;