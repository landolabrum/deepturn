// Relative Path: ./UiCheckBox.tsx
import React, { useState } from 'react';
import styles from './UiCheckBox.scss';

// Remember to create a sibling SCSS file with the same name as this component

const UiCheckBox: React.FC<any> = ({open:boolean = true, options, label}:any) => {
    const [selected, setSelected]=useState<any>([]);
    const handleSelected = (opt: any) =>{

    }
  return (
    <>
      <style jsx>{styles}</style>
            {options && Object.entries(options).map(([key, value], index)=>{
                return <div className='ui-check-box__option' key={key}>
                            {JSON.stringify(options)}
                </div>
            })}
    </>
  );
};

export default UiCheckBox;