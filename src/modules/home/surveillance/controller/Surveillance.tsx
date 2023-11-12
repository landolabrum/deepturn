// Relative Path: ./Surveillance.tsx
import React from 'react';
import styles from './Surveillance.scss';
import UiMedia from '@webstack/components/UiVideo/controller/UiMedia';
import environment from '~/src/environment';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
// Remember to create a sibling SCSS file with the same name as this component

const Surveillance: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='surveillance'>
        <AdaptGrid xs={1} md={2} lg={3} padding="0 0 200px">
        {/* <UiMedia  type='image' variant='dark' src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=1`} /> */}
        <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=2`}/>
        <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=3`}/>
        {/* <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=4`}/> */}
      </AdaptGrid>
      </div>

    </>
  );
};

export default Surveillance;