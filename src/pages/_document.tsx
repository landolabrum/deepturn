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
          <span style={{ display: 'none' }}>
          {`☠☠☠☠☠☠☠☠☠☠☠☠☠ Property of MindBurner Corporation © ☠☠☠☠☠☠☠☠☠☠☠☠☠`}
          {` ☠☠☠☠☠☠☠☠☠☠☠☠☠ Unauthorized use is prohibited ☠☠☠☠☠☠☠☠☠☠☠☠☠`}  
          {`BUILD DATE: ( ${buildDate} )`}
          </span>
        </body>
      </Html>
    );
  }
}
