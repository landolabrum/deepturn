// Relative Path: ./JoinRegister.tsx
import React, { useCallback, useEffect, useMemo } from 'react';
import styles from './JoinForms.scss';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import environment from '~/src/core/environment';

import { useUser } from '~/src/core/authentication/hooks/useUser';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useNotification } from '@webstack/components/Notification/Notification';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import useWindow from '@webstack/hooks/window/useWindow';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import useDevice from '~/src/core/authentication/hooks/useDevice';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';

interface JoinRegisterProps {
  openModal: (config: any) => void;
}

const JoinRegister = ({ openModal }: JoinRegisterProps) => {
  const windowSize = useWindow();
  const user = useUser();
  const guest = useGuest();
  const MemberService = getService<IMemberService>('IMemberService');
  const device = useDevice();
  const [notification, setNotification] = useNotification();
  const { sessionData, setSessionItem } = useSessionStorage();

  const width = useMemo(() => (windowSize.width >= 900 ? '50%' : '100%'), [windowSize.width]);

  const initialFields: IFormField[] = useMemo(() => [
    { name: 'name', label: 'name', type: 'text', placeholder: 'Herbie Hancock', required: true },
    { name: 'email', label: 'email', type: 'email', placeholder: 'your@email.com', required: true, width },
    { name: 'phone', value: '1 (435) 200 - 3006', label: 'phone', type: 'tel', placeholder: '1 (000) 000-0000', required: true, width },
    {
      name: 'agree',
      type: 'checkbox',
      label: 'Agree',
      required: true,
      msg: 'By submitting this form you consent to receive SMS/text messages from Nirvana Energy at the number you provided. Messages may be sent by autodialer. Consent is not a condition of purchase. Message frequency varies (up to 2 msgs/mo). Message & data rates may apply.',
      width: '100%',
    },
  ], [width]);

  const fields: IFormField[] = useMemo(() => {
    const stored = sessionData?.joinFields;
    if (!stored) {
      setSessionItem('joinFields', initialFields);
      return initialFields;
    }
    return stored;
  }, [sessionData, initialFields]);

  const handleForm = useCallback((e: any) => {
    const { name, value } = e?.target;
    const updated = fields.map((field) => field.name === name ? { ...field, value } : field);
    setSessionItem('joinFields', updated);
  }, [fields, setSessionItem]);

  const handleSubmit = async () => {
    const values: Record<string, any> = {};
    fields.forEach(field => {
      if (field.name && field.name !== 'agree') {
        values[field.name] = field.value || '';
      }
    });

    const [firstName = '', lastName = ''] = (values.name || '').split(' ');

    const request = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      metadata: {
        user: {
          email: values.email,
          first_name: firstName,
          last_name: lastName,
          devices: [{ ...device, created: `${Date.now()}` }],
        },
        merchant: environment.merchant,
      },
    };
    
    // try {
    //   const response = await MemberService.signUp(request);
    //   if (response?.email) {
    //     setNotification({
    //       active: true,
    //       list: [{ label: 'Sign up successful', message: 'Welcome! You’ve been signed up successfully.' }],
    //       dismissable: true
    //     });
    //   } else if (response?.status === 'existing') {
    //     setNotification({
    //       active: true,
    //       list: [{ label: 'User Exists', message: 'User already exists. You may log in.' }],
    //       dismissable: true
    //     });
    //   } else {
    //     console.error('[SIGN UP ERROR]: Unexpected response', response);
    //     setNotification({
    //       active: true,
    //       list: [{ label: 'Unexpected Response', message: 'Unexpected server response. Please try again later.' }],
    //       dismissable: true
    //     });
    //   }
    // } catch (e: any) {
    //   if (e?.detail?.fields) {
    //     const updated = fields.map((field) => {
    //       const err = e.detail.fields.find((f: any) => f.name === field.name);
    //       return err ? { ...field, error: err.message } : field;
    //     });
    //     setSessionItem('joinFields', updated);
    //     setNotification({
    //       active: true,
    //       apiError: {
    //         message: 'There was an error with your submission.',
    //         status: e?.status || 400,
    //         detail: e?.detail || 'Unknown error',
    //         error: true
    //       }
    //     });
    //   } else {
    //     console.error('[SIGN UP ERROR]:', e);
    //     setNotification({
    //       active: true,
    //       list: [{ label: 'Submission Failed', message: 'Something went wrong. Please try again later.' }],
    //       dismissable: true
    //     });
    //   }
    // }
  };

  const views = useMemo(() => ({
    join: (
      <ContactForm
        submit={{ text: `Join ${keyStringConverter(environment.merchant.name)}` }}
        fieldErrors={undefined}
        title="Get In Touch"
        onChange={handleForm}
        onSubmit={handleSubmit}
        user={user}
        fields={fields}
      />
    ),
  }), [fields, handleForm, handleSubmit, user]);

  return (
    <>
      <style jsx>{styles}</style>
      <pre 
        style={{fontSize:"10px", maxWidth:"400px"}}
        className="debug-json"
      >{JSON.stringify(fields, null, 2)}</pre>
      <div className="join-register s-5">
        <div className="join-register__content">
          <div className="join-register__content--body">
            {fields?.length && (
              <UiViewLayout
                currentView="join"
                views={views}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinRegister;