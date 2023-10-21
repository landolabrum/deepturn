import Head from "next/head";
import type { AppProps } from "next/app";
import DefaultLayout from "../layouts/default/DefaultLayout";
import ServiceContainer from "@webstack/components/ServiceContainer/ServiceContainer";
import { appWithTranslation } from 'next-i18next';
import styles from "~/src/layouts/default/DefaultLayout.scss"
import { OverlayProvider } from "@webstack/components/Overlay/Overlay";
import { HeaderProvider } from "@webstack/components/Header/views/Header";
import useDarkMode from "@webstack/hooks/useDarkMode";
import { ModalProvider } from "@webstack/modal/contexts/modalContext";
import { ModalOverlay } from "@webstack/modal/views/modalOverlay";
import { NotificationProvider } from "@webstack/components/Notification/Notification";


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
        {useDarkMode() ? <link rel="shortcut icon" href="/assets/favicon-dark.ico" /> : <link rel="shortcut icon" href="/assets/favicon-lite.ico" />}
      </Head>
      <style jsx>{styles}</style>
      <ServiceContainer />
      <OverlayProvider>
        <NotificationProvider>
          <ModalProvider>
            <HeaderProvider>
              <ModalOverlay />
              <DefaultLayout>
                <Component {...pageProps} />
              </DefaultLayout>

            </HeaderProvider>
          </ModalProvider>
        </NotificationProvider>
      </OverlayProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
