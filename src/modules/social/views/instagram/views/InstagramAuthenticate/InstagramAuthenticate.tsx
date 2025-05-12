import React, { useState } from 'react';
import styles from './InstagramAuthenticate.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useFormState } from '@webstack/components/UiForm/functions/useFormState';
import { getService } from '@webstack/common';
import ISocialService from '~/src/core/services/SocialService/ISocialService';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { ICustomer } from "~/src/models/ICustomer";
import { InstagramAuthenticateRequest } from '~/src/core/services/SocialService/ISocialService';

const InstagramAuthenticate: React.FC<{ user: ICustomer }> = ({ user }) => {
  const initialFormFields: IFormField[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      autoComplete: "off"
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "off"
    }
  ];

  const [fields, setField] = useFormState(initialFormFields);
  const [error, setError] = useState<string | null>(null);
  const socialService = getService<ISocialService>("ISocialService");

  const handleSubmit = async () => {
    if(!user?.email) return;
    const username = findField(fields, 'username')?.value;
    const password = findField(fields, 'password')?.value;

    const request: InstagramAuthenticateRequest = {
      email: user.email,
      username: username as string,
      password: password as string
    };
    console.log(request)
    try {
      const response = await socialService.instagramAuthenticate(request);
      console.log('Instagram authentication successful:', response);
      // Handle success scenario, maybe update the UI accordingly
    } catch (error: any) {
      console.error('Instagram authentication error:', error?.details);
      if (error?.fields) {
        const fieldError = error.fields[0];
        setError(`${fieldError.name}: ${fieldError.error}`);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className='instagram-sign-in'>
        <div className='instagram-sign-in__header'>
          Authenticate <UiIcon icon="fa-instagram" />
        </div>
        {error && <div className="error-message">{error}</div>}
        <UiForm
          fields={fields}
          onChange={setField}
          onSubmit={handleSubmit}
          submitText={'Instagram Sign In'}
        />
      </div>
    </>
  );
};

export default InstagramAuthenticate;
