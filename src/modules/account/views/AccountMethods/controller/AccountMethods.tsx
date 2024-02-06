// Relative Path: ./AccountMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountMethods.scss';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import { IMethod } from '../../../model/IMethod';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import AccountCurrentMethod from '../components/AccountCurrentMethod/AccountCurrentMethod';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { useLoader } from '@webstack/components/Loader/Loader';
import StripePaymentForm from '../components/StripePaymentForm/StripePaymentForm';


interface IAccountMethods {
  open?: boolean | 'opened';
  customerMethods?: any;
}
const AccountMethods: React.FC<any> = ({ open, customerMethods }: IAccountMethods) => {
  const [loader, setLoader]=useLoader();
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
    // console.log(methodsResponse)
    if (methodsResponse) {
      setMethods(methodsResponse?.data);
    }
  }
  const handleLabel = () => {
    if (user && methods.length && !open) {
      let default_method: any = methods.find(m => m.id == user?.invoice_settings?.default_payment_method);
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
    setLoader({active: true});

    fetchClientSecret();
    handleLabel();
    if (!customerMethods) {
      getAccountMethods();
    } else {
      setMethods(customerMethods);
    }
    setLoader({ active: false });
  }, []);


  if (open) return (
    <>
      <style jsx>{styles}</style>
      <div className='account-methods'>
        {methods.length > 0 && <>
          <div className='account-methods__existing'>
            <div className='account-methods__existing--title'>
            current methods
            </div>
            <div className='account-methods__list'>
              {Object.entries(methods).map(([key, method]) => {
                return <div className='account-methods__list-item' key={key} >
                  <AccountCurrentMethod
                    default_payment_method={user?.invoice_settings?.default_payment_method}
                    method={method}
                    onDeleteSuccess={handleDelete}
                    response={loader?.active}
                  />
                </div>
              })}
            </div>
          </div></>}
          {clientSecret && <StripePaymentForm 
            clientSecret={clientSecret} 
            onSuccess={getAccountMethods}
          />}
      </div>
    </>
  );
  return (
    <>
      <style jsx>{styles}</style>
      <h1>{clientSecret}</h1>

      <UiCollapse label={label} open={open || !loader.active || user?.invoice_settings?.default_payment_method == undefined}>
        <div className='account-methods'>
          {methods.length > 0 && <>
            <div className='account-methods__existing'>
              current methods
              <div className='account-methods__list'>
                {Object.entries(methods).map(([key, method]) => {
                  return <div className='account-methods__list-item' key={key} >
                    
                    <AccountCurrentMethod
                      default_source={user?.invoice_settings?.default_payment_method}
                      method={method}
                      onDeleteSuccess={handleDelete}
                      response={loader.active}
                    />
                  </div>
                })}
              </div>
            </div></>}
            {clientSecret && <div>
              <StripePaymentForm clientSecret={clientSecret} onSuccess={getAccountMethods} />
            </div>}
        </div>
      </UiCollapse>
    </>
  );
};

export default AccountMethods;