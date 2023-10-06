// Relative Path: ./Instagram.tsx
import React from 'react';
import styles from './Instagram.scss';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const Instagram: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <h1>Instagram</h1>
<AdapTable
data={[
  {"":
  <UiButton 
    variant="dark"
    traits={{
    afterIcon:{
      icon:"theme-skull",
      color:"#f30"
    }
    
  }}>Find User from Photos</UiButton>}
]}

/>
    </>
  );
};

export default Instagram;