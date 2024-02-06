import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { findField, updateField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import UserContext from '~/src/models/UserContext';

interface IContactFormProps {
  onSubmit: (contactData: any) => void; // Consider defining a more specific type for contactData
  user?: any
}

const ContactForm: React.FC<IContactFormProps> = ({ onSubmit, user }) => {
  const initialContactFields: any = [
    {
      name: 'firstName', label: 'first name', type: 'text',
      placeholder: 'first name',
      required: true,
    },
    {
      name: 'lastName', label: 'last name', type: 'text',
      placeholder: 'last name',
      required: true,
    },
    {
      name: 'email', label: 'email', type: 'email',
      placeholder: 'your@email.com',
      required: true,
    },
    {
      name: 'phone', label: 'phone', type: 'tel',
      placeholder: '1 (555) 555 5555',
      required: true,
    },
    { name: 'address', label: 'address', required: true, },
  ];
  const loggedInUser = useUser();

  const [fields, setFields] = useState(initialContactFields);
  const [disabled, setDisabled] = useState<boolean>(true);
  const selectedUser:UserContext | undefined = user ||  loggedInUser;

  const onChange = (e: any, handleErrors = true) => {
    const { name, value } = e.target;

    const onChangeErrors = () => {
        const noValue = () => `${name} cannot be blank.`;
        if (e.target.error) return e.target.error;
        console.log('[name, value]',name, value)
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (value?.length < 2) return 'not long enough';
                break;
            case 'email':
                if (!value) return noValue();
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) return 'email invalid';
                break;
            case 'phone':
                if (!value) return noValue();
                break;
            case 'address':
                if (!value) return noValue();
                else setDisabled(false);
                break;
            default:
                break;
        }
    };

    const updatedContact = fields.map((contactField: any) => {
        if (contactField.name === name) {
            return {
                ...contactField,
                value: value,
                ...(handleErrors && { error: onChangeErrors() })
            };
        }
        return contactField;
    });
    console.log('[ updatedContact ]',updatedContact)
    setFields(updatedContact);
};
const handleFormSubmit = (userFields?: any) => {
  let firstName = '';
  let lastName = '';
  const fieldsToUse = userFields ? userFields : fields;
  console.log('[ handleFOrmSubmiot ]', {
    fieldsToUse:fieldsToUse,
    userFields:userFields,
    fields:fields
  })
  const fieldsObject = fieldsToUse.reduce((obj: any, field: IFormField) => {
    if (field.name === 'firstName') {
      firstName = String(field.value);
    } else if (field.name === 'lastName') {
      lastName =  String(field.value)
    }
    
    obj[field.name] = field.value;
    return obj;
  }, {});

  // Combine firstName and lastName to create fullName
  fieldsObject.name = `${firstName} ${lastName}`.trim();
  onSubmit(fieldsObject);
};

  useEffect(() => {
    if (selectedUser) {
      const updatedFields = fields.map((field:IFormField) => {
        switch (field.name) {
          case 'firstName':
            return { ...field, value: selectedUser.name?.split(' ')[0] };
          case 'lastName':
            return { ...field, value: selectedUser.name?.split(' ')[1] };
          case 'email':
            return { ...field, value: selectedUser.email };
          case 'phone':
            return { ...field, value: phoneFormat(selectedUser?.phone, 'US', true) };
          case 'address':
            return { ...field, value: selectedUser.address }; // Adapt this if address is structured differently
          default:
            return field;
        }
      });
      setFields(updatedFields);
      // setTimeout(() => {
      // handleFormSubmit(updatedFields)
        
      // }, 1000);
      // Decide whether to disable the submit button initially
      disabled === true && setDisabled(false); // or some logic to determine if the form is initially valid
    }

  }, []);



  return (<>
    <style jsx>{styles}</style>
    <div className='contact-form'>
      <div className='contact-form__title'>contact</div>
      <UiForm
        fields={fields}
        disabled={disabled}
        onChange={onChange}
        onSubmit={handleFormSubmit}
      />
    </div>
  </>
  );
};

export default ContactForm;
