// Relative Path: ./AccountMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountMethods.scss';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import UiLoader from '@webstack/components/UiLoader/UiLoader';

// Remember to create a sibling SCSS file with the same name as this component

const AccountMethods: React.FC = () => {
  const [methods, setMethods] = useState<object[]>([]);
  const memberService = getService<IMemberService>("IMemberService");
  const fetchCustomerMethods = async () => {
    const methodsResponse = await memberService.getCustomerMethods();
    if (methodsResponse) setMethods(methodsResponse?.data);
  }


  useEffect(() => {
    fetchCustomerMethods();
  }, [setMethods]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='account-methods'>
        {methods.length ? Object.entries(methods).map(([key, method]) => {
          return <p key={key}>
            {JSON.stringify(Object.keys(method))}<hr />
            {JSON.stringify(method.object)}
          </p>
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