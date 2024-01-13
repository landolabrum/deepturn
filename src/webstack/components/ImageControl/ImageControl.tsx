import React, { Children, cloneElement, useEffect, useRef, useState, isValidElement } from 'react';
import styles from './ImageControl.scss';
import UiLoader from '../UiLoader/view/UiLoader';
import useClass from '@webstack/hooks/useClass';
import { UiIcon } from '../UiIcon/UiIcon';
import { useModal } from '../modal/contexts/modalContext';

export type IImageVariant = 'center' | string;
export type IImageMediaType = 'image' | 'video';


interface IImageControl {
  variant?: IImageVariant;
  mediaType?: IImageMediaType;
  children?: React.ReactNode;
  refreshInterval?: number; // Interval in milliseconds to refresh the image
  error?: string;
  fixedLoad?: boolean;
  loadingText?: string
}

const ImageControl: React.FC<IImageControl> = ({ children, variant, mediaType = 'image', refreshInterval = 1000, error, loadingText, fixedLoad=false }) => {
  const childRef = useRef<HTMLDivElement | null>(null); // Change to HTMLDivElement
  const [loading, setLoading] = useState<boolean>(true);
  const clzz: string = useClass('image-control__element', mediaType, variant);
  const { openModal, closeModal, isModalOpen } = useModal();

  const handleExpand = () => {
    !isModalOpen ? openModal(
      {
        children: <ImageControl
          fixedLoad
          variant={variant}
          mediaType={mediaType}
          refreshInterval={refreshInterval}
          error={error}>
          {children}
        </ImageControl>,
        variant: 'fullscreen'
      }
    ): closeModal();
  };

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
      <div 
        className={`image-control${loading?' image-control__loading':""}`} 
      > {/* Attach the ref here */}
        {loading == true && <UiLoader
          height={300}
          position={!fixedLoad?'relative':undefined}
          text={ error || loadingText  || undefined}
          dots={['string','object'].includes(typeof error) ? false : undefined}
        />}
        <div id='image-control__element' className={`${clzz}`} ref={childRef}>
          {Children.map(children, child =>
            isValidElement(child) ? cloneElement(child) : child // Removed the ref here
          )}
        </div>
        <div className='image-control__controls'>
          <div className='image-control__controls__control'>
            <UiIcon icon='fa-play-pause' />
          </div>
          <div className='image-control__controls__control'>
            <UiIcon icon='fa-expand' onClick={handleExpand} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageControl;