import { useEffect, useRef, useState } from "react";
import environment from "~/src/environment";
import styles from "./StreamPage.scss";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
import AdaptContainer from "@webstack/components/AdaptContainer/AdaptContainer";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
const MAX_TIMEOUT = 23000;

const Stream = () => {
  const myRef = useRef<any>([]);
  const mainRef = useRef<any>(null);
  const streamUrl = environment.serviceEndpoints.membership + "/stream/cam-";
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(false);
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
            {loadedImages.includes(`${streamUrl}3`) ? (
              <img className="living" onClick={handleMain} src={`${streamUrl}3`} alt="cam-3" />
            ) : (
              <UiLoader height="auto" width="100%" position="unset" />
            )}
          </div>
        </AdaptContainer>
        <div className="stream__tray">
          <AdaptGrid xs={2} sm={3}>
            <img
              ref={(el) => {
                if (el && !myRef.current.includes(el)) {
                  myRef.current.push(el);
                }
              }}
              onClick={handleMain}
              src={`${streamUrl}1`}
              alt="cam-1"
            />
            {loadedImages.includes(`${streamUrl}1`) ? null : <Loading text="cam 1" />}
            <img
              ref={(el) => {
                if (el && !myRef.current.includes(el)) {
                  myRef.current.push(el);
                }
              }}
              onClick={handleMain}
              src={`${streamUrl}2`}
              alt="cam-2"
            />
            {loadedImages.includes(`${streamUrl}2`) ? null : <Loading text="cam 2" />}
            <img
              className="living"
              ref={(el) => {
                if (el && !myRef.current.includes(el)) {
                  myRef.current.push(el);
                }
              }}
              onClick={handleMain}
              src={`${streamUrl}3`}
              alt="cam-3"
            />
            {loadedImages.includes(`${streamUrl}3`) ? null : <Loading text="cam 3" />}
          </AdaptGrid>
        </div>
      </div>
    </>
  );
};

export default Stream;
