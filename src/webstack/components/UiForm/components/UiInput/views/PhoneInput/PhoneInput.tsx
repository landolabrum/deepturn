// Relative Path: ./PhoneInput.tsx
import React from 'react';
import styles from './PhoneInput.scss';
import { IInput } from '@webstack/models/input';
import validateField from '@webstack/components/UiForm/functions/validateField';

// Remember to create a sibling SCSS file with the same name as this component

const PhoneInput: React.FC<IInput> = (props) => {
    const value = props.value;
    const isValidPhone = validateField(value, 'phone');
    console.log('[PhoneInput] value:', value, 'isValidPhone:', isValidPhone);
const stringValue = typeof value === 'string' ? value : value?.toString();

  return (
    <>
      <style jsx>{styles}</style>
      <div className='phone-input'>
        <input
          type='tel'
          name={props.name}
          value={stringValue || ''}
          onChange={props.onChange}
          placeholder={props.placeholder || '1 (000) 000-0000'}
          className={`phone-input__field ${props.variant || ''} ${props.disabled ? 'input-disabled' : ''}`}
          required={props.required}
          disabled={props.disabled}
        />
        {props.error && <span className='phone-input__error'>{props.error}</span>}
      </div>
    </>
  );
};

export default PhoneInput;