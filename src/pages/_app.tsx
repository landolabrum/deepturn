import React, { useEffect } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import MainLayout from '../webstack/layouts/default/controller/DefaultLayout';
import ServiceContainer from '@webstack/components/ServiceContainer/ServiceContainer';
import styles from '@webstack/layouts/default/controller/DefaultLayout.scss';

import { OverlayProvider } from '@webstack/components/AppOverlay/AppOverlay';
import { HeaderProvider } from '@webstack/components/Containers/Header/controller/MainHeader';
import { NotificationProvider } from '@webstack/components/Notification/Notification';
import { ModalProvider } from '@webstack/components/Containers/modal/contexts/modalContext';
import { ModalOverlay } from '@webstack/components/Containers/modal/views/modalOverlay';
import { LoaderProvider } from '@webstack/components/Loader/Loader';
import GoogleTag from '@webstack/lib/thirdParty/Google/Analytics/controller/GoogleTag/GoogleTag';

import {
  LayoutProvider,
  useLayout,
} from '@webstack/layouts/default/hooks/useLayout';

const ApplyLayoutStyles = () => {
  const { layout } = useLayout();
  type LayoutStyleKeys = 'background' | 'zIndex' | 'position';

  useEffect(() => {
    // Apply the basic styles
    if (layout?.background) document.body.style.background = layout.background;
    if (layout?.zIndex) document.body.style.zIndex = layout.zIndex as any;
    if (layout?.position) {
      document.body.style.position = layout.position;

      // Extra handling for fixed positioning
      if (layout.position === 'fixed') {
        document.body.style.top = '0';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
      } else {
        // Reset if not fixed
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
      }
    }

    return () => {
      // Reset body styles when layout changes or component unmounts
      document.body.style.background = '';
      document.body.style.zIndex = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
    };
  }, [layout]);

  return null;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const gtag = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style jsx>{styles}</style>
      <ServiceContainer />
      <OverlayProvider>
        <LayoutProvider>
          <ApplyLayoutStyles />
          <LoaderProvider>
            <NotificationProvider>
              <ModalProvider>
                <HeaderProvider>
                  <ModalOverlay />
                  <MainLayout>
                    <Component {...pageProps} />
                  </MainLayout>
                </HeaderProvider>
              </ModalProvider>
            </NotificationProvider>
          </LoaderProvider>
        </LayoutProvider>
      </OverlayProvider>
      <GoogleTag gtag={gtag} />
    </>
  );
};

export default MyApp;
