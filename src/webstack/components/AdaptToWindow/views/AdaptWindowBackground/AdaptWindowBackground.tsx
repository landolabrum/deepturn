import React, { useEffect, useRef, useState } from "react";
import { IAdaptToWindow, IAdaptWinBg } from "../../models/IAdaptToWindow";
import styles from './AdaptWindowBackground.scss';
import { IWindow } from "@webstack/hooks/useWindow";

interface IAdaptWindowBackground{
  background: IAdaptWinBg;
  window: IWindow
}
export default function AdaptWindowBackground({ background, window }: IAdaptWindowBackground) {
  const [visible, setVisible] = useState<boolean>(false);
  const [sizeClass, setSizeClass] = useState<string>('');
  const backgroundRef = useRef<null | any>(null);
  const {width, height}=window;
  setTimeout(() => {
    setVisible(true)
  }, 1000);

  function classHandler() {
    let context = 'landscape'; // Default to landscape

    switch (true) {
        case width <= 900:
            context = background?.sm || 'portrait'; // Use background.sm if defined, otherwise default to 'portrait'
            break;
        case width <= 1100:
            context = background?.md || 'landscape'; // Use background.md if defined, otherwise default to 'landscape'
            break;
        case width <= 1250:
            context = background?.lg || 'landscape'; // Use background.lg if defined, otherwise default to 'landscape'
            break;
        default:
            // default case if needed
            break;
    }

    return ` adapt-to-window__video__${context}`;
}


  useEffect(() => {
    if(window && background.type)setSizeClass(classHandler())
  }, [window || background]);
  if (background?.type == 'video') {
    return (
      <>
        <style jsx>{styles}</style>
        {/* <div className='dev' style={{top: '60px'}}>
          background: {JSON.stringify(sizeClass)}
        </div> */}
        <video autoPlay loop muted playsInline 
          className={`adapt-to-window__video${visible ? ' adapt-to-window__video__visible' : ''}${sizeClass}`}
        ref={backgroundRef}>
          <source src={background.url} type="video/mp4" />
        </video>
      </>
    );
  }
  // Handle other background types here...

  return null; // or return 'poop' or whatever you want as a default
}