import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IAuthenticatedUser from "~/src/models/ICustomer";
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import useWindow from '@webstack/hooks/useWindow';

interface IContactFormProps {
  submit?: {
    text?: string;
  }
  onSubmit: (contactData: any) => void;
  user?: IAuthenticatedUser;
  contactFields?: IFormField[];
  payment?: any;
  title?: string | React.ReactElement | boolean;
}

const ContactForm: React.FC<IContactFormProps> = (props) => {
  const { onSubmit, user, submit, title = 'contact', contactFields } = props;
  const window: any = useWindow();
  const width: string | undefined = window.width <= 900 ? "33%" : undefined;

  const initialContactFields: IFormField[] = [
    { name: 'name', type: 'text', placeholder: 'Herbie Hancock', required: true },
    { name: 'email', type: 'email', placeholder: 'your@email.com', error: contactFields && findField(contactFields, 'email')?.error, required: true, width },
    { name: 'phone', type: 'tel', placeholder: '1 (000) 000-0000', required: true, width },
    { name: 'address', type: 'text', placeholder: 'Your Address', required: true, width },
  ];

  const _user = useUser();
  const [fields, setFields] = useState<IFormField[]>(initialContactFields);
  const [initialFields, setInitialFields] = useState<IFormField[] | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(true);

  const validateField = (field: IFormField): IFormField => {
    let text: string = findField(initialContactFields, field.name)?.name || "* ";
    let color: string | undefined = undefined;
    const errorColor = "var(--orange-50)";
    const hasNumbers = /\d/;

    if (field.required && !field.value) {
      color = "var(--gray-50)";
    } else if (field.name === 'email') {
      const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (typeof field.value === 'string' && !validEmailRegex.test(field.value)) {
        text += ' *Invalid email address*';
        color = errorColor;
      }
    } else if (field.name === 'phone') {
      // Assuming the valid phone number format is 1 (000) 000-0000
      if (typeof field.value === 'string' && String(field.value).length < 20) {
        text += ' *not long enough*';
        color = errorColor;
      }
    } else if (field.name === 'name') {
      if (typeof field.value === 'string' && field.value.length < 3) {
        text += ' *First Name, too short*';
        color = errorColor;
      } else if (typeof field.value === 'string' && !field.value.includes(' ')) {
        text += ' *Full name must include a space*';
        color = errorColor;
      } else if (
        typeof field.value === 'string' && field.value.includes(' ') && field.value.split(' ')[1].length < 3
      ) {
        text += ' *Last name, too short*';
        color = errorColor;
      } else if (typeof field.value === 'string' && hasNumbers.test(field.value)) {
        text += ' *Name must not include numbers*';
        color = errorColor;
      }
    }

    const context = { ...field, label: { text, color } };
    return context;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let fieldsRef = fields.map((field: IFormField) => {
      if (field.name === name) {
        field.value = value;
        return validateField(field);
      }
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
    onSubmit(formData);
  };

  const handleDisabled = (updatedFields: IFormField[]) => {
    const isFormComplete = updatedFields.every(field => !field.required || (field.value && !field.error));
    setDisabled(!isFormComplete);
  };

  const handleUser = async (userToUse: any) => {
    if (userToUse && !initialFields) {
      const updatedFields = fields.map((field) => {
        switch (field.name) {
          case 'name':
            return { ...field, value: userToUse.name || field.value };
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

      setFields(updatedFields.map(field => validateField(field)));
      if (!initialFields) setInitialFields(updatedFields);
    }
  };

  const userToUse = user || _user;
  useEffect(() => {
    if (!initialFields) handleUser(userToUse);
    console.log({contactFields})
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='contact-form'>
        {Object(contactFields)?.length && JSON.stringify(contactFields)}
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
