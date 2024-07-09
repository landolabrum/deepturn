import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import IAuthenticatedUser from "~/src/models/ICustomer";
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import useWindow from '@webstack/hooks/useWindow';

interface IContactFormProps {
  submit?: {
    text?: string;
  }
  onSubmit: (contactData: any) => void;
  user?: any;
  // user?: IAuthenticatedUser;
  fieldErrors?: any;
  payment?: any;
  title?: string | React.ReactElement | boolean;
}

const ContactForm: React.FC<IContactFormProps> = (props) => {
  const { onSubmit, user, submit, title = 'contact', fieldErrors } = props;
  const window: any = useWindow();
  const width: string | undefined = window.width <= 900 ? "33%" : undefined;

  const defaultContactFields: IFormField[] = [
    { name: 'name', label:"name", type: 'text', placeholder: 'Herbie Hancock', required: true,
      // value:'larz survey'
    },
    { name: 'email',label: 'email', type: 'email', placeholder: 'your@email.com',  required: true, width,
      // value:'larzrandana@gmail.com'
    },
    { name: 'phone', value:'1 (435) 200 - 3006', label: 'phone', type: 'tel', placeholder: '1 (000) 000-0000', required: true, width },
    { name: 'address',label: 'address', type: 'text', placeholder: 'Your Address', required: true, width, 
      // value:{"line1":"333 S 200 E","line2":"","city":"Salt Lake City","state":"UT","postal_code":"84111","country":"US",} 
    },
  ];

  const [fields, setFields] = useState<IFormField[]>(defaultContactFields);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleDisabled = (updatedFields: IFormField[]) => {
    const isFormComplete = updatedFields.every(field => !field.required || (field.value && !field.error));
    setDisabled(!isFormComplete);
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

  const validateField = (field: IFormField): IFormField => {
    let text: string = findField(defaultContactFields, field.name)?.name || "* ";
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
      } else if (typeof field.value === 'string' && field.value.includes(' ') && field.value.split(' ')[1].length < 3) {
        text += ' *Last name, too short*';
        color = errorColor;
      } else if (typeof field.value === 'string' && hasNumbers.test(field.value)) {
        text += ' *Name must not include numbers*';
        color = errorColor;
      }
    }
    console.log({name:field.name, text, b:   field.name == 'text'})
    const hasError = findField(fieldErrors, field.name);
    if(fieldErrors && hasError && field.name == text){
      delete field.error;
    }
    const context = { ...field, label: { text, color } };
    return context;
  };

  const handleFormSubmit = () => {
    const formData = fields.reduce((acc: any, field: any) => {
      acc[field.name] = field.value;
      return acc;
    }, {});
    onSubmit(formData);
  };

  useEffect(() => {
    if (fieldErrors) {
      const updatedFields = fields.map((field: IFormField) => {
        const errorField = findField(fieldErrors, field.name);
        console.log({errorField:errorField, name:field.name})
        if (errorField) {
          return { ...field, error: errorField.error };
        }
        return field;
      });
      setFields(updatedFields);
    }
  }, [fieldErrors]); 

  return (
    <>
      <style jsx>{styles}</style>
      <div className='contact-form'>
        {title && <div className='contact-form__title'>{title}</div>}
        {fieldErrors && <ul>
          { Object.entries(fieldErrors).map(([index, field]:any)=>{
              return <li key={index}>
                <strong>{field?.name}: </strong>{field?.error}
              </li>
          })}
          </ul>}
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
