import React, { useEffect, useState } from 'react';
import UiInput from '../../UiInput/UiInput';
import styles from './UiForm.scss';
import UiButton from '../../UiButton/UiButton';
import { IForm, IFormField } from '../models/IFormModel';
import UiSelect from '../../UiSelect/UiSelect';
import UiLoader from '../../UiLoader/view/UiLoader';
import ToggleSwitch from '../../UiToggle/UiToggle';
import UiCheckBox from '../../UiCheckbox/UiCheckBox';
import FormControl from '../../FormControl/FormControl';
import AddFieldForm from '../views/AddFieldForm/AddFieldForm';
import AutocompleteAddressInput from '@webstack/components/UiInput/views/AddressInput';

const UiForm = ({
    variant,
    fields,
    onSubmit,
    onError: onLocalErrors,
    title, submitText,
    onChange, loading,
    disabled,
    onAddField,
}: IForm):React.JSX.Element => {
    const textTypes = ['', undefined, 'text', 'password', 'email', 'number', 'tel', null, false, 'expiry', 'textarea'];
    const boolTypes = ['checkbox'];
    const [complete, setComplete] = useState<boolean>(false);
    const [localErrors, setLocalErrors] = useState<any>({});
    const handleComplete = () => {
        // COMPLETE
        if (!fields) return;
        fields.forEach((f: any) => f.required && ![undefined, '', null].includes(f.value) && setComplete(true));
        const noneRequired = fields.filter(f => f.required)?.length == 0;
        if (noneRequired && !complete) setComplete(true);
    }
    const handleInputChange = (e: any, constraints?: IFormField['constraints']) => {
        // handleComplete();
        // console.log('[handleInputChange]', e)
        // const isValid = handleConstraints(e, constraints);
        // if (!e || !isValid) return;
        if (onChange) return onChange(e);
    };

    const handleSubmit = () => {
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

    const handlePill = (e: any, field: IFormField, direction?: string) => {
        if (direction && onChange) {
            const val = () => {
                let newPillVal = Number(field.value);
                if (direction == 'minus') {
                    if (field.min && newPillVal <= field.min) newPillVal = field.min;
                    else newPillVal = newPillVal - 1;
                }
                else {
                    if (field.max && newPillVal >= field.max) newPillVal = field.max;
                    else newPillVal += 1;
                }
                return newPillVal;
            }
            const target = { target: { name: field.name, value: val() } };
            return onChange(target);
        }
        let { name, value } = e.target;
        if (value && String(value).charAt(0) == '0') value = value.slice(1, value.length);
        if (field?.min && Number(value) <= field?.min) value = String(field.min);
        if (field?.max && Number(value) >= field?.max) value = String(field.max);
        return handleInputChange({ target: { name: name, value: value } });
    }
    const fieldsCanPopulate = Array(fields)?.length;
    useEffect(() => {
        handleComplete()
    }, [fields, disabled, loading]);
    if (!fields) return <div className='error'>No form fields</div>;
    return (<>
        <style jsx>{styles}</style>
        {title && <div className='form__title'>{title}</div>}
        <div className={`form${variant && ` form--${variant}` || ''}`}>
            {fieldsCanPopulate &&
                fields.map((field, index) => field.name && field?.readonly && (
                    <div key={index} className='form-field__readonly' style={field?.width ? { width: `calc(${field.width} - 8px)` } : {}}>
                        <div className='form-field__readonly--label'>{field?.label}</div>
                        <div className='form-field__readonly--value'>{
                            typeof field.value !== 'object' && `${field?.value}` || 
                            field.value && <div className='object-list'>{Object.entries(field.value).map(([chK,chV]:any)=>{
                                return <span className='object-item' key={chK}>
                                    <span className='object-item--key'>{chK}:</span>
                                    <span className='object-item--value'>{JSON.stringify(chV).replaceAll('"','')}</span>
                                </span>
                            })}</div>
                        }</div>
                    </div>
                ))}

            {fieldsCanPopulate && fields.map((field, index) => field.name && !field.readonly && (
                <div
                    key={index}
                    className='form-field'
                    style={typeof field?.width == 'string' ?
                        { width: `calc(${field.width} - 6px)` } : {}}
                >
                    {field.name === 'address' && (
                        <AutocompleteAddressInput
                            variant={
                                Boolean(field?.error) ? 'invalid' : variant || field?.variant
                            }
                            label='address'
                            address={field.value}
                            error={field?.error}
                            setAddress={e => handleInputChange(e, field.constraints)}
                        />
                    )}
                    {textTypes.includes(field?.type) && field.name && field.name !== 'address' && <>
                        <UiInput
                            autoComplete={field.autoComplete}
                            label={field.label}
                            variant={
                                Boolean(field?.error) ? 'invalid' : variant || field?.variant
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
                        disabled={field?.disabled}
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
                            label={field?.error ? `${field.label} *${field.error}*` : field.label}
                            variant={field.error && 'invalid' || Boolean(field?.min && field.value == field.min || field.max && field.value == field.max) && 'bump pill' || 'pill'}
                            traits={{
                                beforeIcon: { icon: 'fas-minus', onClick: () => handlePill(undefined, field, 'minus') },
                                afterIcon: { icon: 'fas-plus', onClick: () => handlePill(undefined, field, 'plus') },
                            }}
                        >
                            <input
                                name={field.name}
                                type='tel'
                                min={field?.min}
                                max={field?.max}
                                value={isNaN(Number(field.value)) ? '0' : String(field.value)}
                                placeholder={field?.placeholder}
                                onChange={(e) => handlePill(e, field, undefined)}
                            />
                        </FormControl>
                    }
                </div>
            ))}
            {!fieldsCanPopulate && (<UiLoader position='relative' />)}

            {onAddField && <AddFieldForm onAddField={onAddField} />}
            <div className={`form__submit ${variant && ` form__submit--${variant}` || ''}`}>
                <UiButton onClick={handleSubmit} disabled={disabled || !complete} variant={!disabled && complete && 'glow'} type='submit' busy={loading == true} >
                    {submitText ? submitText : 'Submit'}
                </UiButton>
            </div>
        </div>
    </>
    );
}

export default UiForm;
