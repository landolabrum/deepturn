import React, { Children, cloneElement, useEffect, useRef, useState, isValidElement } from 'react';
import styles from './ImageControl.scss';
import UiLoader from '../UiLoader/UiLoader';
import useClass from '@webstack/hooks/useClass';

export type IImageVariant = 'center' | string;
export type IImageMediaType = 'image' | 'video';


interface IImageControl {
  variant?: IImageVariant;
  mediaType?: IImageMediaType;
  children?: React.ReactNode;
  refreshInterval?: number; // Interval in milliseconds to refresh the image
  error?: string;
}

const ImageControl: React.FC<IImageControl> = ({ children, variant, mediaType = 'image', refreshInterval = 1000, error }) => {
  const childRef = useRef<HTMLDivElement | null>(null); // Change to HTMLDivElement
  const [loading, setLoading] = useState<boolean>(true);
  const clzz: string = useClass('image-control__element', mediaType, variant);
  
  useEffect(() => {
    // if (!loading || error) return;
    const interval = setInterval(() => {
      const mediaHeight = childRef?.current?.offsetHeight;
      const hasSrc = Boolean(mediaHeight && mediaHeight > 30);
      if (childRef.current && hasSrc) {
        setLoading(false);
      } else {
        if (error && !loading) setLoading(true);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, loading, childRef.current]); // Include 'loaded' and 'mediaHeight' in dependencies

  return (
    <>
      <style jsx>{styles}</style>
      <div className='image-control' > {/* Attach the ref here */}
        {loading == true && <UiLoader
          height={400}
          position='relative'
          text={error || undefined}
          dots={typeof error == 'string' ? false: undefined}
        />}
        <div id='image-control__element' className={`${clzz}`} ref={childRef}>
          {Children.map(children, child =>
            isValidElement(child) ? cloneElement(child) : child // Removed the ref here
          )}
        </div>
      </div>
    </>
  );
};

export default ImageControl;