// Relative Path: ./AccountForm.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountForm.scss';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiForm from '@webstack/components/UiForm/UiForm';
import formatAccountFields  from './components/FormatAccountForm';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiInput from '@webstack/components/UiInput/UiInput';

// Remember to create a sibling SCSS file with the same name as this component

const AccountForm: React.FC<any> = ({ }) => {
    const user = useUser();
    const [fields, setFields] = useState<any>(null);
    const [loading, setloading] = useState<boolean | string>(true);
    const memberService = getService<IMemberService>("IMemberService");

    const handleAccount = async (formValues: any) =>{
        if(!user)return;
        setloading('updating account');
        const memberResponse = await memberService.updateMember(user.id, formValues);
        console.log(`[ FUNCTION ]: ${JSON.stringify(memberResponse)}`);
        if(memberResponse?.id){
            setloading('success');
            setFields(formatAccountFields(memberResponse));
        }
    }
    
    function getAccount(){
        if (user){
            const userData = formatAccountFields(user);
            if(userData){
                setFields(userData);
                setloading(false);
            }
        }
    }
    useEffect(() => {
       getAccount();
    }, [setFields]);
    if(!loading || loading =='success' )return (
        <>
            <style jsx>{styles}</style>
            {loading == 'success' && 
                <UiInput 
                    variant='link'
                    disabled
                    traits={{
                        beforeIcon:{
                            icon:'fa-check', color:'#4f96ff'
                        },
                        backgroundColor: 'transparent',
                        width:"100%"
                    }} 
                    value="successfully modified your account"
                />
            }
            <UiForm 
                fields={fields}
                onSubmit={handleAccount}
            />
        </>
    );
    if(loading || loading !='success' )return <UiLoader 
                height="600px"
                text={loading} 
                position='relative'
            />
};

export default AccountForm;