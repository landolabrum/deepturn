import styles from './Index.scss';
import Deepturn from '../views/Merchants/Deepturn/Deepturn';
import NirvanaEnergy from '../views/Merchants/NirvOne/NirvanaEnergy';
import environment from '~/src/environment';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useLoader } from '@webstack/components/Loader/Loader';
import { useEffect, useState } from 'react';
import { useProspect } from '~/src/core/authentication/hooks/useProspect';
import UiViewLayout from '@webstack/layouts/UiViewLayout/UiViewLayout';
// import useCampaign from '@webstack/hooks/useCampaign';
// import { useEffect } from 'react';



const Index = () => {
  const merchant: any = environment?.merchant;
  // const prospect = useProspect();
  const [view, setView] = useState()
  // const campaign = useCampaign();
  useEffect(() => {
    // console.log('[ prospect ]', prospect)
    if (!view && merchant?.mid) setView(merchant.mid);
  }, []);

  if (!environment) return <></>;
  return (
    <>
      <style jsx>{styles}</style>
      {/* {JSON.stringify(campaign)} */}
      <div className='index'>
        {merchant?.name && (
          <h1 className={`index__full--title main index__full--title-${merchant.name}`}>
            <UiIcon icon={`${merchant.name}-logo`} />
            {merchant?.name && keyStringConverter(merchant.name)}
          </h1>
        )
        }
        <UiViewLayout
          view={view}
          views={{
            'nirv1': <NirvanaEnergy />,
            'mb1':<Deepturn/>
          }}
        />
      </div>
    </>
  );
};

export default Index;