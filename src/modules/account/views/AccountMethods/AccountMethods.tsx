// Relative Path: ./AccountMethod.tsx
import React, { useCallback, useEffect, useState } from 'react';
import styles from './AccountMethods.scss';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { IMethod } from '../../model/IMethod';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiButton from '@webstack/components/UiButton/UiButton';
import AccountCreateMethod from '../AccountCreateMethod/AccountCreateMethod';

// Remember to create a sibling SCSS file with the same name as this component

const AccountMethods: React.FC = () => {
  const [methods, setMethods] = useState<IMethod[]>([]);
  const memberService = getService<IMemberService>("IMemberService");
  const [clicked, setClicked]=useState<number>(0);
  const fetchCustomerMethods = async () => {
    const methodsResponse = await memberService.getCustomerMethods();
    if (methodsResponse) setMethods(methodsResponse?.data);
  }
  const states = [
    '',
    'account-methods__method-content-show',
    'account-methods__method-content-hide'
  ]
  const handleClick = ()=>{
    // if(!clicked)setClicked(true);
    if([0,1].includes(clicked))setClicked(clicked + 1);
    if(clicked == 2)setClicked(0);
  };

  useEffect(() => {
    fetchCustomerMethods();
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='account-methods'>
        <AccountCreateMethod/>
        {methods.length ? Object.entries(methods).map(([key, method]) => {
          const mm = String(method.card.exp_month).length == 1 ? `0${method.card.exp_month}` : method.card.exp_month;
          return <div key={key} className={`account-methods__method`} onClick={handleClick}>
            <div className={`account-methods__method-content ${states[clicked]}`}>
            <div  className='account-methods__method-info'>
              <UiIcon icon={method.card.brand}/>
            {`**** **** **** ${method.card.last4}`}
            </div>
            <div className='account-methods__method-exp'>
             {mm} / {method.card.exp_year}
            </div>
            </div>
            <div className={`account-methods__delete`}>
                <UiIcon  icon='fa-trash-can'/>
            </div>
          </div>
        }
        ) :
        (
          <UiLoader position='relative' height={500} />)
        }
      </div>
    </>
  );
};

export default AccountMethods;