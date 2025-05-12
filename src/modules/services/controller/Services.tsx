// Relative Path: ./Services.tsx
import React, { useEffect, useState } from 'react';
import styles from './Services.scss';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useRouter } from 'next/router';
import MarketingDetails from '../views/MarketingDetails/MarketingDetails';
import MarketingList from '../views/MarketingList/MarketingList';


const Services: React.FC = () => {
  const [view, _setView] = useState<string | undefined>();
  const [details, _setDetails] = useState<any | undefined>();
  const setDetails = (newView: any)=>{
    // console.log({deetz})
    Object.keys(views).includes(newView) && _setView(newView)
  };
    
  const { query } = useRouter();
  const views = {
    data: <>
      data acquisition
    </>,
    marketing: <MarketingList setDetails={setDetails}/>,
    "marketing-details": (
      <MarketingDetails 
        setView={setDetails}
      />
    ),
  }

  const sid: string | undefined = query?.sid && String(query.sid);
  useEffect(() => { if(sid && !view) _setView(sid) }, [query,details!=undefined]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='services'>
        {/* <div className='dev'>
          {view}
        </div> */}
        <UiViewLayout
          currentView={view}
          views={views}
        />

        {view == 'method' && <>

          {/* <UserMethods /> */}
        </>}
      </div>
    </>
  );
};

export default Services;