import Head from "next/head";
import type { AppProps } from "next/app";
import DefaultLayout from "../layouts/default/DefaultLayout";
import ServiceContainer from "@webstack/components/ServiceContainer/ServiceContainer";
import { appWithTranslation } from 'next-i18next';
import styles from "~/src/layouts/default/DefaultLayout.scss"
import { OverlayProvider } from "@webstack/components/Overlay/Overlay";
import { HeaderProvider } from "@webstack/components/Header/controller/Header";
import useDarkMode from "@webstack/hooks/useDarkMode";
import { NotificationProvider } from "@webstack/components/Notification/Notification";
import { ModalProvider } from "@webstack/components/modal/contexts/modalContext";
import { ModalOverlay } from "@webstack/components/modal/views/modalOverlay";
import { LoaderProvider } from "@webstack/components/Loader/Loader";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe('pk_live_qBiVh0MkAYVU7o3oVmP1Tzg900DLvxesSw');



const MyApp = ({ Component, pageProps }: AppProps) => {


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {useDarkMode() ? <link rel="shortcut icon" href="/assets/favicon-dark.ico" /> : <link rel="shortcut icon" href="/assets/favicon-lite.ico" />}
      </Head>
      <style jsx>{styles}</style>
      <ServiceContainer />
      <OverlayProvider>
        <LoaderProvider>
          <NotificationProvider>
            <ModalProvider>
              <HeaderProvider>
                <ModalOverlay />

                <DefaultLayout>
                  <Elements stripe={stripePromise}>

                    <Component {...pageProps} />
                  </Elements>
                </DefaultLayout>
              </HeaderProvider>
            </ModalProvider>
          </NotificationProvider>
        </LoaderProvider>
      </OverlayProvider>
    </>
  );
}

export default MyApp;
//export default  appWithTranslation(MyApp)
