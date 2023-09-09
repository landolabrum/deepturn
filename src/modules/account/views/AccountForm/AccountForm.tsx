// Relative Path: ./AccountForm.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountForm.scss';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiForm from '@webstack/components/UiForm/UiForm';
import formatAccountFields from './components/FormatAccountForm';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiInput from '@webstack/components/UiInput/UiInput';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountForm {
    collapse?: boolean
}
const AccountForm: React.FC<any> = ({ collapse }: IAccountForm) => {
    const user = useUser();
    const [fields, setFields] = useState<any>(null);
    const [loading, setloading] = useState<boolean | string>(true);
    const memberService = getService<IMemberService>("IMemberService");

    const handleSubmit = async (formValues: any) => {
        if (!user) return;
        setloading('updating account');
        const memberResponse = await memberService.updateMember(user.id, formValues);
        // console.log(`[ FUNCTION ]: ${JSON.stringify(memberResponse)}`);
        if (memberResponse?.id) {
            setloading('success');
            setFields(formatAccountFields(memberResponse));
        }
    }

    function getAccount() {
        if (user) {
            const userData = formatAccountFields(user);
            if (userData) {
                setFields(userData);
                setloading(false);
            }
        }
    }

    useEffect(() => {
        getAccount();
    }, []);
    if (!loading || loading == 'success') return (
        <>
            <style jsx>{styles}</style>
            {loading == 'success' &&
                <UiInput
                    variant='link'
                    disabled
                    traits={{
                        beforeIcon: {
                            icon: 'fa-check', color: '#4f96ff'
                        },
                        backgroundColor: 'transparent',
                        width: "100%"
                    }}
                    value="successfully modified your account"
                />
            }
            {(collapse != undefined) ? (

                <UiCollapse
                    open={collapse !== undefined ? collapse : true}
                    label={user?.address ? (
                        <div className='account-form__collapes-label'>
                            <UiIcon icon='fas-location-pin' />
                            {/* {user?.name && <div className='account-form__label-name'>{user?.name}</div>} */}
                            {user?.address !== undefined && <div className='account-form__collapse-label-address'>
                                <div>{user.address?.line1} {user.address?.line2}</div>
                                <div>{user.address?.city}, {user.address?.state} {user.address?.postal_code}</div>
                            </div>}
                        </div>
                    ) : ('no info! update account')}
                >
                    <UiForm btnText='Update Account' fields={fields}  onSubmit={handleSubmit} />
                </UiCollapse>
            ) : (<>
                {user?.address ? (
                    <div className='account-form__collapes-header'>
                        <div className='account-form__collapes-label'>
                            <UiIcon icon='fal-circle-user' />
                            {user?.name !== undefined && <div className='account-form__collapse-label-address'>
                                <div>{user.name}</div>
                                <div>{user.email}</div>
                                <div>{user?.phone !== undefined && phoneFormat(user.phone, 'us')}</div>
                            </div>}
                        </div>
                        <div className='account-form__collapes-label'>
                            <UiIcon icon='fas-location-pin' />
                            {user?.address !== undefined && <div className='account-form__collapse-label-address'>
                                <div>{user.address?.line1} {user.address?.line2}</div>
                                <div>{user.address?.city}, {user.address?.state} {user.address?.postal_code}</div>
                            </div>}
                        </div>
                    </div>
                ) : ('no info! update account')}
                <UiForm
                    btnText='Update Account'
                    fields={fields}
                    onSubmit={handleSubmit} 
                />
            </>
            )}
        </>
    );
    if (loading || loading != 'success') return <UiLoader
        height="600px"
        text={loading}
        position='relative'
    />
};

export default AccountForm;

