// Relative Path: ./ProductChapters.tsx
import React from 'react';
import styles from './ProductChapters.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

// Remember to create a sibling SCSS file with the same name as this component

const ProductChapters: React.FC = () => {
    const divi = (ind: number) => {
        if (ind % 2 == 0) return 'small-box';
        if (ind % 3 == 0) return 'medium-box';
        if (ind % 4 == 0) return 'large-box';
        return 'offgrid-box';
    }
    const categories = ['offgrid-box', 'medium-box', 'large-box']
    return (
        <>
            <style jsx>{styles}</style>
            <ul className='product-chapters' >
                {(categories).map((icon, index) => (
                    <li
                        key={index} className='product-chapters__chapter'>
                        <div className='chapter__content'>
                            <div className='chapter__icon'>
                                <UiIcon icon={icon} />
                            </div>
                            <div className='chapter__body'>
                                <div className='chapter__title'>
                                    {keyStringConverter(icon)}
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