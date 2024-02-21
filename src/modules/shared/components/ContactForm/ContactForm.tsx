import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UserContext from '~/src/models/UserContext';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { mockDateTime } from '@webstack/helpers/MockData';

interface IContactFormProps {
  submitText?: string;
  onSubmit: (contactData: any) => void;
  user?: any;
}

const ContactForm: React.FC<IContactFormProps> = ({ onSubmit, user, submitText }) => {
  const initialContactFields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name', required: true, value:mockDateTime(true)},
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', required: true, value:mockDateTime()},
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true, value:'larzrandana@gmail.com'},
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '1 (555) 555-5555', required: true, value:'4344343433'},
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Your Address', required: true },
  ];

  const loggedInUser = useUser();
  const [fields, setFields] = useState<IFormField[]>(initialContactFields);
  const [initialFields, setInitialFields]=useState<IFormField[] | undefined>();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedUser, setUser]=useState<UserContext | undefined>()
  // const selectedUser:  = user || loggedInUser;


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[ onChange (1)]', fields);
    const { name, value } = e.target;
    let fieldsRef = fields.map((field:IFormField,i)=>{
      if(field.name === name){
        console.log('[ fieldNAme ]', i)

        field.value = value;
      }
      return field;
    })
    // const fieldsRef = fields.reduce((acc: IFormField[], field: IFormField) => {
    //   // Check if the current field is the one being updated
    //   if (field.name === name) {
    //     // If so, update its value and add it to the accumulator
    //     acc.push({ ...field, value: value });
    //   } else {
    //     // Otherwise, add the field unchanged to the accumulator
    //     acc.push(field);
    //   }
    //   return acc;
    // }, []); // Initialize the accumulator as an empty array
  
    console.log('[ onChange (2)]', fieldsRef);
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
    // console.log('[ updateFields ]',updatedFields)
    if (!Array.isArray(updatedFields)) {
      console.error('updatedFields is not an array', updatedFields);
      return; // Exit the function or handle this case as appropriate
    }
    const isComplete = updatedFields.map((field: IFormField) => {
      const initialValue = initialFields && findField(initialFields, field.name)?.value;
      const isInitialValue = field?.value === initialValue;
      const isEmptyValue = !['', undefined, null, {}].includes(field.value);
      return Boolean(isInitialValue && isEmptyValue);
    });
    const shouldDisable = isComplete.filter(f => f === false)?.length === 0;
    if(shouldDisable !== disabled)setDisabled(shouldDisable);
    return;
  };


const handleUser = async () => {
  // Check if a user has been selected and update fields accordingly
  const userToUse = selectedUser || user || loggedInUser;
  if (userToUse) {
    const updatedFields = fields.map((field) => {
      switch (field.name) {
        case 'firstName':
          return { ...field, value: userToUse.name ? userToUse.name.split(' ')[0] : field.value };
        case 'lastName':
          return { ...field, value: userToUse.name ? userToUse.name.split(' ')[1] : field.value };
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

    setFields(updatedFields);
    if (!initialFields) setInitialFields(updatedFields);
  }
};
  const init = async () => {
    handleUser().then((updatedFields: any) => handleDisabled(updatedFields))
  }
  useEffect(() => {
    init()
  }, []);


  return (
    <>
      <style jsx>{styles}</style>
      <div className='contact-form'>
        <div className='contact-form__title'>Contact</div>
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