// Relative Path: ./404.tsx
import React, { useEffect, useState } from 'react';
import styles from './Custom404.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const Custom404: React.FC = () => {
  const router = useRouter();
  const [location, setLoc ]=useState<string>('');

  
  useEffect(() => {
    if(router.query && typeof router.query.loc == 'string')setLoc(router.query.loc);
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='custom-404'>
        <div className='custom-404__container'>
          <div className='custom-404__content'>
            <div className='custom-404__content--header'>
              <div className='custom-404__content--header__title'>
                <div>
                  <UiButton 
                  variant='lite' 
                  traits={{beforeIcon:'fa-chevron-left'}} onClick={()=>router.push('/')}>back</UiButton>
                </div>
                <UiIcon icon='fa-exclamation-triangle' />{`This page does not exist`}
              </div>
              <div className='custom-404__content--header__location'>
              {location}
              </div>

            </div>
            <div className='custom-404__content--content'>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
