import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IUser from '~/src/models/UserContext';
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
    {
      name: 'firstName', label: 'First Name', width: "50%", type: 'text', placeholder: 'First Name', required: true,
      // value:"Test"
    },
    {
      name: 'lastName', label: 'Last Name', width: "50%", type: 'text', placeholder: 'Last Name', required: true
      // , value:`${mockDateTime()} ${mockDateTime(true)}`
    },
    {
      name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true
      // , value:'larzrandana@gmail.com'
    },
    {
      name: 'phone', label: 'Phone', type: 'tel', placeholder: '1 (555) 555-5555', required: true,
      // value:'4344343433'
    },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Your Address', required: true },
  ];

  const _user = useUser();
  const [fields, setFields] = useState<IFormField[]>(initialContactFields);
  const [initialFields, setInitialFields] = useState<IFormField[] | undefined>();
  const [disabled, setDisabled] = useState<boolean>(true);
  // const selectedUser:  = user || loggedInUser;


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let fieldsRef = fields.map((field: IFormField, i) => {
      if (field.name === name) field.value = value;
      return field;
    })
    setFields(fieldsRef); // Update the state with the modified fields
    handleDisabled(fieldsRef); // Update the disabled state based on the new fields
  };



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault;
    const formData = fields.reduce((acc: any, field: any) => {
      const fieldName = field.name;
      if (['firstName', 'lastName'].includes(fieldName)) {
        acc[fieldName] = field.value;
      } else {
        acc[fieldName] = field.value;
      }
      return acc;
    }, {});

    formData.name = `${formData.firstName} ${formData.lastName}`; // Combining firstName and lastName
    delete formData.firstName; // Remove firstName
    delete formData.lastName; // Remove lastName
    onSubmit(formData);
  };


  const handleDisabled = async (updatedFields: IFormField[]) => {
    if (!Array.isArray(updatedFields)) {
      // console.error('updatedFields is not an array', updatedFields);
      return; // Exit the function or handle this case as appropriate
    }
    const isComplete = updatedFields.map((field: IFormField) => {
      const initialValue = initialFields && findField(initialFields, field.name)?.value;
      const isInitialValue = field?.value === initialValue;
      const isEmptyValue = !['', undefined, null, {}].includes(field.value);
      return Boolean(isInitialValue && isEmptyValue);
    });
    const shouldDisable = isComplete.filter(f => f === false)?.length === 0;
    if (shouldDisable !== disabled) setDisabled(shouldDisable);
    return;
  };


  const userToUse = user || _user;
  const handleUser = async () => {
    // Check if a user has been selected and update fields accordingly
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
    )
  }
  useEffect(() => {
    if(!fields[0]?.value)init()
  }, [_user]);


  return (
    <>
      <style jsx>{styles}</style>
      <div className='contact-form'>

        {JSON.stringify(fields[0]?.value == undefined)}
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
