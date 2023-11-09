// Relative Path: ./BannerProduct.tsx
import React from 'react';
import styles from './BannerProduct.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component
const fields = [
    {name:'appliances', label:'appliances', type:'radio'}
];
const BannerProduct: React.FC = () => {
    const router = useRouter();
    const handleClick = () =>{
        router.push('/configure')
    }    
    return (
        <>
            <style jsx>{styles}</style>
            {/* <UiForm fields={fields}/> */}
                <div className='products-listing__banner'>
                    <div className='products-listing__banner--title'>
                        The Ultimate Off-Grid Battery Backup Solar Systems.
                    </div>
                    <div className='products-listing__banner--body'>
                        Helping you Create your Nirvana! On and Off-grid battery back up packages
                    <UiButton variant='primary' onClick={handleClick} >
                        Customize now
                    </UiButton>
                    </div>
                </div>
        </>
    );
};

export default BannerProduct;