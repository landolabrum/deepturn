// Relative Path: ./Surveillance.tsx
import React from 'react';
import styles from './Surveillance.scss';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import environment from '~/src/environment';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { useEffect } from 'react';

const Surveillance: React.FC = () => {
  const level = useUser();
  useEffect(() => {}, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='surveillance'>
        <AdaptGrid xs={1} md={2} padding="0 0 200px">
    
        {/* <UiMedia  type='image' variant='dark' src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=1`} /> */}
        <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=1`} loadingText='loading camera 1'/>
        <UiMedia rotate={180} src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=2`} loadingText='loading camera 2'/>
        <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=3`} loadingText='loading camera 3'/>
        <UiMedia  src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=4`} loadingText='loading camera 4'/>
      </AdaptGrid>
      </div>

    </>
  );
};

export default Surveillance;