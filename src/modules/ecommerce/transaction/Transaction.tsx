// Relative Path: ./Transaction.tsx
import React, { useEffect, useState } from 'react';
import styles from './Transaction.scss';
import { useRouter } from 'next/router';
import { decryptString } from '@webstack/helpers/Encryption';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';

// Remember to create a sibling SCSS file with the same name as this component

const Transaction: React.FC = () => {
  const router = useRouter();
  const memberService = getService<IMemberService>('IMemberService');
  const [transaction, setTransaction] = useState<any>(null);
  const loadPaymentIntent=async ()=>{
    const query:any = router?.query;
    if(!query)return;
    if(query?.setup_intent_client_secret){
      const setup_intent = await memberService.getSetupIntent(query.setup_intent_client_secret);
      if(setup_intent)setTransaction(setup_intent);
    }
  }
  useEffect(() => {
    loadPaymentIntent();
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
// https://deepturn.com/transaction?
// payment_intent=pi_3OHDBJIodeKZRLDV3g9MUbUd
// &payment_intent_client_secret=pi_3OHDBJIodeKZRLDV3g9MUbUd_secret_GUGVOLfQ066THLmr6jaLqAiIZ
// &redirect_status=succeeded