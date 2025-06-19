// Relative Path: ./JoinForms.tsx
import React, { useCallback, useEffect, useState } from 'react';
import styles from './JoinForms.scss';
import environment from '~/src/core/environment';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import JoinRegister from '../views/JoinForms/JoinRegister';
import useScroll from '@webstack/hooks/useScroll';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';

// Remember to create a sibling SCSS file with the same name as this component

const JoinForms: React.FC = () => {
  const isOptIn = environment.merchant.settings?.optIn;
  const { openModal, closeModal, replaceModal, isModalOpen } = useModal();
  const [currentScrollYPosition, _] = useScroll();
  const user = useUser();
  const guest = useGuest();
  const handleOnBoarding = () => {
    const needsOnBoarding = !isModalOpen && isOptIn && isOptIn == true && user == null && guest == null;
    if (needsOnBoarding) {
      openModal({
        dismissable:false,
        // variant: 'fullscreen',
        children: <JoinRegister openModal={openModal} closeModal={closeModal} />
      })
    }
  };
  const init = () => {
    if (currentScrollYPosition > 50) {
      handleOnBoarding();

      // alert(currentScrollYPosition)
    }
  };
  useEffect(() => {
    init()
  }, [currentScrollYPosition])
  return (
    <>
      <style jsx>{styles}</style>
    </>
  );
};

export default JoinForms;