import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UserContext from '~/src/models/UserContext';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

interface IContactFormProps {
  submitText?: string;
  onSubmit: (contactData: any) => void;
  user?: any;
}

const ContactForm: React.FC<IContactFormProps> = ({ onSubmit, user, submitText }) => {
  const initialContactFields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '1 (555) 555-5555', required: true },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Your Address', required: true },
  ];

  const loggedInUser = useUser();
  const [fields, setFields] = useState(initialContactFields);
  const [disabled, setDisabled] = useState<boolean>(true);
  const selectedUser: UserContext | undefined = user || loggedInUser;

  useEffect(() => {
    if (selectedUser) {
      let updatedFields = [...initialContactFields];
      if (selectedUser.name) {
        const [firstName, lastName] = selectedUser.name.split(' ');
        updatedFields = updatedFields.map(field => {
          if (field.name === 'firstName') return { ...field, value: firstName };
          if (field.name === 'lastName') return { ...field, value: lastName };
          return field;
        });
      }
      if (selectedUser.email) {
        updatedFields = updatedFields.map(field => field.name === 'email' ? { ...field, value: selectedUser.email } : field);
      }
      if (selectedUser.phone) {
        updatedFields = updatedFields.map(field => field.name === 'phone' ? { ...field, value: phoneFormat(selectedUser.phone, 'US', true) } : field);
      }
      if (selectedUser.address) {
        updatedFields = updatedFields.map(field => field.name === 'address' ? { ...field, value: selectedUser.address } : field);
      }

      setFields(updatedFields);
      setDisabled(false);
    }
  }, [selectedUser]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields(prevFields => {
      return prevFields.map((field: any) => {
        if (field.name === name) {
          return { ...field, value: value };
        }
        return field;
      });
    });
  };


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault;
    const formData = fields.reduce((acc: any, field: any) => {
      const fieldName = field.name;
      if (['firstName', 'lastName'].includes(fieldName)) {
        acc[fieldName] = field.value;
      } else  {
        acc[fieldName] = field.value;
      }
      return acc;
    }, {});
    formData.name = `${formData.firstName} ${formData.lastName}`; // Combining firstName and lastName
    delete formData.firstName; // Remove firstName
    delete formData.lastName; // Remove lastName
    onSubmit(formData);
  };
  
  
  const handleDisabled = () => {
    const allFieldsHaveValue = fields.every((field: IFormField) => field.value !== undefined && field.value !== '');
    setDisabled(!allFieldsHaveValue);

  }
  useEffect(() => {
    handleDisabled()
  }, [onChange]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='contact-form'>
        <div className='contact-form__title'>Contact</div>
        {/* {JSON.stringify(addressField)} */}
        <UiForm
          fields={fields}
          disabled={disabled}
          onChange={onChange}
          onSubmit={handleFormSubmit}
          submitText={submitText}
        />
      </div>
    </>
  );
};

export default ContactForm;
