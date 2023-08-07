import React, { useEffect, useState } from 'react';
import styles from './ProductImage.scss';
import Image from 'next/image';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import useWindow from '@webstack/hooks/useWindow';

// Remember to create a sibling SCSS file with the same name as this component

const ProductImage: React.FC<{ image?: string | undefined, options?: any }> = ({ image, options }) => {
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);
    const window = useWindow();
    const minImg = options?.size ? options?.size : window.width > 900?200:100;
    const maxImg = options?.size ? options?.size * 1.2 : window.width > 900?110:220;
    const animateScale = (e: any) => {
        const min = `${minImg}px`
        const max = `${maxImg}px`
        if (!e) return;
        e.preventDefault();
        if (!e.target.style.width || e.target.style.width == min) {
            e.target.style.transition = "width 1s, height 1s"; e.target.style.width = max; e.target.style.height = max;
        } else {
            e.target.style.transition = "width 1s, height 1s"; e.target.style.width = min; e.target.style.height = min;
        }
    }
    useEffect(()=>{},[window?.width]);
    return (
        <>
            <style jsx>{styles}</style>
            {/* {JSON.stringify(window)} */}
            {image && !imageLoadError ? (
                <div className='product-image'>
                    <Image
                        src={image}
                        alt="img"
                        width={minImg} // Set the appropriate width for your image
                        height={minImg} // Set the appropriate height for your image
                        onError={() => setImageLoadError(true)}
                        onMouseEnter={options?.animate && animateScale}
                        onMouseLeave={options?.animate && animateScale}
                    />
                </div>
            ) : (
                <div
                    className='product-image__placeholder'
                    onMouseEnter={options?.animate && animateScale}
                    onMouseLeave={options?.animate && animateScale}
                    style={{ width: `${minImg}px`, height: `${minImg}px` }}
                >
                    <UiIcon icon='deepturn-logo' />
                </div>
            )}
        </>
    );
};

export default ProductImage;