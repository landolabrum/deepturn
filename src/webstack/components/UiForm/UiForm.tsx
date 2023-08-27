import React, { useState } from 'react';
import UiInput from '../UiInput/UiInput';
import styles from './UiForm.scss';
import UiButton from '../UiButton/UiButton';
type IFormMinMax = {
    value?: number;
    message?: string;
};
type IFormField = {
    name?: string;
    value?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    validation?: {
        minLen?: IFormMinMax | number;
        maxLen?: IFormMinMax | number;
        required?: boolean | {
            message?: string
        };
    }
}

interface IForm {
    fields?: IFormField[];
    title?: string | React.ReactElement;
    btnText?: string | React.ReactElement;
    onSubmit?: (e: any) => void;
    onError?: (e: any) => void;
}
const UiForm = ({ fields, onSubmit, onError, title, btnText }: IForm) => {
    const [formValues, setFormValues] = useState<any>({});
    const [errors, setErrors] = useState<any>({});

    const handleInputChange = (name: IFormField['name'], value: IFormField['value']) => {
        if (!name) return;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateField = (field: IFormField) => {
        const name = field.name
        const value = (name !== undefined && formValues[name]) || "";
        const min: any = field.validation ? field.validation.minLen : 1;
        const max: any = field.validation ? field.validation.maxLen : 1;
        let error = "";
        if (field.validation) {
            if (field.validation.required && !value) {
                error = "This field is required";
            } else if (min && value.length < min.value) {
                error = min.message;
            } else if (field.validation.maxLen && value.length > max.value) {
                error = max.message;
            }
        }
        return error;
    };

    const handleSubmit = (e: any) => {
        if (!fields || !onSubmit) return;
        e.preventDefault();
        const currentErrors: any = {};
        fields.forEach(field => {
            const error = validateField(field);
            if (error && field.name) currentErrors[field.name] = error;
        });

        if (Object.keys(currentErrors).length === 0) {
            onSubmit(formValues);
        } else {
            setErrors(currentErrors);
            onError && onError(currentErrors);
        }
    };

    return (<>

    <style jsx>{styles}</style>
        <form
            onSubmit={handleSubmit}
        >
            {fields && fields.map((field: any) => (
                <div className='form__field' key={field.name}>
                    <UiInput 
                        message='This is a test error message'
                        label={field.label}
                        variant='dark'
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formValues[field.name] || ''}
                        onChange={e => handleInputChange(field.name, e.target.value)}
                    />
                </div>
            ))}
            <UiButton
                variant='dark'
                type='submit'
            >
                {btnText?btnText:'Submit'}
            </UiButton>
        </form>
        </>
    );
}

export default UiForm;
