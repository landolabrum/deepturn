// Relative Path: ./ProductChapters.tsx
import React from 'react';
import styles from './ProductChapters.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const ProductChapters: React.FC = () => {
    return (
        <>
            <style jsx>{styles}</style>
            <ul className='product-chapters' >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((_, index) => (
                    <li
                        key={index} className='product-chapters__chapter'>
                            <div className='chapter__content'>
                            <div className='chapter__icon'>
                                <UiIcon icon='fa-xmark' />
                            </div>
                            <div className='chapter__body'>
                            <div className='chapter__title'>
                                {`product ${index + 1}`}
                            </div>
                            <div className='chapter__extras'>
                                {`extras ${index + 1}`}
                            </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ProductChapters;