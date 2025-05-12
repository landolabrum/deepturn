// Relative Path: ./MarketingDetails.tsx
import React from 'react';
import styles from './MarketingDetails.scss';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import environment from '~/src/core/environment';
import { capitalize } from 'lodash';

// Remember to create a sibling SCSS file with the same name as this component
interface IMarketingDetails{
    setView:(e:any)=>void
}
const MarketingDetails = ({setView}:IMarketingDetails) => {

    const AdminMarketingProgram = (props: any) => {
        return <>
          <style jsx>{styles}</style>
    
          <div className='marketing-program-card' onClick={setView}>
            <UiIcon icon={`fa-${props.name}`} />
            <p>{props.name} Marketing</p>
    
            <UiButton  onClick={() => setView('method')}>${props?.cost || "41"} / lead</UiButton>
            <UiButton variant='link' onClick={() => setView('more-info')}>More Info</UiButton>
          </div>
        </>
      }
  return (
    <>
      <style jsx>{styles}</style>
      <div className='marketing-details'>
          <div className='marketing-details__header'>
            <div className='marketing-details__header--title'>Sign up for marketing lists</div>
            <div className='marketing-details__header--body'>Target your audience using informed media buying across states and the whole country by using Deepturn data analytics and audience groups to identify the people who will be most receptive to your message, create tailored content, and deliver impactful and cost effective campaigns across DMAs.</div>
          </div>
          <div className='marketing-details__create-account'>
            <div className='marketing-details__create-account--header'>
              {capitalize(environment.merchant.name)} Free Tier
            </div>
            <div className='marketing-details__create-account--body'>
              {`Gain free, knowledge of ${capitalize(environment.merchant.name)}'s products & services`}
            </div>
            <div className='marketing-details__create-account--action'>
            <UiButton variant="lite round">create a free account</UiButton>
            </div>
          </div>
          <AdaptGrid gapY={20} xs={1} md={3} gap={10} variant='card'>
            <AdminMarketingProgram name="google" cost={100} />
            <AdminMarketingProgram name="tiktok" />
            <AdminMarketingProgram name="instagram" />
          </AdaptGrid>
          </div>
    </>
  );
};

export default MarketingDetails;