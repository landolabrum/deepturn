// Relative Path: ./VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import styles from './VerifyEmail.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

// Remember to create a sibling SCSS file with the same name as this component
interface IVerifyEmail{
    token?: string;
    onSuccess: (e:any)=>void;
}
interface IVerifyEmailState{
    status?: string;
    detail?: {
        detail: string
    };
    message?: string;
}
const VerifyEmail: React.FC<any> = ({token, onSuccess}:IVerifyEmail) => {
    const [state, setState]=useState<IVerifyEmailState>({status:'verifying_email'});
    const memberService = getService<IMemberService>("IMemberService");


    const handleVerify = async () =>{
        if(!token)return;
        const isVerified = await memberService.verifyEmail(String(token));
        if(isVerified)setState(isVerified);
    }

    const loadingText = (): string=>{
        let context = '';
        const isString = (e: any) => typeof e == 'string';
        if(isString(state.status))context = String(state.status)
        else if(isString(state.detail))context = String(state.detail);
        else if(state.detail?.detail && isString(state.detail?.detail))context = state.detail.detail;
        return keyStringConverter(context);
    }
    useEffect(() => {
        if(state.status == 'success')()=>onSuccess('email_verified')
    },[state]);
    useEffect(() => {
        handleVerify()
    }, [token]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify-email'>
        <UiLoader text={loadingText()} dots={!Boolean(state.status == 'success')}/>
      </div>
    </>
  );
};

export default VerifyEmail;