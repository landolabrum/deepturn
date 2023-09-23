import React, {  useState } from 'react';
import UiInput from '../UiInput/UiInput';
import styles from './UiForm.scss';
import UiButton from '../UiButton/UiButton';
import { IForm, IFormField } from './models/IFormModel';
import UiSelect from '../UiSelect/UiSelect';
import UiLoader from '../UiLoader/UiLoader';
import ToggleSwitch from '../UiToggle/UiToggle';

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
        // const isValid = handleConstraints(e, constraints);
        // if (!e || !isValid) return;
        // console.log('[ UiForm ]', {n: e.target.name, v: e.target.value})
        if (onChange) { onChange(e); return; }
    };
 
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!fields || !onSubmit) return;

        let newErrors = { ...localErrors };  // Create a copy of the existing errors

        fields.forEach((f: any) => {
            if (f.constraints) {
                const min = f.constraints?.min;
                const max = f.constraints?.max;
                const valueLen = String(f.value).replaceAll(' ', '').length;
                if (min != undefined && valueLen) {
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
                        <UiInput
                            label={field.label}
                            variant={
                                localErrors[field.name] ||
                                Boolean(field?.error) ? 'invalid': field?.variant
                            }
                            error={field.error}
                            type={field.type}
                            traits={field.traits}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={String(field?.value)}
                            onChange={e => handleInputChange(e, field.constraints)}
                        />
                    </>}
                    {boolTypes.includes(String(field.type)) && <ToggleSwitch
                        label={field.label}
                        name={field.name}
                        onChange={e => handleInputChange(e, field?.constraints)}
                        value={Boolean(field?.value)} />
                    }
                    {field?.type == 'select' && field?.options !== undefined && <UiSelect
                        variant={field?.variant}
                        traits={field.traits}
                        options={field?.options}
                        label={field.name}
                        value={String(field?.value)}
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
