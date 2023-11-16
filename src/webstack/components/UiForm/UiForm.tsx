import React, { useEffect, useState } from 'react';
import UiInput from '../UiInput/UiInput';
import styles from './UiForm.scss';
import UiButton from '../UiButton/UiButton';
import { IForm, IFormField } from './models/IFormModel';
import UiSelect from '../UiSelect/UiSelect';
import UiLoader from '../UiLoader/view/UiLoader';
import ToggleSwitch from '../UiToggle/UiToggle';
import UiCheckBox from '../UiCheckbox/UiCheckBox';
import FormControl from '../FormControl/FormControl';

const UiForm = ({ fields, onSubmit, onError: onLocalErrors, title, btnText, onChange, loading, disabled }: IForm) => {
    const textTypes = ['', undefined, 'text', 'password', 'email', 'number', 'tel', null, false, 'expiry'];
    const boolTypes = ['checkbox'];
    const [complete, setComplete] = useState<boolean>(false);
    const [localErrors, setLocalErrors] = useState<any>({});
    
    // const errorMsg = (name: string) => {
    //     if (!name) return;
    //     if (typeof loading === "object" && 'fields' in loading && Array.isArray(loading.fields)) {
    //         const errorField = loading.fields.find(field => field.name === name);
    //         if (errorField) return errorField.message;
    //     }
    //     return null;
    // }
    const handleComplete = () => {
        // COMPLETE
        if(!fields)return;
        fields.forEach((f: any) => {
            if (f.required && ![undefined, '', null].includes(f.value)) setComplete(true);
        });
        const anyRequired = fields.filter(f => f.required);
        // console.log('[ anyRequired ]', anyRequired)
    }

    const handleInputChange = (e: any, constraints?: IFormField['constraints']) => {
        handleComplete();
        // const isValid = handleConstraints(e, constraints);
        // console.log('[ handeInputChange f dsa ]',e)
        // if (!e || !isValid) return;
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
    useEffect(() => { }, [fields, disabled, loading]);
    if (!fields) return<></>;
    return (<>
        <style jsx>{styles}</style>
        {title && <div className='form__title'>{title}</div>}
        <form className='form' onSubmit={handleSubmit} >
            {Array(fields)?.length ? fields.map((field, index) => field.name && (
                <div
                    key={index}
                    className='form__field'
                    style={typeof field?.width == 'string' ?
                        { width: `calc(${field.width} - 6px)` } : {}}
                >
                    {textTypes.includes(field?.type) && field.name && <>
                        <UiInput
                            label={field.label}
                            variant={
                                Boolean(field?.error) ? 'invalid' : field?.variant
                            }
                            disabled={field?.disabled}
                            error={field.error}
                            type={field.type}
                            required={field.required}
                            traits={field.traits}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={field?.value}
                            onChange={e => handleInputChange(e, field.constraints)}
                        />
                    </>}
                    {field.type == 'radio' && <UiCheckBox options={fields} />}

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
                    {field.type == 'pill' &&
                        <FormControl
                            label={field?.error? `${field.label} *${field.error}*`: field.label}
                            variant={field.error && 'invalid'}
                            traits={{
                                beforeIcon: { icon: 'fas-minus', onClick: () => onChange && onChange({ target: { name: field.name, value: Number(field.value) - 1 } }) },
                                afterIcon: { icon: 'fas-plus', onClick: () => onChange && onChange({ target: { name: field.name, value: Number(field.value) + 1 } }) },
                                width: '120px'
                            }}
                        >
                            <input
                                name={field.name}
                                value={isNaN(Number(field.value)) ?  '0' :  String(field.value)}
                                placeholder={field?.placeholder}
                                onChange={(e) => {
                                    let { name, value } = e.target;
                                    if (value && String(value).charAt(0) == '0') value = value.slice(1, value.length)
                                    handleInputChange({ target: { name: name, value: value } })
                                }}
                            />
                        </FormControl>
                    }
                </div>
            )) : (<UiLoader position='relative' />)}

            <div className='form__submit'>
                <UiButton disabled={!complete || disabled} variant={complete && !disabled && 'primary'} type='submit' busy={loading == true} >
                    {btnText ? btnText : 'Submit'}
                </UiButton>
            </div>
        </form>
    </>
    );
}

export default UiForm;
