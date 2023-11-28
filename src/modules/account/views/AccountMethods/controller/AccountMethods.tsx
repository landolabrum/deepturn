// Relative Path: ./AccountMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountMethods.scss';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import { IMethod } from '../../../model/IMethod';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import AccountCreateMethod from '../components/AccountCreateMethod/AccountCreateMethod';
import AccountCurrentMethod from '../components/AccountCurrentMethod/AccountCurrentMethod';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLoader } from '@webstack/components/Loader/Loader';
const appearance = {
  theme: 'night' as 'stripe',
  variables: {
    colorPrimary: '#1e88e5',
    colorBackground: '#262626',
    colorText: '#e0e0e0',
  },
};
interface IAccountMethods {
  open?: boolean | 'opened';
  customerMethods?: any;
}
const AccountMethods: React.FC<any> = ({ open, customerMethods }: IAccountMethods) => {
  const [loader, setLoader]=useLoader();
  setLoader({active: true});
  const [label, setLabel] = useState<any>('payment methods');
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [clientSecret, setClientSecret] = useState(undefined);

  const memberService = getService<IMemberService>("IMemberService");
  const user = useUser();

  const handleDelete = async (id: string) => {
    getAccountMethods();
  }
  const handleCreated = () => {
    getAccountMethods();
  }

  const getAccountMethods = async () => {
    const methodsResponse = await memberService.getMethods();
    if (methodsResponse) {
      setMethods(methodsResponse?.data);
    }
  }
  const handleLabel = () => {
    if (user && methods.length) {
      let default_method: any = methods.find(m => m.id == user?.default_source);
      if (default_method?.card) {
        default_method = <div style={{ display: 'flex', alignItems: "center", gap: '16px' }}>
          <UiIcon icon={default_method.card.brand} /> {`**** **** **** ${default_method.card.last4}`}
        </div>
        setLabel(default_method);
      }
    }
  }
  const fetchClientSecret = async () => {
    if(clientSecret)return;
    const response = await memberService.createPaymentIntent();
    if (response?.client_secret) {
      setClientSecret(response.client_secret);
    } else {
      console.error("Client secret not found in the response", response);
    }
  };

  useEffect(() => {
    fetchClientSecret();
    handleLabel();
    !customerMethods && getAccountMethods();
    customerMethods && setMethods(customerMethods);
    setTimeout(() => {
      setLoader({active: false});
    }, 2000);
  }, []);

  if (open) return (
    <>
      <style jsx>{styles}</style>
      <div className='account-methods'>

        {methods.length > 0 && <>
          <div className='account-methods__existing'>
            <div className='account-methods__list'>
              {Object.entries(methods).map(([key, method]) => {
                return <div className='account-methods__list-item' key={key} >
                  <AccountCurrentMethod
                    default_source={user?.default_source}
                    method={method}
                    onDeleteSuccess={handleDelete}
                    response={loader?.active}
                  />
                </div>
              })}
            </div>
          </div></>}
        {clientSecret && <Elements
          stripe={loadStripe('pk_live_qBiVh0MkAYVU7o3oVmP1Tzg900DLvxesSw')}
          options={{ clientSecret, appearance }}
        >
          <AccountCreateMethod
            user={user}
            onSuccess={handleCreated}
          />
        </Elements>}

      </div>
    </>
  );
  return (
    <>
      <style jsx>{styles}</style>
      <UiCollapse label={label} open={open || !loader.active || user?.default_source == undefined}>
        <div className='account-methods'>
          {methods.length > 0 && <>
            <div className='account-methods__existing'>
              current methods
              <div className='account-methods__list'>
                {Object.entries(methods).map(([key, method]) => {
                  return <div className='account-methods__list-item' key={key} >
                    <AccountCurrentMethod
                      default_source={user?.default_source}
                      method={method}
                      onDeleteSuccess={handleDelete}
                      response={loader.active}
                    />
                  </div>
                })}
              </div>
            </div></>}
          <AccountCreateMethod
            user={user}
            onSuccess={handleCreated}
          />
        </div>
      </UiCollapse>
    </>
  );
};

export default AccountMethods;