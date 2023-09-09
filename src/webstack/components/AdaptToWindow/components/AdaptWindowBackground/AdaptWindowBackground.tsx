import React, { useRef, useState } from "react";
import { IAdaptToWindow, IAdaptToWindowBackground } from "../../models/IAdaptToWindow";
import styles from './AdaptWindowBackground.scss';
export default function AdaptWindowBackground({background}:{background:IAdaptToWindowBackground}) {
    const [visible, setVisible]=useState<boolean>(false);
    const backgroundRef = useRef<null | any>(null);
    setTimeout(() => {
        setVisible(true)
    }, 1000);
    function isReactElement(
        background: IAdaptToWindow["background"]
      ): background is React.ReactElement {
        return React.isValidElement(background);
      }
      
      function isVideoBackground(
        background: IAdaptToWindow["background"]
      ): background is { url: string; type: string } {
        return !isReactElement(background) && background?.type === "video";
      }
    if (isVideoBackground(background)) {
      return (
        <>
          <style jsx>{styles}</style>
          <video autoPlay loop muted playsInline className={`adapt-to-window__video${visible?' visible':''}`} ref={backgroundRef}>
            <source src={background.url} type="video/mp4" />
          </video>
        </>
      );
    }
    // Handle other background types here...
  
    return null; // or return 'poop' or whatever you want as a default
  }