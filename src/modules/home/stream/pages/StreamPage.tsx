import { useEffect, useRef, useState } from "react";
import environment from "~/src/environment";
import styles from "./StreamPage.scss";
import AdaptContainer from "@webstack/components/AdaptContainer/AdaptContainer";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import RtspCam from "../views/RtspCam";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";

const MAX_TIMEOUT = 35000;
const CAMS = 3;

const Stream = () => {
  const myRef = useRef<any>([]);
  const mainRef = useRef<any>(null);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const [scale, setScale] = useState(1); // State to track the current scale

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
    if (mainRef.current.contains(el.target)) return; // Check if the clicked element is already in mainRef

    const clickedImg = el.target;
    const clonedImg = clickedImg.cloneNode();
    clonedImg.style.height = "100%";
    clonedImg.style.width = "auto";
    if (mainRef.current?.hasChildNodes()) {
      mainRef.current.replaceChild(clonedImg, mainRef.current.firstChild);
    } else {
      mainRef.current.appendChild(clonedImg);
    }
  }

  function handleZoom(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (event.target !== mainRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    event.currentTarget.style.transformOrigin = `${xPercent}% ${yPercent}%`;

    if (scale < 2) {
      setScale(prevScale => prevScale * 1.1);
      event.currentTarget.style.transform = `scale(${scale * 1.1})`;
    } else {
      setScale(1);
      event.currentTarget.style.transform = 'scale(1)';
    }
}


  const StreamPage = { handleMain, handleImageLoad, handleImageError, loadedImages, load };
  return (
    <>
      <style jsx>{styles}</style>
      <div className="stream">
        <div
          ref={mainRef}
          className={`stream__main-container ${isZoomed ? 'zoomed' : ''}`}
          onClick={handleZoom}
        >
          <div className="stream__main-logo">
            <UiIcon icon="deepturn-logo" />
          </div>
        </div>
        <div className="stream__tray">
          <AdaptGrid xs={2} sm={3}>
            {Array.from(Array(CAMS), (_, i) => i + 1).map((n) => {
              return (
                <span key={n}>
                  <RtspCam {...StreamPage} camera={n} />
                </span>
              );
            })}
          </AdaptGrid>
        </div>
      </div>
    </>
  );
};

export default Stream;
