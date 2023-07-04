// deepturn/src/modules/home/stream/pages/StreamPage.tsx

import { useEffect, useRef, useState } from "react";
import environment from "~/src/environment";
import styles from "./StreamPage.scss";
import AdaptContainer from "@webstack/components/AdaptContainer/AdaptContainer";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import RtspCam from "../views/RtspCam";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";

const MAX_TIMEOUT = 35000;
const CAMS = 5;

const Stream = () => {
  const myRef = useRef<any>([]);
  const mainRef = useRef<any>(null);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const [errorImages, setErrorImages] = useState<string[]>([]);

  const handleImageLoad = (event: any) => {
    const img = event.target;
    img.classList.add("show");
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, img.src]);
  };

  const handleImageError = (event: any) => {
    const img = event.target;
    setErrorImages((prevErrorImages) => [...prevErrorImages, img.src]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const images = myRef.current;
      let allImagesLoaded = true;
      images.forEach((img: any) => {
        if (img?.complete && !loadedImages.includes(img.src)) {
          img.classList.add("show");
          setLoadedImages((prevLoadedImages) => [...prevLoadedImages, img.src]);
        } else {
          allImagesLoaded = false;
        }
      });

      if (allImagesLoaded) {
        clearInterval(interval);
      }
    }, 3000);

    // Stop interval after 60 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoad(true);
    }, MAX_TIMEOUT);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [setLoadedImages]);

  function handleMain(el: any) {
    const clickedImg = el.target;
    const clonedImg = clickedImg.cloneNode();
    // clonedImg.classList.add("main");
    clonedImg.style.height = "100%";
    clonedImg.style.width = "auto";
    clonedImg.onclick = function () {
      this.remove();
    };
    if (mainRef.current?.hasChildNodes()) {
      mainRef.current.replaceChild(clonedImg, mainRef.current.firstChild);
    } else {
      mainRef.current.appendChild(clonedImg);
    }
  }
  const RtspProps = { handleMain, handleImageLoad, handleImageError, loadedImages, load };
  return (
    <>
      <style jsx>{styles}</style>
      <div className="stream">
        <AdaptContainer>
          <div ref={mainRef} className="stream__main-container">
            <div className="stream__main-logo">
            <UiIcon icon="deepturn-logo"/>
          </div>
          </div>
        </AdaptContainer>
        <div className="stream__tray">
          <AdaptGrid xs={2} sm={3}>
            {Array.from(Array(5), (_, i) => i + 1).map((n) => {
              return (
                <span key={n}>
                  <RtspCam {...RtspProps} camera={n} />
                </span>
              );
            })}
            {/* <ImageLoader 
              src={`${streamUrl}1`} 
              alt={`cam-1`}
              onClick={handleMain} 
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {loadedImages.includes(`${streamUrl}1`) ? null : <Loading text={`cam ${1}`} />}
          <ImageLoader 
              src={`${streamUrl}2`} 
              alt={`cam-2`}
              onClick={handleMain} 
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {loadedImages.includes(`${streamUrl}2`) ? null : <Loading text={`cam ${2}`} />}
            <ImageLoader 
              src={`${streamUrl}3`} 
              alt={`cam-${3}`}
              onClick={handleMain} 
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {loadedImages.includes(`${streamUrl}3`) ? null : <Loading text={`cam ${3}`} />}
            <ImageLoader 
              src={`${streamUrl}4`} 
              alt={`cam-${4}`}
              onClick={handleMain} 
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {loadedImages.includes(`${streamUrl}4`) ? null : <Loading text={`cam ${4}`} />} 
            <ImageLoader 
              src={`${streamUrl}5`} 
              alt={`cam-5`}
              onClick={handleMain} 
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {loadedImages.includes(`${streamUrl}5`) ? null : <Loading text={`cam ${5}`} />} */}
          </AdaptGrid>
        </div>
      </div>
    </>
  );
};

export default Stream;

//  {/* {Array.from([1,2,3,4]).map(n=>{
//       return <>
//                 <ImageLoader
//       src={`${streamUrl}{n}`}
//       alt={`cam-${n}`}
//       onClick={handleMain}
//       handleImageLoad={handleImageLoad}
//       handleImageError={handleImageError}
//     />
//     {loadedImages.includes(`${streamUrl}${n}`) ? null : <Loading text={`cam ${n}`} />}
//       </>
//       })}
