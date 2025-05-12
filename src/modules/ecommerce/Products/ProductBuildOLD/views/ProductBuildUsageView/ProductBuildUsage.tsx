// Relative Path: ./ProductBuildUsageView.tsx
import React, { useEffect } from 'react';
import styles from './ProductBuildUsage.scss';

import UiButtonGroup, { IUiButtonGroup } from '@webstack/components/UiForm/components/UiButtonGroup/controller/UiButtonGroup';

// Remember to create a sibling SCSS file with the same name as this component
interface IProductBuildUsageView {
    label?: string,
    options?: any,
    onSelect?:(e:any)=>void;
}
const ProductBuildUsageView = ({ label, options, onSelect }:IProductBuildUsageView) => {
    
    
    useEffect(() => {}, [options]);
    return (
        <>
        {/* {JSON.stringify({options})} */}
            <style jsx>{styles}</style>
            <div className='product-build-usage'>
                <UiButtonGroup
                    label={label}
                    btnSize='xxl'
                    size={
                        {
                            // xs:2,
                            sm:1
                        }
                    }
                    btns={options}
                    onSelect={onSelect}
                />
            </div> 
        </>
    );
};

export default ProductBuildUsageView;