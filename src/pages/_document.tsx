import Document, { Html, Head, Main, NextScript } from "next/document";
import createBuildDate from "@webstack/helpers/createBuildDate";

export default class MyDocument extends Document {
  render() {
    // Assuming buildTimestamp is a function that returns the timestamp string
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="./styles/global.css" />
          <link rel="stylesheet" href="./styles/theme.css" />
        </Head>
        <body id="app-body">
          <Main />
          <NextScript />
          <span style={{ display: 'none' }}>
          {`☠☠☠☠☠☠☠☠☠☠☠☠☠ Property of MindBurner Corporation © ☠☠☠☠☠☠☠☠☠☠☠☠☠`}
          {` ☠☠☠☠☠☠☠☠☠☠☠☠☠ Unauthorized use is prohibited ☠☠☠☠☠☠☠☠☠☠☠☠☠`}  
          {`BUILD DATE: ( ${createBuildDate()} )`}
          </span>
        </body>
      </Html>
    );
  }
}
