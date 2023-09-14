import React, { useEffect, useRef, useState } from 'react';
import UiInput from '../UiInput/UiInput';
import styles from './UiForm.scss';
import UiButton from '../UiButton/UiButton';
import { IForm, IFormField } from './models/IFormModel';
import handleConstraints from './services/FormConstraints';
import UiSelect from '../UiSelect/UiSelect';
import UiLoader from '../UiLoader/UiLoader';


const UiForm = ({ fields, onSubmit, onError, title, btnText, onChange, loading }: IForm) => {
    if(!fields)return;
    const [formValues, setFormValues] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const textTypes = ['', undefined, 'text', 'password', 'number', 'tel', null, false, 'expiry'];


    const errorMsg = (name: string) => {
        if(!name)return;
        if (typeof loading === "object" && 'fields' in loading && Array.isArray(loading.fields)) {
            const errorField = loading.fields.find(field => field.name === name);
            if (errorField) return errorField.message;
        }
        return null;
    }
    

    const handleInputChange = (e: any, constraints: IFormField['constraints']) => {
        const isValid = handleConstraints(e, constraints);
        if (!e || !isValid) return;
        if (onChange) { onChange(e); return; }

        setFormValues((prevState: any) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!fields || !onSubmit) return;
        
        let newErrors = { ...errors };  // Create a copy of the existing errors
        
        fields.forEach((f: any) => {
            if (f.constraints) {
                const min = f.constraints?.min;
                const max = f.constraints?.max;
                const valueLen = String(f.value).replaceAll(' ', '').length;
                if (min != undefined) {
                    if(errors[f.name] !== undefined){delete newErrors[f.name];}
                    else if(valueLen < min){newErrors[f.name] = `*${f.name} is not long enough`;}
                } 
                if (max != undefined) {
                    if(errors[f.name] !== undefined){delete newErrors[f.name];}
                    else if(valueLen > max){newErrors[f.name] = `*${f.name} is too long`;}
                }
            }
        });
        // console.log('[ NEW ERRORS ]', newErrors)
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onSubmit(fields);
        } else if (onError) {
            onError(newErrors);
        }
    };
    const fieldTraits = (field:IFormField)=>{
        if(!field)return;
        const fieldError = field.name?errorMsg(field.name): undefined;
        if(!field.traits)field.traits={}
        if(fieldError){
            field.traits.errorMessage = fieldError;
        }else{
            field.traits.errorMessage = undefined;
        }
        return field?.traits
    }
    
    useEffect(() => {}, [loading, fieldTraits]);
    return (<>
        <style jsx>{styles}</style>
        {title}
        <form className='form' >
            {fields ? fields.map((field, index) => field.name && (
                <div
                    key={index}
                    className='form__field'
                    style={typeof field?.width == 'string' ?
                        { width: `calc(${field.width} - 5px)` }:{}}
                > 
                    {textTypes.includes(field?.type) && field.name && <>
                    <UiInput
                        label={field.label}
                        // max={typeof field?.constraints?.max == 'number' ?field.constraints.max: undefined}
                        variant={
                            errors[field.name] ||
                            fieldTraits(field)?.errorMessage && 'invalid' || field?.variant
                        }
                        type={field.type}
                        traits={errors[field.name]?{errorMessage:errors[field.name]}:fieldTraits(field)}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={field?.value || formValues[field.name] || ''}
                        onChange={e => handleInputChange(e, field.constraints)}
                    />
                    </>}
                    {field?.type == 'select' && field?.options !== undefined && <UiSelect
                        variant={field?.variant}
                        traits={fieldTraits(field)}
                        options={field?.options}
                        label={field.name}
                        value={field?.value || formValues[field.name] || ''}
                        onSelect={e => handleInputChange({ target: { name: field.name, value: e } }, field.constraints)}
                    />}
                </div>
            )):(<UiLoader position='relative'/>)}
            <UiButton  type='submit' busy={ loading == true} onClick={handleSubmit}>
                {btnText ? btnText : 'Submit'}
            </UiButton>
        </form>
    </>
    );
}

export default UiForm;
