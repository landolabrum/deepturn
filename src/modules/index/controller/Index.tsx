import styles from './Index.scss';
import Deepturn from '../views/Merchants/Deepturn/Deepturn';
import NirvanaEnergy from '../views/Merchants/NirvanaEnergy/NirvanaEnergy';
import environment from '~/src/environment';
import { useEffect, useState } from 'react';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import AireHotel from '../views/Merchants/AireHotel/AireHotel';
// import AireHotel from '../views/Merchants/AireHotel/AireHotel';
// import useCampaign from '@webstack/hooks/useCampaign';
// import { useEffect } from 'react';



const Index = () => {
  const [view, setView] = useState<any>()

  const views = {
    'nirv1': <NirvanaEnergy />,
    'mb1':<Deepturn/>,
    'ah1':<AireHotel/>,
  }
  // const campaign = useCampaign();
  const mid = environment.merchant.mid;
  useEffect(() => {
    if (!view)setView(mid);
}, [mid]);

return (
    <>
      <style jsx>{styles}</style>
        <UiViewLayout
          currentView={view}
          views={views}
        /> 
    </>
  );

};

export default Index;