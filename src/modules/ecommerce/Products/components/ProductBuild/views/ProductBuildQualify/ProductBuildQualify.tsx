// Relative Path: ./ProductBuildUsageView.tsx
import React, { useEffect } from 'react';
import styles from './ProductBuildQualify.scss';
import UiButtonGroup from '@webstack/components/UiForm/components/UiButtonGroup/controller/UiButtonGroup';


// Remember to create a sibling SCSS file with the same name as this component
interface IProdBuildQuality {

}
const ProductBuildQualify: React.FC<any> = ({ options, onSelect, label }: any) => {

  // useEffect(() => { console.log({options})}, [options]);
  return (
    <>
      <style jsx>{styles}</style>
      {/* {JSON.stringify(options)} */}
      <div className='product-build-qualify'>
        <UiButtonGroup
          label={label}
          btnSize='xxl'
          btns={options} size={{ xs: 1, sm: 2, md: 3 }}
          onSelect={onSelect}

        />
      </div>
      {/* <UiSettingsLayout
        // customMenu={""}
        views={
          {
            build: <div className='product-build-qualify'>
            <UiButtonGroup
             btns={options} size={{ sm: 3, md: 5 }} 
             onSelect={onSelect}
             />
          </div>,
            // selected: 'n/a'
          }
        }
        viewName='build'
        variant='full-width'
      >

      </UiSettingsLayout> */}
    </>
  );
};

export default ProductBuildQualify;