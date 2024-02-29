// Relative Path: ./ResetPassword.tsx
import React, { useState } from 'react';
import styles from './ResetPassword.scss';
import { ISignIn } from '../../controller/SignIn';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';

// Remember to create a sibling SCSS file with the same name as this component

const ResetPassword: React.FC<ISignIn> = ({ email }) => {
    const MemberService = getService<IMemberService>("IMemberService");
    const [fields, setFields] = useState<IFormField[]>([
        { name: 'email', value: email }
    ]);
    const handleResetPassword = (fields: IFormField[]) => {

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