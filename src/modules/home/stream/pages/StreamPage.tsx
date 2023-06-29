// deepturn/src/modules/home/stream/pages/StreamPage.tsx

import { useEffect, useRef, useState } from "react";
import environment from "~/src/environment";
import styles from "./StreamPage.scss";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
import AdaptContainer from "@webstack/components/AdaptContainer/AdaptContainer";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
const MAX_TIMEOUT = 35000;


const ImageLoader = ({ src, alt, onClick, handleImageLoad, handleImageError }:any) => {
  return (
    <>
    <style jsx>{styles}</style>
    <img 
      onClick={onClick}
      onLoad={handleImageLoad}
      onError={handleImageError}
      src={src} 
      alt={alt}
    />
    </>
  );
};


const Stream = () => {
  const myRef = useRef<any>([]);
  const mainRef = useRef<any>(null);
  const streamUrl = environment.serviceEndpoints.membership + "/stream/cam-";
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const [errorImages, setErrorImages] = useState<string[]>([]);
  
  const handleImageLoad = (event:any) => {
    const img = event.target;
    img.classList.add("show");
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, img.src]);
  };

  const handleImageError = (event:any) => {
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

  const Loading = ({ text }: any) => (
    <>
      <style jsx>{styles}</style>
      <div className="stream__loading">
        <div>
          <UiLoader text={!load ? text : `${text}, Fail`} height="auto" dots={!load} width="100%" position="unset" />
        </div>
      </div>
    </>
  );

  function handleMain(el: any) {
    const clickedImg = el.target;
    const clonedImg = clickedImg.cloneNode();
    clonedImg.onclick = function () {
      this.remove();
    };
    if (mainRef.current?.hasChildNodes()) {
      mainRef.current.replaceChild(clonedImg, mainRef.current.firstChild);
    } else {
      mainRef.current.appendChild(clonedImg);
    }
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div className="stream">
        <AdaptContainer>
          <div ref={mainRef} className="stream__main-container">
            <ImageLoader 
              src={`${streamUrl}3`} 
              alt="cam-3"
              onClick={handleMain} 
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {loadedImages.includes(`${streamUrl}3`) ? null : <Loading text="cam 3" />}
          </div>
        </AdaptContainer>
        <div className="stream__tray">
          <AdaptGrid xs={2} sm={3}>
          <ImageLoader 
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
            {/* {Array.from([1,2,3,4]).map(n=>{
              return <>
                        <ImageLoader 
              src={`${streamUrl}{n}`} 
              alt={`cam-${n}`}
              onClick={handleMain} 
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {loadedImages.includes(`${streamUrl}${n}`) ? null : <Loading text={`cam ${n}`} />}
              </>
              })} */}

          </AdaptGrid>
        </div>
      </div>
    </>
  );
};

export default Stream;
