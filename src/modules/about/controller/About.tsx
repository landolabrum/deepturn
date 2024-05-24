// Relative Path: ./About.tsx
import React from 'react';
import styles from './About.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import Services from '../../services/controller/Services';
import environment from '~/src/core/environment';
import AireHotelAbout from '../merchantViews/AireHotelAbout/AireHotelAbout';

// Remember to create a sibling SCSS file with the same name as this component

const AboutPage:React.FC<any> = () => {
  const {mid}=environment.merchant;
  const views = {
    'ah1':<AireHotelAbout/>
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div className='about'>
      {/* <UiLoader dots={false} text=''/> */}
      <UiViewLayout currentView={mid} views={views}/>
      </div>

    </>
  );
};

export default AboutPage;