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

// Remember to create a sibling SCSS file with the same name as this component

const AccountMethods: React.FC = () => {
  const [loading, setLoading] = useState<boolean | string>(true);
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [deleteResponse, setDeleteResponse] = useState<any>('');

  const memberService = getService<IMemberService>("IMemberService");
  const user = useUser();

  const handleDelete = async (id: string) => {
    setLoading('deleting payment method');
    const runDelete = await memberService.deleteMethod(id)
    setDeleteResponse(
      runDelete.message ? runDelete.message : `*${runDelete.detail.split('on Stripe')[0]}`
    );
    getAccountMethods();
    setLoading(false);
  }

  const getAccountMethods = async () => {
    const methodsResponse = await memberService.getMethods();
    if (methodsResponse) setMethods(methodsResponse?.data);
    setLoading(false);
  }
  useEffect(() => {
    getAccountMethods();
  }, []);


  return (
    <>
      <style jsx>{styles}</style>
      <div className='account-methods'>
        <AccountCreateMethod
          open={methods.length == 0}
          loading={loading == true}
          // onSubmit={createMethod}
        />
        {methods.length > 0 && <>
          <div className='account-methods__header'>
            <div className='account-methods__title'>
              payment methods
            </div>
          </div>
          <div className='account-methods__existing'>
            {Object.entries(methods).map(([key, method]) => {
              return <div className='account-methods__method-container' key={key} >
                <AccountCurrentMethod method={method} onDelete={handleDelete} response={deleteResponse} />
              </div>
            })}
          </div></>}
        {loading == true && <UiLoader position='relative' height={500} />}
      </div>
    </>
  );
};

export default AccountMethods;