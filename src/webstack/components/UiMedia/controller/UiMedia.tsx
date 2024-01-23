import { useEffect, useState } from 'react';
import styles from './UiMedia.scss';
import ImageControl, { IImageMediaType, IImageVariant } from '@webstack/components/ImageControl/ImageControl';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

export interface IMedia {
  src: string;
  alt?: string;
  variant?: IImageVariant;
  type?: IImageMediaType;
  loadingText?: string;
}
const UiMedia: React.FC<IMedia> = ({ src, variant, type, alt, loadingText }: IMedia) => {
  const [imageControlProps, setImageControlProps] = useState<any>({ variant, type });
  const [reloadTrigger, setReloadTrigger] = useState(0); // state to trigger reload

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
    console.log('[ ERROR ]', event)
    if (!imageControlProps.error) {
      setImageControlProps({ ...imageControlProps, error: <RefreshLoadingText />});
    }
  };



  imageControlProps.loadingText = loadingText;
  useEffect(() => {
    // if(imageControlProps.loadingText && imageControlProps.error){
    //   imageControlProps.loadingText= <RefreshLoadingText/>
    // }else{
    // }
  }, [handleError, imageControlProps]);

  return (
    <>
      <style jsx>{styles}</style>
      <ImageControl {...imageControlProps}>
        {!imageControlProps.error &&
          <img src={src} alt={alt} onError={handleError} key={reloadTrigger} /> // key added here
        }
        {/* {imageControlProps.error && <div className='media__refresh'>
          <UiIcon icon='fa-arrows-rotate' onClick={handleReload} /></div>}  */}
      </ImageControl>
    </>
  );
};

export default UiMedia;
