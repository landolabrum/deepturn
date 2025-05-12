// Relative Path: ./SurveillanceDetails.tsx
import React, { useEffect, useState } from 'react';
import styles from './SurveillanceDetails.scss';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import SurveillanceController from '../SurveillanceController/SurveillanceController';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import environment from '~/src/core/environment';
const serverUrl:string = String(process.env.NEXT_PUBLIC_PRODUCTION_SERVER?.trim())

// Remember to create a sibling SCSS file with the same name as this component
interface ISurveillanceDetails {
  id?: string;
}
const SurveillanceDetails: React.FC<ISurveillanceDetails> = ({ id: id }: ISurveillanceDetails) => {
  const [isSub, setIsSub] = useState(true);

  const isprod = environment?.isProduction;

  const { push } = useRouter();
  if (!id) return <>no src</>;
  return (
    <>
      <style jsx>{styles}</style>
      <div className='surveillance-details'>
        <div className='surveillance-details__header'>
          <UiButton traits={{ width: "100px", beforeIcon: "fa-chevron-left" }} variant='link' onClick={() => push('/home/', { query: undefined })}>back</UiButton>
          <div className='surveillance-details__header--title'>{id}</div>
        </div>
        <div className='surveillance-details__body'>
          <div className='surveillance-details__body--media'>
            <UiMedia src={`https://${serverUrl}/api/stream/rtsp?id=${id}`} />
          </div>
          <div className='surveillance-details__body--controls'>
            <SurveillanceController cameraId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveillanceDetails;