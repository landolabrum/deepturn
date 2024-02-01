import React, { useEffect, useRef } from 'react';
import styles from './AdminMarketing.scss'; // Ensure the filename is correct
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/environment';
import CreatePDF from '@webstack/components/CreatePDF/controller/CreatePDF';

const AdminMarketing: React.FC = () => {
  const pdfRef = useRef<HTMLDivElement>(null); // Correctly typed useRef
// useEffect(()=>{},[]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-messenger'>
        <div className='admin-messenger__header'>
          <div className='admin-messenger__header--icon'>
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          </div>
          <div className='nirvana-promo-1' ref={pdfRef}>
            hello world
          </div>
          <CreatePDF pdfRef={pdfRef} preview/>
        </div>
      </div>
    </>
  );
};

export default AdminMarketing;
