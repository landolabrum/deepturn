// Relative Path: ./ResetPassword.tsx
import React, { useState } from 'react';
import styles from './ResetPassword.scss';
import { ILogin } from '../../controller/Login';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import useUserAgent from '@webstack/hooks/useUserAgent';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';

// Remember to create a sibling SCSS file with the same name as this component

const ResetPassword: React.FC<ILogin> = ({ email }) => {
    const MemberService = getService<IMemberService>("IMemberService");
    const [fields, setFields] = useState<IFormField[]>([
        { name: 'email', value: email }
    ]);
    const user_agent = useUserAgent();
    const handleResetPassword = (fields: IFormField[]) => {
        const email = findField(fields,'email')?.value;
        if(typeof email == 'string' && user_agent){
            // console.log('[handleResetPassword]',{email, user_agent});
            MemberService.resetPassword({email, user_agent})
        }

    }
    
    return (
        <>
            <style jsx>{styles}</style>
            <UiForm
                fields={fields}
                onSubmit={handleResetPassword}
                submitText='send reset password'
            />
        </>
    );
};

export default ResetPassword;