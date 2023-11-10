// Relative Path: ./Surveillance.tsx
import React from 'react';
import styles from './Surveillance.scss';
import UiVideo from '@webstack/components/UiVideo/controller/UiVideo';
import environment from '~/src/environment';
// Remember to create a sibling SCSS file with the same name as this component

const Surveillance: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='surveillance'>
        <UiVideo src={`${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=2`}/>
      </div>
    </>
  );
};

export default Surveillance;