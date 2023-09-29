// Relative Path: ./Transaction.tsx
import React, { useEffect, useState } from 'react';
import styles from './Transaction.scss';
import { useRouter } from 'next/router';
import { decryptString } from '@webstack/helpers/Encryption';

// Remember to create a sibling SCSS file with the same name as this component

const Transaction: React.FC = () => {
    const router = useRouter();
    const [transaction, setTransaction]=useState<any>(null);
    useEffect(() => {
        if(typeof router.query?.token == 'string' && transaction == null){
            const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
            const token = decryptString(router.query.token, ENCRYPTION_KEY)
            setTransaction(token)
        }
    }, [router]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='transaction'>
      <div className='transaction__header'>
      <div className='transaction__title'>
            {transaction?.total && "Success"}
      </div>
      </div>
      </div>
      {JSON.stringify(transaction)}
    </>
  );
};

export default Transaction; 