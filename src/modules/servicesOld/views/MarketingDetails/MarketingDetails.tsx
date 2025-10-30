// ./MarketingDetails.tsx
import React from 'react';
import styles from './MarketingDetails.scss';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import environment from '~/src/core/environment';
import { capitalize } from 'lodash';

interface IMarketingDetails {
  setView: (e: any) => void;
}

const MarketingDetails = ({ setView }: IMarketingDetails) => {
  const merchant = environment.merchant;
  const marketing = merchant.settings?.marketing;

  if (!marketing) return null;

  const AdminMarketingProgram = (props: { name: string; cost?: number }) => (
    <>
      <style jsx>{styles}</style>
      <div className='marketing-program-card' onClick={setView}>
        <UiIcon icon={`fa-${props.name}`} />
        <p>{capitalize(props.name)} Marketing</p>
        <UiButton onClick={() => setView('method')}>
          ${props?.cost ?? '41'} / lead
        </UiButton>
        <UiButton variant='link' onClick={() => setView('more-info')}>
          More Info
        </UiButton>
      </div>
    </>
  );

  return (
    <>
      <style jsx>{styles}</style>
      <div className='marketing-details'>
        <div className='marketing-details__header'>
          <div className='marketing-details__header--title'>
            {marketing.headerTitle}
          </div>
        </div>

        <div className='marketing-details__create-account'>
          <div className='marketing-details__create-account--header'>
            {marketing.accountHeader || `${capitalize(merchant.name)} Free Tier`}
          </div>
          <div className='marketing-details__create-account--body'>
            {marketing.accountBody}
          </div>
          <div className='marketing-details__create-account--action'>
            <UiButton variant="lite round">create a free account</UiButton>
          </div>
        </div>

        <AdaptGrid gapY={20} xs={1} md={3} gap={10} variant='card'>
          {marketing.services?.map((svc: any, idx: number) => (
            <AdminMarketingProgram key={idx} {...svc} />
          ))}
        </AdaptGrid>
      </div>
    </>
  );
};

export default MarketingDetails;
