// ImageControl.tsx
import React, { Children, cloneElement, useEffect, useRef, useState, isValidElement } from 'react';
import styles from './ImageControl.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import useClass from '@webstack/hooks/useClass';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import environment from '~/src/core/environment';

export type IImageVariant = 'center' | 'background' | string;
export type IImageMediaType = 'image' | 'video';

interface IImageControl {
  variant?: IImageVariant;
  mediaType?: IImageMediaType;
  children?: React.ReactNode;
  refreshInterval?: number;
  error?: string | React.ReactElement;
  fixedLoad?: boolean;
  loadingText?: string;
  onComplete?: (e: any) => void;
  isPlaying?: boolean;

  // New props for play/pause control
  onPlayPauseClick?: () => void;
  showPlayPause?: boolean;
}

const ImageControl: React.FC<IImageControl> = ({
  children,
  variant,
  mediaType = 'image',
  refreshInterval = 1000,
  error,
  loadingText,
  fixedLoad = false,
  onComplete,
  onPlayPauseClick,
  showPlayPause,
  isPlaying
}) => {
  const childRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const clzz: string = useClass({ cls: 'image-control__element', type: mediaType, variant });
  const { openModal, closeModal, isModalOpen } = useModal();

  const handleExpand = () => {
    if (!isModalOpen) {
      openModal({
        children: (
          <ImageControl
            fixedLoad
            variant={variant}
            mediaType={mediaType}
            refreshInterval={refreshInterval}
            error={error}
          >
            {children}
          </ImageControl>
        ),
        variant: 'fullscreen',
      });
    } else {
      closeModal();
    }
  };

  useEffect(() => {
    // Once we detect a valid size, we consider the media loaded
    const mediaHeight = childRef?.current?.offsetHeight;
    if (childRef.current && !loading) {
      onComplete?.({ src: Boolean(mediaHeight && mediaHeight > 10), loading });
    }
  }, [childRef.current, loading, onComplete]);

  useEffect(() => {
    // Poll to see if the child has a size > 0
    const interval = setInterval(() => {
      const mediaHeight = childRef?.current?.offsetHeight;
      const mediaWidth = childRef?.current?.offsetWidth;
      const imageSrc = Boolean(mediaHeight && mediaHeight > 30) || Boolean(mediaWidth && mediaWidth > 10);

      if (childRef.current && imageSrc && loading === true) {
        setLoading(false);
      } else {
        if (error && !loading) setLoading(true);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, setLoading, error, loading]);

  return (
    <>
      <style jsx>{styles}</style>
      <div  className={`image-control${loading ? ' image-control__loading' : ''}${variant ? ` image-control--${variant}` : ''}`}>
        {loading && (
          <UiLoader
            position={!fixedLoad ? 'relative' : undefined}
            text={typeof error === 'string' ? error : loadingText}
            dots={['string', 'object'].includes(typeof error) ? false : undefined}
          />
        )}
        <div id="image-control__element" className={clzz} ref={childRef}>
        {!isPlaying && variant != 'background' && (
          <div className='image-control__play' onClick={onPlayPauseClick}>
          <UiIcon width={100} height={100} icon={`${environment.merchant.name}-logo`} />
          </div>
        )}
          {Children.map(children, (child) => (isValidElement(child) ? cloneElement(child) : child))}
        </div>

        {/* Custom Controls */}
        <div className="image-control__controls">
          {/* Only show play/pause if it's a video */}
          {showPlayPause && (
            <div className="image-control__controls__control">
              <UiIcon icon="fa-play-pause" onClick={onPlayPauseClick} />
            </div>
          )}
          <div className="image-control__controls__control">
            <UiIcon icon="fa-expand" onClick={handleExpand} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageControl;
