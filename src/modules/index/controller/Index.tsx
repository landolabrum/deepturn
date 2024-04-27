import styles from './Index.scss';
import Deepturn from '../views/Merchants/Deepturn/Deepturn';
import NirvanaEnergy from '../views/Merchants/NirvanaEnergy/NirvanaEnergy';
import environment from '~/src/environment';
import { useEffect, useState } from 'react';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
// import AireHotel from '../views/Merchants/AireHotel/AireHotel';
// import useCampaign from '@webstack/hooks/useCampaign';
// import { useEffect } from 'react';



const Index = () => {
  // const prospect = useProspect();
  const user = useUser()
  const [view, setView] = useState<any>()

  const views = {
    'nirv1': <NirvanaEnergy />,
    'mb1':<Deepturn/>,
    // 'ah':<AireHotel/>,
  }
  // const campaign = useCampaign();
  useEffect(() => {
    if (!view) {
        setView(environment.merchant.mid);
    }
}, [view]);


return (
    <>
      <style jsx>{styles}</style>
      <div className='index'>
        <UiViewLayout
          currentView={view}
          views={views}
        />
      </div>
    </>
  );

};

export default Index;