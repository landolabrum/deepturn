import React, { useEffect, useRef, useState } from 'react';
import styles from './AdminMarketing.scss'; // Ensure the filename is correct
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import environment from '~/src/core/environment';
import CreatePDF from '@webstack/components/CreatePDF/controller/CreatePDF';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UserMethods from '~/src/modules/user-account/views/UserMethods/controller/UserMethods';

const AdminMarketing: React.FC = () => {
  const [view, setView] = useState('start')
  const pdfRef = useRef<HTMLDivElement>(null); // Correctly typed useRef
  // useEffect(()=>{},[]);
  const AdminMarketingProgram = (props: any) => {
    return <>
      <style jsx>{styles}</style>

      <div className='marketing-program-card'>
        <UiIcon icon={`fa-${props.name}`} />
        <p>{props.name} Marketing</p>

        <UiButton variant='dark' onClick={() => setView('method')}>${props?.cost || "41"} / lead</UiButton>
        <UiButton variant='flat'>more info</UiButton>
      </div>
    </>
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-marketing'>
        {view == 'start' && <>
          <div className='admin-marketing__header'>
            <h5>Sign up for marketing lists</h5>
            <p>Target your audience using informed media buying across states and the whole country by using Deepturn data analytics and audience groups to identify the people who will be most receptive to your message, create tailored content, and deliver impactful and cost effective campaigns across DMAs.</p>
          </div>
          <AdaptGrid gapY={20} xs={1} md={3} gap={10} variant='card'>
            <AdminMarketingProgram name="google" cost={100} />
            <AdminMarketingProgram name="tiktok" />
            <AdminMarketingProgram name="instagram" />
          </AdaptGrid>
        </>}
        {view == 'method' && <>
          <UserMethods />
        </>}
      </div>
    </>
  );
};

export default AdminMarketing;
