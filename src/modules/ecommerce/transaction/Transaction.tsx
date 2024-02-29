// Relative Path: ./Transaction.tsx
import React, { useEffect, useState } from 'react';
import styles from './Transaction.scss';
import { useRouter } from 'next/router';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import CookieHelper from '@webstack/helpers/CookieHelper';
import { decryptString } from '@webstack/helpers/Encryption';

// Remember to create a sibling SCSS file with the same name as this component

const Transaction: React.FC = () => {
  const MemberService = getService<IMemberService>('IMemberService');
  const [transaction, setTransaction] = useState<any>();
  const loadTransaction=  ()=>{
    if(transaction)return;
    const hasTransaction = CookieHelper.getCookie('transaction-token');
    const decryptToken = async (token:string) => {
      if (token) {
          try {
              const response = await MemberService.decryptJWT({
                  token: token,
                  secret: 'secretKey',
                  algorithm: 'HS256'
              });
              if (response?.decoded) {
                  console.log('[ JWT DECODE (SUCCESS) ]', response.decoded);
                  setTransaction(response.decoded);
              }
          } catch (error: any) {
            setTransaction({ error: error?.detail?.detail });
              console.error('[ JWT DECODE (ERROR) ]', error?.detail?.detail);
          }
      }
  };
    if(hasTransaction){
      decryptToken(hasTransaction);
    }
  }
 

  useEffect(() => {
    loadTransaction()
  }, []);
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
          {transaction?.cart_items && Array(transaction?.cart_items).map(
            ([field, value]:any)=>{
              return <>
              {JSON.stringify(field)}

              </>
            })
          }
        </div>
      </div>
      {/* {JSON.stringify(transaction)} */}
    </>
  );
};

export default Transaction; 
// https://deepturn.com/transaction?
// payment_intent=pi_3OHDBJIodeKZRLDV3g9MUbUd
// &payment_intent_client_secret=pi_3OHDBJIodeKZRLDV3g9MUbUd_secret_GUGVOLfQ066THLmr6jaLqAiIZ
// &redirect_status=succeeded

// https://deepturn.com/transaction?token=2c587c208f9ff74596fca6b036fd36ea:23d3b32b0a1f50b2a1f2fef9c8a1cdb039368af7c033146269d9945889863c1ffbf701f46db3b0c0ec6bca8ac6c88b0c02090354cdfa7b7fe9aed7e44bef7a1096cb781e7cec6f2c5b2ef0c49eed6147f083f6f8219e7bf46ec4ac0ecc541427dcfa19cc6b2461b33759dae1b12ed88efa423ee692351c894a0759298c51e3b3943370b2f38a312c950fc357d50d847ccc54f4fe2dcbb2c9fcdfcc94bb06ecbf0a53e9e152543465bf1173a6b5a033c48b53351ad43a63a02e349e72d3c2fab0992d8a2a5aa35afad9ac5305e050a8083a3d9d799e755feae560b8482c57e194649f1d6f3d1a662806f6e44b860be3bca6db483707277f9babe0f0449136604e8bac8550f55d5ec42fa67648a42380ed8fdf0462b20807554b313d79e866be770f99719ae2f3e38a14874ccdcf5c7c8b725b2dcb7c79f12d2b87f72918004c44b7aa82aa34147f154621166af41fc1501d297b43519b26367004adaab130ee3c625ef80ecfdec1ba5362a909c0edbf1958a7b9da1e7cbd4a6071eeb0812e78754acb0b422c23d8633d2f8e62e1280456147b29e1c9e343212dfea5537a700ae653d019ebf9407cd940ad728d38b62a143e498e0c68602ed4c226e12c2613858cac0f78cb3f512c5490a5f1cb4229c1993e80f36eb4ac36e44f6d69f7eeac8f09bd7c997016f53ce50a1f4146a3d0deb4983fb9bb9f3a5cc68a47fcb9296e8d3a2f628c74e31481042ba55862e5a8d8f414b2f791b4ca1c03269bf1d03d6c18c5c68aea0df45e728c158f2258d851ed5a050a814bf20872f01d06bf6b422a06e8f22f986cfa6cf02e20706d7cc2d55331a6e10c749e420f2b56e921b0413b424d38c6511454653120329cfb5460113b9af61497677a55f49531891454954beaa9dc2b067b8fe78a33acb13ab9d3b10c23f41e127a871da4cd6ec8cd282b7da2b7696c01490f226201e60b0044ff932d65d0c2034e417706cb5526e953f4977f033bb94746c3ef371f2392cf9915c41b598f9e5f0d722c42c82710c54e5fe69aa698f9efc42f17a982b0c2cf3659e99d3dfa2299ca749bdc556b4acc0013306f00ce6f76ab74b33dde283303a5d1bb62568c8190228452d862f83486bd52cc95f0398cd5910c8438682dbd914875ab1256bdefd1bb62306023eaf5f14486c340d939a8d0d29d8dd65f283b2d8d5868116f1045f520e62e1b2e2fdd101ac9773bdb79d404612fbfb5a6a46371383001b77856b69e0de326b90b2dae0b645feb6eded8dd9cc919d578dffc9e1fc9536bd8b00338a9f684f4e32a39e5c7a0b9d1841c649da1096c6530501c61372a7ca9dd457e47dbd5e2898e8e2af192ac7658ed22c55e25dfcf6cf62dd3f041fa238ffb4280f26674fcc8713ebcfb64697c8411b3b2ac1320c00cf6c3271350862ee0f6f469599a7b9135e3f0e84697255a354b03