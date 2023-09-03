import React, { useState } from 'react';
import UiInput from '../UiInput/UiInput';
import styles from './UiForm.scss';
import UiButton from '../UiButton/UiButton';
import { IForm, IFormField } from './models/IFormModel';
import handleConstraints from './services/FormConstraints';
import UiSelect from '../UiSelect/UiSelect';
import { countryFormat, stateFormat } from '@webstack/helpers/userExperienceFormats';
import UiLoader from '../UiLoader/UiLoader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';


const UiForm = ({ fields, onSubmit, onError, title, btnText, onChange, collapse, loading }: IForm) => {
    const [formValues, setFormValues] = useState<any>({});
    const [errors, setErrors] = useState<any>({});


    const handleInputChange = (e: any, constraints: IFormField['constraints']) => {
        const isValid = handleConstraints(e, constraints);
        if (!e || !isValid) return;
        if (onChange) { onChange(e); return; }

        setFormValues((prevState: any) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // const validateField = (field: IFormField) => {
    //     const name = field.name
    //     const value = (name !== undefined && formValues[name]) || "";
    //     const min: any = field.constraints ? field.constraints.min : 1;
    //     const max: any = field.constraints ? field.constraints.max : 30;
    //     let error = "";
    //     if (field.constraints) {
    //         if (field.constraints.required && !value) {
    //             error = "This field is required";
    //         } else if (min && value.length < min.value) {
    //             error = min.message;
    //         } else if (field.constraints.max && value.length > max.value) {
    //             error = max.message;
    //         }
    //     }
    //     return error;
    // };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!fields || !onSubmit) return;
        const currentErrors: any = {};
        // fields.forEach((field: IFormField) => {
        //     const error = validateField(field);
        //     if (error && field.name) currentErrors[field.name] = error;
        // });
        if (Object.keys(currentErrors).length === 0) {
            onSubmit(formValues);
        } else {
            setErrors(currentErrors);
            onError && onError(currentErrors);
        }
    };
    const textTypes = ['', undefined, 'text', 'password', 'number', 'tel', null, false, 'expiry'];
    return (<>
        <style jsx>{styles}</style>
        {title}
        {JSON.stringify(formValues)}
        <div className='form' >
            {fields ? fields.map((field: any) => (
                <div
                    key={field.name}
                    className='form__field'
                    style={
                        typeof field?.width == 'string' ?
                            { width: `calc(${field.width} - 5px)` } :
                            {}}
                >
                    {textTypes.includes(field?.type) && <UiInput
                        // message='This is a test error message'
                        label={keyStringConverter(field.label)}
                        max={field.max}
                        variant={field?.variant ? field?.variant : 'dark'}
                        type={field.type}
                        traits={field?.traits}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formValues[field.name] || field?.value  || ''}
                        onChange={e => handleInputChange(e, field.constraints)}
                    />}
                    {field?.type == 'select' && <UiSelect
                        variant='dark'
                        traits={field?.traits}
                        options={field?.options}
                        label={field.name}
                        value={field?.value || formValues[field.name] || ''}
                        onSelect={e => handleInputChange({ target: { name: field.name, value: e } }, field.constraints)}
                    />}
                </div>
            )):(<UiLoader position='relative'/>)}
            <UiButton variant='dark' type='submit' busy={ loading == true} onClick={handleSubmit}>
                {btnText ? btnText : 'Submit'}
            </UiButton>
        </div>
    </>
    );
}

export default UiForm;
