import Document, { Html, Head, Main, NextScript } from "next/document";
import buildTimestamp  from '@webstack/hooks/useBuildDate'; // Ensure this import path is correct

export default class MyDocument extends Document {
  render() {
    // Assuming buildTimestamp is a function that returns the timestamp string
    const buildDate = buildTimestamp();

    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="./styles/global.css" />
          <link rel="stylesheet" href="./styles/theme.css" />
          {/* Other head elements */}
        </Head>
        <body id="app-body">
          <Main />
          <NextScript />
          <span style={{ visibility: 'hidden' }}>
          {`☠ Property of MindBurner Corporation ☠\nUnauthorized use is prohibited ☠☠☠☠☠☠☠☠☠☠
          ☠☠☠ ${JSON.stringify({"buildDate": "buildTimestamp()"})} ☠☠☠
          `}
          </span>
        </body>
      </Html>
    );
  }
}
