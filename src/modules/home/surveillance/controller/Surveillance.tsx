// Relative Path: ./Surveillance.tsx
import React from 'react';
import styles from './Surveillance.scss';
import UiMedia from '@webstack/components/UiVideo/controller/UiMedia';
import environment from '~/src/environment';
// Remember to create a sibling SCSS file with the same name as this component

const Surveillance: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='surveillance'>
        <UiMedia 
          type='image'
          variant='dark'
          src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=1`}
        />
        <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=2`}/>
        <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=3`}/>
        <UiMedia src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=4`}/>
      </div>
    </>
  );
};

export default Surveillance;