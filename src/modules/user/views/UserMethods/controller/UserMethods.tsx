// Relative Path: ./AccountMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserMethods.scss';
import ICustomerService, { SetupIntentSecretRequest } from '~/src/core/services/CustomerService/ICustomerService';
import { getService } from '@webstack/common';
import { IMethod } from '../../../model/IMethod';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UserCurrentMethod from '../views/UserCurrentMethod/UserCurrentMethod';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { useLoader } from '@webstack/components/Loader/Loader';
import UserCreateMethod from '../views/UserCreateMethod/controller/UserCreateMethod';
import UserContext from '~/src/models/UserContext';



interface IUserMethods {
  open?: boolean | 'opened';
  customerMethods?: any;
  user?: UserContext;
}
const UserMethods: React.FC<any> = ({ user, open, customerMethods }: IUserMethods) => {
  const [loader, setLoader]=useLoader();
  const [label, setLabel] = useState<any>('payment methods');
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [selectedUser, setUser] = useState<UserContext | undefined>();

  
  const CustomerService = getService<ICustomerService>("ICustomerService");
  

  const handleDelete = async (id: string) => {
    getAccountMethods();
  }
  // const handleCreated = () => {
  //   getAccountMethods();
  // }

  const getAccountMethods = async () => {
    const methodsResponse = await CustomerService.getMethods();
    // console.log(methodsResponse)
    if (methodsResponse) {
      setMethods(methodsResponse?.data);
    }
  }
  const handleLabel = () => {
    if (selectedUser && methods.length && !open) {
      let default_method: any = methods.find(m => m.id == selectedUser?.invoice_settings?.default_payment_method);
      if (default_method?.card) {
        default_method = <div style={{ display: 'flex', alignItems: "center", gap: '16px' }}>
          <UiIcon icon={default_method.card.brand} /> {`**** **** **** ${default_method.card.last4}`}
        </div>
        setLabel(default_method);
      }
    }
  }
  const signed_in_user = useUser();
  useEffect(() => {
    if(!user)setUser(signed_in_user);
    setLoader({active: true});

    
    handleLabel();
    if (!customerMethods) {
      getAccountMethods();
    } else {
      setMethods(customerMethods);
    }
    setLoader({ active: false });
  }, [user, selectedUser]);


  if (open) return (
    <>
      <style jsx>{styles}</style>
      <div className='user-methods'>
        {methods.length > 0 && <>
          <div className='user-methods__existing'>
            <div className='user-methods__existing--title'>
            current methods
            </div>
            <div className='user-methods__list'>
              {Object.entries(methods).map(([key, method]) => {
                return <div className='user-methods__list-item' key={key} >
                  <UserCurrentMethod
                    default_payment_method={selectedUser?.invoice_settings?.default_payment_method}
                    method={method}
                    onDeleteSuccess={handleDelete}
                    response={loader?.active}
                  />
                </div>
              })}
            </div>
          </div></>}
         <UserCreateMethod 
            success_url='/profile?vid=billing+info'
            onSuccess={getAccountMethods}
          />
      </div>
    </>
  );
  return (
    <>
      <style jsx>{styles}</style>
      <UiCollapse label={label} open={open || !loader.active || selectedUser?.invoice_settings?.default_payment_method == undefined}>
        <div className='user-methods'>
          {methods.length > 0 && <>
            <div className='user-methods__existing'>
              <div className='user-methods__existing--title'>
                current methods
              </div>
              <div className='user-methods__list'>
                {Object.entries(methods).map(([key, method]) => {
                  return <div className='user-methods__list-item' key={key} >
                    
                    <UserCurrentMethod
                      default_source={selectedUser?.invoice_settings?.default_payment_method}
                      method={method}
                      onDeleteSuccess={handleDelete}
                      response={loader.active}
                    />
                  </div>
                })}
              </div>
            </div></>}
           <div>
              <UserCreateMethod {...user}  onSuccess={getAccountMethods} />
            </div>
        </div>
      </UiCollapse>
    </>
  );
};

export default UserMethods;