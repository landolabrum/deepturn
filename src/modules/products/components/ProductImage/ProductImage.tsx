import React, { useState } from 'react';
import styles from './ProductImage.scss';
import Image from 'next/image';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

const ProductImage: React.FC<{ image?: string | undefined, options?: any }> = ({ image }) => {
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
                            width="100%"
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