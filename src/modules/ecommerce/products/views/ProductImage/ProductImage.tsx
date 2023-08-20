import React, { useState } from 'react';
import styles from './ProductImage.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

const ProductImage: React.FC<{ image?: any, options?: any }> = ({ image, options }) => {
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);
    return (
        <>
            <style jsx>{styles}</style>
            <div className="product-image">
                <div className="product-image__content">
                    {image && !imageLoadError ? (
                        <img
                            src={image}
                            alt="img"
                            width={options?.size ?`${options.size}`:"100%"}
                            height="auto" // Set the appropriate height for your image
                            onError={() => setImageLoadError(true)}
                        />

                    ) : <UiIcon icon='deepturn-logo' />}
                </div>
            </div>
        </>
    );
};

export default ProductImage;