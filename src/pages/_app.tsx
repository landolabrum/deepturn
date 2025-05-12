import React from 'react';

import Head from "next/head";
import type { AppProps } from "next/app";
import MainLayout from "../layouts/default/DefaultLayout";
import ServiceContainer from "@webstack/components/ServiceContainer/ServiceContainer";
import styles from "~/src/layouts/default/DefaultLayout.scss"
import { OverlayProvider } from "@webstack/components/Overlay/Overlay";
import { HeaderProvider } from "@webstack/components/Containers/Header/controller/MainHeader";
import { NotificationProvider } from "@webstack/components/Notification/Notification";
import { ModalProvider } from "@webstack/components/Containers/modal/contexts/modalContext";
import { ModalOverlay } from "@webstack/components/Containers/modal/views/modalOverlay";
import { LoaderProvider } from "@webstack/components/Loader/Loader";
import GoogleTag from '@webstack/lib/thirdParty/Google/Analytics/controller/GoogleTag/GoogleTag';


// import { appWithTranslation } from 'next-i18next';


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
      </OverlayProvider>
      <GoogleTag gtag={gtag} />

    </>
  );
}

export default MyApp;
//export default  appWithTranslation(MyApp)
