import React, { useEffect, useState } from 'react';
import styles from './ProductImage.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/environment';

const ProductImage: React.FC<{ image?: any, options?: any }> = ({ image, options }) => {
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);
    
    useEffect(() => {
        if(!image)setImageLoadError(true);
    }, []);
    return (
        <>
            <style jsx>{styles}</style>
            <div className={`product-image ${options?.view?`product-image__${options?.view}`:''}`}>
                    {image != undefined && !imageLoadError ? (
                        <img
                            src={image}
                            alt="img"
                            className={`product-image__content ${options?.view?`product-image__content__${options?.view}`:''}`}
                            onError={() => setImageLoadError(true)}
                        />

                    ) : <UiIcon icon={`${environment.merchant.name}-logo`} />}
            </div>
        </>
    );
};

export default ProductImage; 