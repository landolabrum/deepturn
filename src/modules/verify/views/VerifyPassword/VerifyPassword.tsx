// Relative Path: ./VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import styles from './VerifyPassword.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import SignIn from '~/src/modules/authentication/views/SignIn/controller/SignIn';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useModal } from '@webstack/components/modal/contexts/modalContext';

// Remember to create a sibling SCSS file with the same name as this component
interface VerifyPassword {
    token?: string;
    onSuccess: (e: any) => void;
}
interface IVerifyPasswordState {
    status?: string;
    detail?: {
        detail: string
    };
    fields?: IFormField[];
    message?: string;
    customer?: any;
}
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
const VerifyPassword: React.FC<any> = ({ token, onSuccess }: VerifyPassword) => {
    const [state, setState] = useState<IVerifyPasswordState>({ status: 'verifying_email' });
    const MemberService = getService<IMemberService>("IMemberService");
    const {openModal}=useModal();

    const handleVerify = async () => {
        if(!ENCRYPTION_KEY)return;
        if (!token) {
            setState({ status: 'no_token_present' });
            return;
        }
        const verifiedResponse = await MemberService.decryptJWT({
            token: token,
            secret: ENCRYPTION_KEY,
            algorithm: 'HS256'
        });
        if (verifiedResponse) setState(verifiedResponse);
    }

    const loadingText = (): string => {
        let context = '';
        const isString = (e: any) => typeof e == 'string';
        if (isString(state.status)) context = String(state.status)
        else if (isString(state.detail)) context = String(state.detail);
        else if (state.detail?.detail && isString(state.detail?.detail)) context = state.detail.detail;
        return keyStringConverter(context);
    }

    const onChange = (e: any) => {
        const { name, value } = e.target;
        const stateFields = state?.fields;
        const iter = (fieldName: string) => { return stateFields?.find((f: IFormField) => f.name === fieldName); }
        const pw_value = iter('password')?.value;
        const confirm_pw_value = iter('confirm_password')?.value;
        // Create a new fields array with updated values and errors
        const updatedFields = stateFields?.map((field: IFormField) => {
            if (field.name === name) {
                const updatedField = { ...field, value };
                const is_p = name === 'password'
                const is_c = name === 'confirm_password'
                if (Boolean(is_c && pw_value !== value && pw_value !== '')
                    || Boolean(is_p && confirm_pw_value !== value && confirm_pw_value !== '')) {
                    updatedField.error = 'Not Same as Password';
                }
                else if (updatedField.error) {

                    delete updatedField.error;
                }
                return updatedField;
            }
            return field;
        });
        setState({ ...state, fields: updatedFields });
    };
    const onSubmit = async () => {
        const newPassword = state?.fields?.find((f: IFormField) => f.name == 'password')?.value;
        let customer = state.customer;
        customer.metadata.user.password = newPassword;
        const updateMember = await MemberService.modifyCustomer( customer);
        if (updateMember){
            handleSignInModal();
            onSuccess(updateMember.email);
        }
    }
    const handleSignInModal = () =>{
       openModal(<SignIn email={state.customer.email} />)
    }
    useEffect(() => {
        handleVerify()
    }, [token]);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='verify-email'>
                <div className={`verify-email__content${state.status === 'verification_success'?' verify-email__content--success':'' }`}>
                    <div className='verify-email__content--loader'>
                        <UiLoader position='relative' text={loadingText()} dots={state?.status != undefined && ['verifying_email'].includes(state?.status)} />
                    </div>
                    {JSON.stringify(state.fields)}
                    {state.status == 'incomplete' && state?.fields &&
                        <UiForm
                            title={String(state?.detail) || undefined}
                            onChange={onChange}
                            fields={state.fields}
                            onSubmit={onSubmit}
                        />
                    }

                    {state.status === 'verification_success' && state.customer.email && <div className='verify-email__content__sign-in'>
                    <UiButton onClick={handleSignInModal}>Login</UiButton>

                    </div>}
                </div>
            </div>
        </>
    );
};

export default VerifyPassword;