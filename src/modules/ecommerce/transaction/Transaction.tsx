// Relative Path: ./Transaction.tsx
import React, { useEffect, useState } from 'react';
import styles from './Transaction.scss';
import { useRouter } from 'next/router';
import { decryptString } from '@webstack/helpers/Encryption';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';

// Remember to create a sibling SCSS file with the same name as this component

const Transaction: React.FC = () => {
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  useEffect(() => {
    if (typeof router.query?.token == 'string' && transaction == null) {
      const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
      let token:any = decryptString(router.query.token, ENCRYPTION_KEY);
      if(token?.line_items){
        token?.line_items.forEach((line:any, index: number) => {
          console.log("[ LINE ]: ", line, index)
          token.line_items[index] = {
            name: line.name,

          }
        });
        console.log("[ LINE_ITEMS ]: ", token.line_items)

      }
      setTransaction(token)
    }
  }, [router?.query]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='transaction'>
        <div className='transaction__header'>
          <div className='transaction__title'>
            {transaction?.total && "Success"}
          </div>
        </div>
        <div className='transaction__content'>
          {/* {transaction?.line_items && Array(transaction?.line_items).map(
            ([field, value]:any)=>{
              return field.name
            })
          } */}
        </div>
      </div>
      {JSON.stringify(transaction)}
    </>
  );
};

export default Transaction; 