// Relative Path: ./AccountMethod.tsx
import React, { useCallback, useEffect, useState } from 'react';
import styles from './AccountMethods.scss';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { IMethod } from '../../model/IMethod';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import AccountCreateMethod from './components/AccountCreateMethod/AccountCreateMethod';
import AccountCurrentMethod from './components/AccountCurrentMethod/AccountCurrentMethod';

// Remember to create a sibling SCSS file with the same name as this component

const AccountMethods: React.FC = () => {
  const [loading, setloading] = useState<boolean | string>(true);
  const [methods, setMethods] = useState<IMethod[]>([]);
  const memberService = getService<IMemberService>("IMemberService");
  const user = useUser();

  const fetchCustomerMethods = async () => {
    const methodsResponse = await memberService.getCustomerMethods();
    if (methodsResponse) setMethods(methodsResponse?.data);
    setloading(false);
  }


   const createMethod = async (method: any) =>{
            if(user == undefined) return;
            setloading('updating account');
            const request = {
                number: method.number.replaceAll(" ",''),
                exp_month: method.expiry.split('/')[0],
                exp_year: method.expiry.split('/')[1],
                cvc: method.cvc
            }
            const createdMethod = await memberService.createCustomerMethod(user.id, request);
            if(createdMethod.error){
              setloading(`*${createdMethod.error}`)
            }else{
                setloading('success');
                fetchCustomerMethods();
            }
            console.log(`[ FUNCTION ]: ${JSON.stringify(createdMethod)}`);
        }
  useEffect(() => {
    fetchCustomerMethods();
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='account-methods'>
        <AccountCreateMethod
        loading={loading}
        onSubmit={createMethod}
        />
        <div className='account-methods__header'>
        <div className='account-methods__title'>
          payment methods
        </div>
        </div>
        <div className='account-methods__existing'>
        {methods.length ? Object.entries(methods).map(([key, method]) => {
          return <span key={key} >
            <AccountCurrentMethod method={method}/>
          </span>
        }) :
        (<UiLoader position='relative' height={500} />)
        }
        </div>
      </div>
    </>
  );
};

export default AccountMethods;