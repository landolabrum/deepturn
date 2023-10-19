// Relative Path: ./UiCheckBox.tsx
import React, { useState } from 'react';
import styles from './UiCheckBox.scss';
import UiCollapse from '../UiCollapse/UiCollapse';

// Remember to create a sibling SCSS file with the same name as this component

const UiCheckBox: React.FC<any> = ({open:boolean = true, options, label}:any) => {
    const [selected, setSelected]=useState<any>([]);
    const handleSelected = (opt: any) =>{

    }
  return (
    <>
      <style jsx>{styles}</style>
      <UiCollapse open label={label}>
            {options && Object.entries(options).map(([key, value], index)=>{
                return <div className='ui-check-box__option' key={key}>
                            {JSON.stringify(options)}
                </div>
            })}
      </UiCollapse>
    </>
  );
};

export default UiCheckBox;