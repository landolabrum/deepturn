import React, { useEffect, useState } from 'react';
import styles from './ProductImage.scss';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import environment from '~/src/core/environment';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';

const ProductImage: React.FC<{ image?: any, options?: any }> = ({ image, options }) => {
    const [src, setSrc] = useState<string|undefined>();
    useEffect(() => {
        if(image)setSrc(image);
    }, [image]);
    return (
      <>
        <style jsx>{styles}</style>
        <div className={`product-image ${options?.view ? `product-image__${options?.view}` : ""}`}>
          {src != undefined ? (
            <UiMedia
              src={src}
              alt={options?.alt ? options.alt : image?.name ? image.name : ""}
              variant={options?.variant ? options.variant :"slider"}
              width={options?.width ? options.width : 100}
              height={options?.height ? options.height : 'auto'}
            />
          ) : (
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          )}
        </div>
      </>
    );
};

export default ProductImage; 