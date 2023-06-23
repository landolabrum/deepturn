// import globalStyles from "../styles/global.scss";
// import themeStyles from "../styles/theme.scss";
import Head from "next/head";
import type { AppProps } from "next/app";
import DefaultLayout from "../layouts/default/DefaultLayout";
import ModalContainer from "@webstack/components/ModalContainer/ModalContainer";
import ServiceContainer from "@webstack/components/ServiceContainer/ServiceContainer";
import { appWithTranslation } from 'next-i18next';
import styles from "~/src/layouts/default/DefaultLayout.scss"
import { useState } from "react";
import Navbar from "@shared/components/Navbar/views/Navbar";
import { OverlayProvider } from "@webstack/components/Overlay/Overlay";
import { HeaderProvider } from "@webstack/components/Header/views/Header";


const ZENDESK_KEY = "73bedd9b-0cdd-46a4-ad2e-b2ea5b72699d"
const setting = {
  color: {
    theme: "#000"
  },
  offset: {
    horizontal: "0px",
    vertical: "0px",
    mobile: {
      horizontal: "-20px",
      vertical: "36px",
    }
  },
  launcher: {
    chatLabel: {
      "en-US": "Need Help"
    }
  },
  contactForm: {
    fields: [
      { id: "description", prefill: { "*": "My pre-filled description" } }
    ]
  }
};

declare global {
  interface Window {
    zEmbed: any;
    zE: any;
  }
}



const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style jsx>{styles}</style>
        <ServiceContainer />
      <OverlayProvider>
        <Navbar />
        <HeaderProvider>
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
          <ModalContainer />
        </HeaderProvider>
      </OverlayProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
