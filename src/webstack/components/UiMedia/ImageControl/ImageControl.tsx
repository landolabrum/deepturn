import React, {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
  isValidElement
} from 'react';
import styles from './ImageControl.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import useClass from '@webstack/hooks/useClass';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import environment from '~/src/core/environment';

export type IImageVariant = 'center' | 'background' | string;
export type IImageMediaType =
  | 'image'
  | 'video'
  | 'iframe'
  | 'audio'
  | 'html'
  | 'webm'
  | 'mp4'
  | 'mkv'
  | string;

interface IImageControl {
  variant?: IImageVariant;
  mediaType?: IImageMediaType;
  children?: React.ReactNode;
  refreshInterval?: number;
  maxRetries?: number;
  error?: string | React.ReactElement;
  fixedLoad?: boolean;
  loadingText?: string;
  onComplete?: (e: any) => void;
  isPlaying?: boolean;
  controls?: any;
  onPlayPauseClick?: () => void;
    onClick?: (e?:any) => void;

  showPlayPause?: boolean;
}

const ImageControl: React.FC<IImageControl> = ({
  children,
  controls,
  variant,
  mediaType = 'image',
  refreshInterval = 5000,
  maxRetries = 5,
  error,
  loadingText,
  fixedLoad = false,
  onComplete,
  onPlayPauseClick,
  showPlayPause,
  isPlaying,
  onClick
}) => {
  const childRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
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
            maxRetries={maxRetries}
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
    const mediaHeight = childRef?.current?.offsetHeight;
    if (childRef.current && !loading) {
      onComplete?.({ src: Boolean(mediaHeight && mediaHeight > 10), loading });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const mediaHeight = childRef?.current?.offsetHeight;
      const mediaWidth = childRef?.current?.offsetWidth;
      const isVisible =
        (mediaType === 'iframe' && mediaHeight && mediaHeight > 100) ||
        (mediaHeight && mediaHeight > 30) ||
        (mediaWidth && mediaWidth > 10);

      if (childRef.current && isVisible && loading === true) {
        setLoading(false);
      } else {
        // Only retry if we haven't reached maxRetries
        if (loading && retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
        } else if (retryCount >= maxRetries && loading) {
          setLoading(false); // fallback to hide loader
        }
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <>
      <style jsx>{styles}</style>
      <div
      onClick={onClick}
        className={`image-control${loading ? " image-control__loading" : ""}${
          variant ? ` image-control--${variant}` : ""
        } ${mediaType}`}
      >
        {loading && (
          <UiLoader
            position={!fixedLoad ? "relative" : undefined}
            text={typeof error === "string" ? error : loadingText}
            dots={["string", "object"].includes(typeof error) ? false : undefined}
          />
        )}
        <div id="image-control__element" className={clzz} ref={childRef}>
          {!isPlaying || variant !== "background" && (mediaType === "video" || mediaType === "iframe") && (
            <div className="image-control__play" onClick={onPlayPauseClick}>
              <UiIcon width={100} height={100} icon={`${environment.merchant.name}-logo`} />
            </div>
          )}

          {Children.map(children, (child) => (isValidElement(child) ? cloneElement(child) : child))}
        </div>

        {error && typeof error !== "string" && <div className="image-control__error">{error}</div>}

        {controls && (
          <div className="image-control__controls">
            {showPlayPause && (
              <div className="image-control__controls__control">
                <UiIcon icon="fa-play-pause" onClick={onPlayPauseClick} />
              </div>
            )}
            <div className="image-control__controls__control">
              <UiIcon icon="fa-expand" onClick={handleExpand} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageControl;
