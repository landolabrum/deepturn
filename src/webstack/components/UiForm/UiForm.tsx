import React, { useCallback, useEffect, useRef, useState } from 'react';
import UiInput from '../UiInput/UiInput';
import styles from './UiForm.scss';
import UiButton from '../UiButton/UiButton';
import { IForm, IFormField } from './models/IFormModel';
import handleConstraints from './services/FormConstraints';
import UiSelect from '../UiSelect/UiSelect';
import UiLoader from '../UiLoader/UiLoader';
import ToggleSwitch from '../UiToggle/UiToggle';
import { ITraits } from '../FormControl/FormControl';

const UiForm = ({ fields, onSubmit, onError: onLocalErrors, title, btnText, onChange, loading }: IForm) => {
    if (!fields) return;
    const [localErrors, setLocalErrors] = useState<any>({});
    const textTypes = ['', undefined, 'text', 'password', 'number', 'tel', null, false, 'expiry'];
    const boolTypes = ['checkbox'];


    const errorMsg = (name: string) => {
        if (!name) return;
        if (typeof loading === "object" && 'fields' in loading && Array.isArray(loading.fields)) {
            const errorField = loading.fields.find(field => field.name === name);
            if (errorField) return errorField.message;
        }
        return null;
    }


    const handleInputChange = (e: any, constraints: IFormField['constraints']) => {
        const isValid = handleConstraints(e, constraints);
        if (!e || !isValid) return;
        // console.log('[ UiForm ]', {n: e.target.name, v: e.target.value})
        if (onChange) { onChange(e); return; }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!fields || !onSubmit) return;

        let newErrors = { ...localErrors };  // Create a copy of the existing errors

        fields.forEach((f: any) => {
            if (f.constraints) {
                console.log('[ CONSTRAINTS ]', f)
                const min = f.constraints?.min;
                const max = f.constraints?.max;
                const valueLen = String(f.value).replaceAll(' ', '').length;
                if (min != undefined) {
                    if (localErrors[f.name] !== undefined) { delete newErrors[f.name]; }
                    else if (valueLen < min) { newErrors[f.name] = `*${f.name} is not long enough`; }
                }
                if (max != undefined) {
                    if (localErrors[f.name] !== undefined) { delete newErrors[f.name]; }
                    else if (valueLen > max) { newErrors[f.name] = `*${f.name} is too long`; }
                }
            }
        });
        setLocalErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit(fields);
        } else if (onLocalErrors) {
            onLocalErrors(newErrors);
        }
    };

    const fieldTraits = 
        (field: IFormField) => {
            if (!field) return;
            let traits: ITraits = field.traits;

            if (field.required && traits) {
                const value = field.value || '';
                const valueLen = String(value).replaceAll(' ', '').length;
                const min = field.constraints?.min;
                const max = field.constraints?.max;
    
                if (field.traits === undefined) {
                    field.traits = {};
                }
    
                if (typeof min == 'number' && valueLen < min) {
                    field.traits.errorMessage = `*${field.name} is not long enough`;
                } else if (typeof max == 'number' && valueLen > max) {
                    field.traits.errorMessage = `*${field.name} is too long`;
                }else{
                    field.traits.errorMessage = undefined
                }
            }
            return traits;
        }
   
   useEffect(() => {}, [fields]);

    return (<>
        <style jsx>{styles}</style>
        {title}
        <form className='form' >
            {fields ? fields.map((field, index) => field.name && (
                <div
                    key={index}
                    className='form__field'
                    style={typeof field?.width == 'string' ?
                        { width: field.width } : {}}
                >
                    {textTypes.includes(field?.type) && field.name && <>
                    ft: {JSON.stringify(field?.traits)}
                        <UiInput
                            label={field.label}
                            // max={typeof field?.constraints?.max == 'number' ?field.constraints.max: undefined}
                            variant={
                                localErrors[field.name] ||
                                fieldTraits(field)?.errorMessage ? 'invalid': field?.variant
                            }
                            type={field.type}
                            traits={field.traits}
                            // traits={localErrors[field.name] ? { errorMessage: localErrors[field.name] } : fieldTraits(field)}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={field?.value}
                            onChange={e => handleInputChange(e, field.constraints)}
                        />
                    </>}
                    {boolTypes.includes(String(field.type)) && <ToggleSwitch
                        label={field.label}
                        name={field.name}
                        onChange={e => handleInputChange(e, field?.constraints)}
                        value={field?.value  || ''} />
                    }
                    {field?.type == 'select' && field?.options !== undefined && <UiSelect
                        variant={field?.variant}
                        traits={fieldTraits(field)}
                        options={field?.options}
                        label={field.name}
                        value={field?.value  || ''}
                        onSelect={e => handleInputChange({ target: { name: field.name, value: e } }, field.constraints)}
                    />}
                </div>
            )) : (<UiLoader position='relative' />)}
            <div className='form__submit'>
                <UiButton variant='lite' type='submit'  busy={loading == true} onClick={handleSubmit}>
                    {btnText ? btnText : 'Submit'}
                </UiButton>
            </div>
        </form>
    </>
    );
}

export default UiForm;
