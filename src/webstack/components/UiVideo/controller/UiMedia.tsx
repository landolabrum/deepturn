import { useEffect, useState } from 'react';
import styles from './UiMedia.scss';
import ImageControl, { IImageMediaType, IImageVariant } from '@webstack/components/ImageControl/ImageControl';

export interface IMedia {
  src: string;
  alt?: string;
  variant?: IImageVariant;
  type?: IImageMediaType;
}

const UiMedia: React.FC<IMedia> = ({ src, variant, type, alt }: IMedia) => {
  const [imageControlProps, setImageControlProps] = useState<any>({ variant, type });
  const handleError = (event: any) => {
    event.preventDefault();
    if(!imageControlProps.error)setImageControlProps({ ...imageControlProps, error: 'failed to load media' });
  }

  useEffect(() => { }, [handleError]);
  return (
    <>
      <style jsx>{styles}</style>
      <ImageControl
        {...imageControlProps}
      >
        {!imageControlProps.error &&
          <img src={src} alt={alt} onError={handleError} />
        }
      </ImageControl>
    </>
  );
};

export default UiMedia;
