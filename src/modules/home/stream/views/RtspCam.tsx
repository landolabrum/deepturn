import React, { useEffect, useState } from "react";
import styles from "./RtspCam.scss";
import environment from "~/src/environment";
import UiLoader from "@webstack/components/UiLoader/UiLoader";

// Remember to create a sibling SCSS file with the same name as this component
const ImageLoader = ({ src, alt, onClick, handleImageLoad, handleImageError }: any) => {
  return (
    <>
      <style jsx>{styles}</style>
      <img onClick={onClick} onLoad={handleImageLoad} onError={handleImageError} src={src} alt={alt} />
    </>
  );
};
const RtspCam: React.FC<any> = ({ camera, handleMain, handleImageLoad, handleImageError, loadedImages, load }: any) => {
  const [od, setOd]=useState<boolean>(false);
  const streamUrl = `${environment.serviceEndpoints.membership}/api/stream/rtsp/?id=${camera}`;
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
    useEffect(()=>{},[loadedImages]);
  return (
    <>
      <style jsx>{styles}</style>
      {/* <span onClick={()=>setOd(!od)}>object detection</span> */}
      <ImageLoader
        src={`${streamUrl}`}
        alt={`rtsp-camera-feed-${camera}`}
        onClick={handleMain}
        handleImageLoad={handleImageLoad}
        handleImageError={handleImageError}
      />
      
      {loadedImages.includes(`${streamUrl}`) ? null : <Loading text={`cam-${camera}`} />}
    </>
  );
};

export default RtspCam;
