import styles from './Index.scss';
import Deepturn from '../views/Merchants/Deepturn/controller/Deepturn';
import NirvanaEnergy from '../views/Merchants/NirvanaEnergy/controller/NirvanaEnergy';
import environment from '~/src/core/environment';
import { useEffect, useState } from 'react';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import AireHotel from '../views/Merchants/AireHotel/AireHotel';
import XInsurance from '../views/Merchants/XInsurance/controller/XInsurance';



const Index = () => {
  const [view, setView] = useState<any>()

  const views = {
    'nirv1': <NirvanaEnergy />,
    'xi1': <XInsurance />,
    'mb1':<Deepturn/>,
    'ah1':<AireHotel/>,
  }
  // const campaign = useCampaign();
  const mid = environment.merchant.mid;
  useEffect(() => {
    if (!view)setView(mid); 
}, []);
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