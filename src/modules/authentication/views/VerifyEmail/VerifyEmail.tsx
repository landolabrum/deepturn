// Relative Path: ./VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import styles from './VerifyEmail.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

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
    fields?: IFormField[];
    message?: string;
    customer?: any;
}
const VerifyEmail: React.FC<any> = ({token, onSuccess}:IVerifyEmail) => {
    const [state, setState]=useState<IVerifyEmailState>({status:'verifying_email'});
    const memberService = getService<IMemberService>("IMemberService");


    const handleVerify = async () =>{
        if(!token){
            alert('no token')
            return;
        }
        const verifiedResponse = await memberService.verifyEmail(String(token));
        // console.log("[ IS VER ]", verifiedResponse)
        if(verifiedResponse.status == 'incomplete')setState(verifiedResponse);
        else if(verifiedResponse.status == 'success' && verifiedResponse.customer)onSuccess(`${verifiedResponse.customer?.email}`);
    }

    const loadingText = (): string=>{
        let context = '';
        const isString = (e: any) => typeof e == 'string';
        if(isString(state.status))context = String(state.status)
        else if(isString(state.detail))context = String(state.detail);
        else if(state.detail?.detail && isString(state.detail?.detail))context = state.detail.detail;
        return keyStringConverter(context);
    }
    const onChange = (e: any) => {
        const { name, value } = e.target;
        const stateFields = state?.fields;
        const iter = (fieldName: string)=> {return stateFields?.find((f: IFormField) => f.name === fieldName);}
        const pw_value = iter('password')?.value;
        const confirm_pw_value = iter('confirm_password')?.value;
        // Create a new fields array with updated values and errors
        const updatedFields = stateFields?.map((field: IFormField) => {
            if (field.name === name) {
                const updatedField = { ...field, value };
                const is_p = name === 'password'
                const is_c = name === 'confirm_password'
                // console.log('[ field ]', { pw_value, confirm_pw_value })
                if ( Boolean( is_c && pw_value !== value && pw_value !== '') 
                || Boolean(is_p && confirm_pw_value !== value && confirm_pw_value !== '') ) {
                    updatedField.error = 'Not Same as Password';
                }
                else if(updatedField.error){

                    delete updatedField.error;
                }
                return updatedField;
            }
            return field;
        });
        setState({ ...state, fields: updatedFields });
    };
    const onSubmit = async () =>{
        const newPassword = state?.fields?.find((f:IFormField)=>f.name == 'password')?.value;
        let customer = state.customer;
        customer.metadata.password = newPassword;
            const updateMember = await memberService.updateMember(customer.id, customer);
            // console.log('[ updateMember ]', updateMember);
            if(updateMember)onSuccess(updateMember.email);
        

    }
    useEffect(() => {
        handleVerify()
    }, [token, state?.status]);
  return (
    <>
      <style jsx>{styles}</style>
      {/* <span style={{color:"#f30"}}>{JSON.stringify(state)}</span> */}
      <div className='verify-email'>
      <div className='verify-email__content'>
        {state.status == 'incomplete' && state?.fields && 
            <UiForm
                title={String(state?.detail) || undefined}
                onChange={onChange}
                fields={state.fields}
                onSubmit={onSubmit}
            />
        }
       {state?.status && ['verifying_email', 'success'].includes(state?.status) && <UiLoader position='relative' text={loadingText()} dots={!Boolean(state.status == 'success')}/>}
      </div>
      </div>
    </>
  );
};

export default VerifyEmail;