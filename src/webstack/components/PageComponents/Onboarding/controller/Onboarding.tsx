// Onboarding.tsx
import React, { useCallback, useEffect } from 'react';
import styles from './Onboarding.scss';
import environment from '~/src/core/environment';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import OnboardingForm from '../views/JoinForms/OnboardingForm';
import useScroll from '@webstack/hooks/useScroll';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';
import { useRouter } from 'next/router';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

const Onboarding: React.FC = () => {
  const { setSessionItem, getSessionItem } = useSessionStorage();
  const { pathname } = useRouter();
  const isOptIn = environment.merchant.settings?.optIn;
  const { openModal, closeModal, isModalOpen } = useModal();
  const [currentScrollYPosition] = useScroll();
  const user = useUser();
  const guest = useGuest();

  const handleOnBoarding = useCallback(() => {
    // Only on home route, after a bit of scroll
    if (!(pathname === '/' && currentScrollYPosition > 50)) return;

    const needsOnBoarding = !isModalOpen && !user && !guest /* && isOptIn === true */;
    if (!needsOnBoarding) return;

    // Read persisted flag with expiry metadata
    const meta = getSessionItem('hasOpened'); // -> { value: any, expiry?: number } | null
    const hasOpened = meta?.value === true;
    const expired = meta?.expiry ? Date.now() > meta.expiry : true; // if no expiry, treat as expired

    if (!hasOpened || expired) {
      // Set expiry for 30 seconds (seconds, not ms)
      setSessionItem('hasOpened', { value: true }, { expiry: 30 });

      openModal({
        title: `Join ${keyStringConverter(environment.merchant.name)}`,
        children: <OnboardingForm closeModal={closeModal} />
      });
    }
  }, [
    pathname,
    currentScrollYPosition,
    isModalOpen,
    user, guest,
    getSessionItem,
    setSessionItem,
    openModal, closeModal
  ]);

  useEffect(() => {
    handleOnBoarding();
  }, [handleOnBoarding]);

  return (
    <>
      <style jsx>{styles}</style>
    </>
  );
};

export default Onboarding;
