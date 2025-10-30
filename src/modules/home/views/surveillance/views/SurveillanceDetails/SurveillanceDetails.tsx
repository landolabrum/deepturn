// Relative Path: ./SurveillanceDetails.tsx
import React, { useEffect, useState } from 'react';
import styles from './SurveillanceDetails.scss';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import SurveillanceController from '../SurveillanceController/SurveillanceController';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import environment from '~/src/core/environment';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
const serverUrl:string = String(process.env.NEXT_PUBLIC_PRODUCTION_SERVER?.trim())

// Remember to create a sibling SCSS file with the same name as this component
interface ISurveillanceDetails {
  camera?:any
}
const SurveillanceDetails: React.FC<ISurveillanceDetails> = ({ camera }: ISurveillanceDetails) => {
  const [isSub, setIsSub] = useState(true);
  const isprod = environment?.isProduction;

  useEffect(() => {}, [camera]);
  
  if (!camera?.name_uri) return (
    <div style={{width: "100%"}}>
      <UiLoader text={`${camera?.name_uri  } failed`} dots={false} />
    </div>
  );
  

  // https://tiktok.soy/api/stream/rtsp/cam/id?=bb
  return (
    <>
      <style jsx>{styles}</style>
      <div className="surveillance-details">
        <div className="surveillance-details__header">
          <UiButton
            traits={{ width: "100px", beforeIcon: "fa-chevron-left" }}
            variant="link"
            href={"/god/?vid=surveillance"}
          >
            back
          </UiButton>
          <div className="surveillance-details__header--title">{camera?.name_uri}</div>
        </div>
        <div className="surveillance-details__body">
          <div className="surveillance-details__body--media">
            <UiMedia src={`https://tiktok.soy/api/stream/rtsp?id=${camera.name_uri}`} alt="thumbnail" controls autoplay  />
          </div>
          <div className="surveillance-details__body--controls">
            {camera?.ptz_pozition && (
              <SurveillanceController cameraId={keyStringConverter(camera.name_uri, { replace: "-" })} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveillanceDetails;