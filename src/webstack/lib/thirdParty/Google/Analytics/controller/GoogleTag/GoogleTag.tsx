import React from 'react';
import Script from 'next/script';
interface IGoogleTag {
    gtag?: string;
}
const GoogleTag = ({ gtag }: IGoogleTag) =>{
    if (!gtag) return 'missing gtag';
    return (
        <>
            {/* Load the main gtag script */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}
                strategy="afterInteractive"
            />

            {/* Initialize gtag once the script is loaded */}
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag}');
        `}
            </Script>
        </>
    );
}
export default GoogleTag;