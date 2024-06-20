// Relative Path: ./Surveillance.tsx
import React, { useState } from 'react';
import styles from './Surveillance.scss';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import environment from '~/src/core/environment';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useEffect } from 'react';
import UiJoyStick from '@webstack/components/UiForm/components/UiJoyStick/UiJoyStick';




const Surveillance: React.FC = () => {
  const url1 = `${environment.serviceEndpoints.membership}/api/stream/rtsp?id=1`
  useEffect(() => { }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='surveillance'>
        <AdaptGrid xs={1} md={2} padding="0 0 200px">
          <div>
            <UiMedia src={url1} loadingText='loading camera 1' />
            <UiJoyStick/>
          </div>
          <div>
          <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp?id=2`} loadingText='loading camera 2' />
          </div>
        </AdaptGrid>
      </div>

    </>
  );
};

export default Surveillance;