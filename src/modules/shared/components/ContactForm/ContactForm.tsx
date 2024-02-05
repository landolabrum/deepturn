import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { findField, updateField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

interface IContactFormProps {
  onSubmit: (contactData: any) => void; // Consider defining a more specific type for contactData
}

const ContactForm: React.FC<IContactFormProps> = ({ onSubmit }) => {
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
  const user = useUser();

  const [fields, setFields] = useState(initialContactFields);
  const [disabled, setDisabled] = useState<boolean>(true);

  const onChange = (e: any, handleErrors = true) => {
    const { name: name, value: value, error: error } = e.target;
    const onChangeErrors = () => {
        const noValue = () => { return `${name} cannot be blank.` }
        if (e.target.error) return e.target.error;

        switch (name) {
            case 'firstName':
                if (2 > value?.length) return 'not long enough';
                break;
            case 'lastName':
                if (2 > value?.length) return 'not long enough';
                break;
            case 'email':
                if (value == null) return noValue();
                if (!Boolean(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))) return 'email invalid';
                break;
            case 'phone':
                // console.log('value',value)
                if (value == null) return noValue();
                break;
            case 'address':
                if (value == null) return noValue();
                else setDisabled(false);
                break;
            default:
                break;
        }
    }
    let updatedContact = fields.map((contactField: any) => {
        if (contactField.name === name) {
            contactField.value = value;
            if (handleErrors) contactField.error = onChangeErrors();
        }
        return contactField;
    });
    setFields(updatedContact);
};
const handleFormSubmit = (userFields?: any) => {
  let firstName = '';
  let lastName = '';
  const fieldsToUse = userFields ? userFields : fields;
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

    if (user) {
      const updatedFields = fields.map((field:IFormField) => {
        switch (field.name) {
          case 'firstName':
            return { ...field, value: user.name?.split(' ')[0] };
          case 'lastName':
            return { ...field, value: user.name?.split(' ')[1] };
          case 'email':
            return { ...field, value: user.email };
          case 'phone':
            return { ...field, value: phoneFormat(user?.phone, 'US', true) };
          case 'address':
            return { ...field, value: user.address }; // Adapt this if address is structured differently
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
