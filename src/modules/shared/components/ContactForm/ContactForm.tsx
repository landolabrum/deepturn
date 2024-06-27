import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IAuthenticatedUser from "~/src/models/ICustomer";
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { mockDateTime } from '@webstack/helpers/MockData';

interface IContactFormProps {
  submit?: {
    text?: string;
  }
  onSubmit: (contactData: any) => void;
  user?: any;
  payment?: any
  title?: string | React.ReactElement | boolean;
}

const ContactForm: React.FC<IContactFormProps> = ({ onSubmit, user, submit, title = 'contact' }) => {
  const initialContactFields = [
    { name: 'firstName', label: 'First Name', width: "50%", type: 'text', placeholder: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', width: "50%", type: 'text', placeholder: 'Last Name', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '# (###) ###-####', required: true },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Your Address', required: true },
  ];

  const _user = useUser();
  const [fields, setFields] = useState<IFormField[]>(initialContactFields);
  const [initialFields, setInitialFields] = useState<IFormField[] | undefined>();
  const [disabled, setDisabled] = useState<boolean>(true);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let fieldsRef = fields.map((field: IFormField) => {
      if (field.name === name) field.value = value;
      return field;
    });
    setFields(fieldsRef);
    handleDisabled(fieldsRef);
  };

  const handleFormSubmit = () => {
    const formData = fields.reduce((acc: any, field: any) => {
      acc[field.name] = field.value;
      return acc;
    }, {});
    formData.name = `${formData.firstName} ${formData.lastName}`;
    delete formData.firstName;
    delete formData.lastName;
    onSubmit(formData);
  };

  const handleDisabled = (updatedFields: IFormField[]) => {
    const isFormComplete = updatedFields?.every(field => {
      if (field.required && field?.name !== 'address') {
        return field.value && String(field.value).trim().length > 0;
      }else{
        return Object(field.value)?.line1
      }
      return true;
    });

    const isEmailValid = updatedFields?.some(field => {
      if (field.name === 'email') {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return validRegex.test(String(field.value) || '');
      }
      return true;
    });

    const isPhoneValid = updatedFields?.some(field => {
      if (field.name === 'phone') {
        const validPhoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
        return validPhoneRegex.test(String(field.value) || '');
      }
      return true;
    });

    setDisabled(!(isFormComplete && isEmailValid && isPhoneValid));
  };

  const userToUse = user || _user;
  const handleUser = async () => {
    if (userToUse) {
      const updatedFields = fields.map((field) => {
        switch (field.name) {
          case 'firstName':
            return { ...field, value: userToUse.name ? userToUse.name.split(' ')[0] : field.value, width: "50%" };
          case 'lastName':
            return { ...field, value: userToUse.name ? userToUse.name.split(' ')[1] : field.value, width: "50%" };
          case 'email':
            return { ...field, value: userToUse.email || field.value };
          case 'phone':
            return { ...field, value: userToUse.phone ? phoneFormat(userToUse.phone, 'US', true) : field.value };
          case 'address':
            return { ...field, value: userToUse.address || field.value };
          default:
            return field;
        }
      });

      if (!fields[0]?.value) setFields(updatedFields);
      if (!initialFields) setInitialFields(updatedFields);
      return updatedFields;
    }
  };

  const init = async () => {
    handleUser().then(
      (updatedFields: any) => handleDisabled(updatedFields)
    );
  };

  useEffect(() => {
    if (!fields[0]?.value) init();
  }, [_user, disabled]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='contact-form'>
        {title && <div className='contact-form__title'>{title}</div>}
        <UiForm
          fields={fields}
          disabled={disabled}
          onChange={onChange}
          onSubmit={handleFormSubmit}
          submitText={submit?.text}
        />
      </div>
    </>
  );
};

export default ContactForm;
