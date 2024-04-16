// Relative Path: ./About.tsx
import React from 'react';
import styles from './About.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import Services from '../../services/controller/Services';

// Remember to create a sibling SCSS file with the same name as this component

const AboutPage:React.FC<any> = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='about'>
      {/* <UiLoader dots={false} text=''/> */}
      {/* <UiViewLayout /> */}
      <div className='about-section'>
      <Services/>

      </div>
      </div>

    </>
  );
};

export default AboutPage;