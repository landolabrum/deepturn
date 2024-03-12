// Relative Path: ./InstagramSignIn.tsx
import React, { useState } from 'react';
import styles from './InstagramSignIn.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useFormState } from '@webstack/components/UiForm/functions/useFormState';
import { getService } from '@webstack/common';
import ISocialService from '~/src/core/services/SocialService/ISocialService';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';

// Remember to create a sibling SCSS file with the same name as this component

const InstagramSignIn: React.FC = () => {
    const formPrepData:IFormField[] = [
        {
            name:"username",
            label:"username",
            type: "text",
            autoComplete: "off"
        },{
            label:"password",
            name:"password",
            type:"password",
            autoComplete: "off"
        }
    ]
    const [ fields, setField ] = useFormState(formPrepData);

    const socialService = getService<ISocialService>("ISocialService");

    const onSubmit = async (submitFields?: any) =>{
      console.log('[ onSubmit ]', submitFields)
      const username = findField(fields,'username')?.value;
      const password = findField(fields,'password')?.value;
      const request = {
       username, password
      }
      try {
        const response = await socialService.instagramSignIn(request);
        console.log('[ onSubmit ] ( SUCCESS! )', response)
        
      } catch (error:any) {
        console.log('Instagram [ onSubmit ]( error )',error)
        
      }


    };
  return (
    <>
      <style jsx>{styles}</style>
      <div className='instagram-sign-in'>
      <h3>Sign In</h3>
      <UiForm
        fields={fields}
        onChange={setField}
        onSubmit={onSubmit}
        submitText={'instagram sign in'}
      />
      </div>
    </>
  );
};

export default InstagramSignIn;