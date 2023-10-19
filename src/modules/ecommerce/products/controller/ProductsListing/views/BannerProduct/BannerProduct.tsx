// Relative Path: ./BannerProduct.tsx
import React from 'react';
import styles from './BannerProduct.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiDiv from '@webstack/components/UiDiv/UiDiv';
import { useModal } from '@webstack/modal/contexts/modalContext';
import UiForm from '@webstack/components/UiForm/UiForm';
import UiMarkdown from '@webstack/components/UiMarkDown/UiMarkDown';

// Remember to create a sibling SCSS file with the same name as this component
const fields = [
    {name:'appliances', label:'appliances', type:'radio'}
];
const BannerProduct: React.FC = () => {
    const { openModal }=useModal();
    const handleClick = () =>{
        openModal(<UiForm fields={[]}/>)
    }    
    return (
        <>
            <style jsx>{styles}</style>
            {/* <UiForm fields={fields}/> */}
            <UiDiv variant="card">
                <div className='products-listing__banner'>
                    <div className='products-listing__banner--title'>
                        The Ultimate Off-Grid Battery Backup Solar Systems.
                    </div>
                    <div className='products-listing__banner--body'>
                        Helping you Create your Nirvana! On and Off-grid battery back up packages
                    </div>
                    <UiButton variant='lite' onClick={handleClick} >Customize now</UiButton
                    >
                </div>
            </UiDiv>
            <h4>
                Appliances: 
            </h4>
            appliance-name <i>fridge</i>
        </>
    );
};

export default BannerProduct;