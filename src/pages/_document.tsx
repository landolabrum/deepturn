import Document, { Html, Head, Main, NextScript } from "next/document";
import ProjectBuildDate from "@webstack/lib/project/BuildDate/ProjectBuildDate";
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="./styles/global.css" />
          <link rel="stylesheet" href="./styles/d3.css" />
          <link rel="stylesheet" href="./styles/mapbox-gl.css" />
        </Head>
        <body id="app-body">
          <Main />
          <NextScript />
          <ProjectBuildDate/>
        </body>
      </Html>
    );
  }
}
