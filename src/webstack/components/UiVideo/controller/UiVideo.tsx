import React, { useEffect, useRef, useState } from 'react';
import styles from './UiVideo.scss';

export interface IVideo {
  src: string;
  refreshInterval?: number; // Interval in milliseconds to refresh the image
}

const UiVideo: React.FC<IVideo> = ({ src, refreshInterval = 1000 }: IVideo) => {
const imgRef = useRef<any>(null);
const [loaded, setLoaded]=useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
        console.log(imgRef.current.offsetHeight)
        }, refreshInterval);
      // Append a timestamp to the src URL to avoid browser caching

    return () => clearInterval(interval);
  }, [src, refreshInterval, imgRef.current]);

  return (
    <>
      <style jsx>{styles}</style>

      <img
        ref={imgRef}
        src={src} 
        alt="Stream"
        />

    </>
  );
};

export default UiVideo;
