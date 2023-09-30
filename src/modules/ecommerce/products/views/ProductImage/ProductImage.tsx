import React, { useState } from 'react';
import styles from './ProductImage.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

const ProductImage: React.FC<{ image?: any, options?: any }> = ({ image, options }) => {
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);
    return (
        <>
            <style jsx>{styles}</style>
            <div      className={`product-image ${options?.view?`product-image__${options?.view}`:''}`}>
                {/* <div style={options?.style} > */}
                    {image && !imageLoadError ? (
                        <img
                            src={image}
                            alt="img"
                            className={`product-image__content ${options?.view?`product-image__content__${options?.view}`:''}`}
                            // width={options?.size ?`${options.size}`:"100%"}
                            // height="auto" // Set the appropriate height for your image
                            onError={() => setImageLoadError(true)}
                        />

                    ) : <UiIcon icon='deepturn-logo' />}
                {/* </div> */}
            </div>
        </>
    );
};

export default ProductImage; 