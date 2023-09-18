// Relative Path: ./AccountMethod.tsx
import React, { useCallback, useEffect, useState } from 'react';
import styles from './AccountMethods.scss';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { IMethod } from '../../../model/IMethod';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import AccountCreateMethod from '../components/AccountCreateMethod/AccountCreateMethod';
import AccountCurrentMethod from '../components/AccountCurrentMethod/AccountCurrentMethod';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';

// Remember to create a sibling SCSS file with the same name as this component

const AccountMethods: React.FC = () => {
  const [loading, setLoading] = useState<any>(true);
  const [label, setLabel] = useState<any>('payment methods');
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [open, setOpen] = useState<any>(methods.length == 0);
  const memberService = getService<IMemberService>("IMemberService");
  const user = useUser();

  const handleDelete = async (id: string) => {
    getAccountMethods();
  }
  const handleCreated = () => {
    getAccountMethods();
    setOpen(false);
  }

  const getAccountMethods = async () => {
    setLoading(true);
    const methodsResponse = await memberService.getMethods();
    if (methodsResponse) setMethods(methodsResponse?.data);
    setLoading(false);
  }
  const handleLabel = () =>{
    if(user ){
      return user.default_source;
    }
  }
  useEffect(() => {
    handleLabel();
    getAccountMethods();
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <UiCollapse label={label} open>
      <div className='account-methods'>
          <AccountCreateMethod
            open={open}
            onSuccess={handleCreated}
          />
        {methods.length > 0 && <>
          <div className='account-methods__existing'>
 
            <div className='account-methods__list'>
              {Object.entries(methods).map(([key, method]) => {
                return <div className='account-methods__list-item' key={key} >
                  <AccountCurrentMethod
                    default_source={user?.default_source}
                    method={method}
                    onDeleteSuccess={handleDelete}
                    response={loading}
                  />
                </div>
              })}
            </div>
          </div></>}
        {loading == true && <UiLoader position='relative' height={500} />}
      </div>
      </UiCollapse>
    </>
  );
};

export default AccountMethods;