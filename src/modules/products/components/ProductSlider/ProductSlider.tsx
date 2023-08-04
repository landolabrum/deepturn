import Image from 'next/image';
import React, { useState, useRef } from 'react';
import styles from "./ProductSlider.scss";
import UiButton from '@webstack/components/UiButton/UiButton';
import ProductBuyNow from '../ProductBuyNow/ProductBuyNow';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

interface Product {
    id: string;
    name: string;
    images: string;
}

interface ProductSliderProps {
    products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {

    const minImg = 200;
    const maxImg = 240;
    const animateScale = (e: any) => {
        const min = `${minImg}px`
        const max = `${maxImg}px`
        if (!e) return;
        e.preventDefault();
        console.log("[ WIDHT ]: ",e.target.style.width)
        if (!e.target.style.width || e.target.style.width == min) {
            e.target.style.transition = "width 1s, height 1s"; e.target.style.width = max; e.target.style.height = max;
        } else {
            e.target.style.transition = "width 1s, height 1s"; e.target.style.width = min; e.target.style.height = min;
        }

    }
    return (
        <>
            <style jsx>{styles}</style>
            <div className='product-slider'>
                <div className='product-slider__carousel'>
                    {Array(products).length > 0 && products.map((product: any, key: number) => {
                        const [imageLoadError, setImageLoadError] = useState(false);
                        return (
                            <div key={key} className='product-slider__product'>
                                <div key={key} className='product-slider__product-content'>
                                    <div className='product-slider__product-header'>
                                        <div className='product-slider__product-notifications'></div>
                                        <div className='product-slider__product-title'>{product?.name}</div>
                                    </div>
                                    <div className='product-slider__product-image'>
                                        {!imageLoadError ? (
                                            <Image
                                                src={product?.images}
                                                alt="img"
                                                width={minImg} // Set the appropriate width for your image
                                                height={minImg} // Set the appropriate height for your image
                                                onError={() => setImageLoadError(true)}
                                                onMouseEnter={animateScale}
                                                onMouseLeave={animateScale}
                                            />
                                        ) : (
                                            <span
                                                className='product-slider__product-placeholder'
                                                onMouseEnter={animateScale}
                                                onMouseLeave={animateScale}
                                                style={{ width: `${minImg}px`, height: `${maxImg}px` }}
                                            >
                                                <UiIcon icon='deepturn-logo' />
                                            </span>
                                        )}
                                    </div>
                                    <div className='product-slider__product-footer'>
                                        <div>{product?.price}</div>
                                        <ProductBuyNow product={product} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default ProductSlider;
