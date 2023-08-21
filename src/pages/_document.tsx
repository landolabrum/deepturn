
// import useDarkMode from "@webstack/hooks/useDarkMode";
import Document, { Html, Head, Main, NextScript } from "next/document";
// import { GA_TRACKING_ID } from "../utils/gtag";
// import favicon from "../static/favicon/fav-32x32.ico"
{/* <link rel="shortcut icon" href={favicon.src}/> */ }
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
          <Head>
            <link rel="stylesheet" href="/styles/global.css" />
            <link rel="stylesheet" href="/styles/theme.css" />
            
          </Head>
        <body id="app-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}