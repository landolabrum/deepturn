import { useEffect, useRef, useState } from 'react';
import styles from './UiMedia.scss';
import ImageControl, { IImageMediaType, IImageVariant } from '@webstack/components/ImageControl/ImageControl';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

export interface IMedia {
  src: string;
  alt?: string;
  variant?: IImageVariant;
  type?: IImageMediaType;
  loadingText?: string;
  rotate?: number; // Added rotate prop for rotation degree
}

const UiMedia: React.FC<IMedia> = ({ src, variant, type, alt, loadingText, rotate }: IMedia) => {
  const [imageControlProps, setImageControlProps] = useState<any>({ variant, type });
  const [reloadTrigger, setReloadTrigger] = useState(0); // state to trigger reload
  const imgRef = useRef<any>();
  const handleReload = () => {
    setImageControlProps({ ...imageControlProps, error: null }); // Reset error state
    setReloadTrigger(prev => prev + 1); // Increment reload trigger to re-render the image
  };

  const RefreshLoadingText = () => {
    return <>
        <div style={{color: "#f90"}}>{loadingText}, Failed</div>
        <div>
          <UiIcon icon='fa-arrows-rotate' onClick={handleReload} />
        </div>
    </>
  }

  const handleError = (event: any) => {
    event.preventDefault();
    // console.log('[ ERROR ]', event)
    if (!imageControlProps.error) {
      setImageControlProps({ ...imageControlProps, error: <RefreshLoadingText />});
    }
  };

  // Apply rotation if the rotate prop is provided
  const imageStyle = {
    transform: `rotate(${rotate}deg)`
  };

  imageControlProps.loadingText = loadingText;
  useEffect(() => {
    // Effect logic here if needed
    if(rotate && imgRef?.current){
      imgRef.current.style.transform = `rotate(${rotate}deg)`
    }else if(!rotate && imgRef?.current?.style.transform)delete imgRef.current.style

  }, [handleError, imageControlProps,handleReload,  imgRef?.current]); // 

  return (
    <>
      <style jsx>{styles}</style>
      <ImageControl {...imageControlProps}>
        {!imageControlProps.error &&
          <img ref={imgRef} src={src} alt={alt} onError={handleError} key={reloadTrigger} /> // Apply rotation style here
        }
      </ImageControl>
    </>
  );
};

export default UiMedia;
