// Relative Path: ./OtherFeature.tsx
import React, { useEffect, useState } from 'react';
import styles from './ProductFeatureOther.scss';
import { IMoreInfoField } from '../../ProductRequestSurvey';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import capitalize from '@webstack/helpers/Capitalize';
import { IForm, IFormField } from '@webstack/components/UiForm/models/IFormModel';
// Remember to create a sibling SCSS file with the same name as this component
interface IOtherItem{
     choice: IMoreInfoField;
     value: any;
     onChange:(e:any)=>void;
     onSubmit:(e:any)=>void;
     title: string
}
const ProductFeatureOther: React.FC<any> = ({ onSubmit, title }: IOtherItem) => {
  const initialOther = [
      { name: `name`, label: `Custom ${capitalize(title)} Name`, placeholder: `add your custom ${title}`, required: true, error: undefined },
      { name: `value`, type: 'pill', value: 0, label: 'Estimated Amps', required: true, placeholder: 0, error: undefined },
  ]
    const [fields, setFields] = useState<any>(initialOther);
    const [disabled, setDisabled] = useState<boolean>(true);
    const onChange = (e:any)=>{
      const {name, value}=e.target;
      const updateFields = fields.map((field: IFormField) => {
        let f = field;
        if(field.name == name){
          if(field.name == 'value' && String(field.value).length >= 3)f.error = 'too long';
          else if(field.error)delete f.error;
          f.value = value;
        }
        return f;
      });
      setDisabled(Boolean(updateFields.find((field: IFormField)=> {return field.value == undefined || field.value == 0})));
      setFields(updateFields);
    }
  const handleSubmit = () => {
    const name = fields.find((field:IFormField)=>field.name == 'name')?.value;
    const value = fields.find((field:IFormField)=>field.name == 'value')?.value;
    const otherItem = {
      name: name,
      value: value,
      selected: true
    }
    onSubmit(otherItem)
  }
  return (
    <>
      <style jsx>{styles}</style>
      <UiForm
        title={title}
        fields={fields}
        onChange={onChange}
        onSubmit={handleSubmit}
        disabled={disabled}
      />
    </>
  );
};

export default ProductFeatureOther;