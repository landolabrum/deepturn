// Relative Path: ./AboutPage.tsx
import React from 'react';
import styles from './AboutPage.scss';
import environment from '~/src/core/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

// Remember to create a sibling SCSS file with the same name as this component

const AboutPage: React.FC = () => {
    const {merchant }=environment;

  return (
    <>
      <style jsx>{styles}</style>
      <div className='about-page'>
      <div className='about-page__header'>
      <h1 className='about-page__header--title'>
        {merchant?.name&&keyStringConverter(merchant.name,{textTransform:'capitalize'})}
      </h1>
      <h3
      className='about-page__header--sub-title'>
        {merchant?.name&&keyStringConverter(merchant.name,{textTransform:'capitalize'})}
        {merchant?.settings?.about?.description}
      </h3>
      </div>
      <div className='about-page__body'>
      </div>
      </div>
    </>
  );
};

export default AboutPage;