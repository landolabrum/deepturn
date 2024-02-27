// Relative Path: ./AccountMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserMethods.scss';
import ICustomerService from '~/src/core/services/CustomerService/ICustomerService';
import { getService } from '@webstack/common';
import { IMethod } from '../../../model/IMethod';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UserCurrentMethod from '../views/UserCurrentMethod/UserCurrentMethod';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { useLoader } from '@webstack/components/Loader/Loader';
import UserCreateMethod from '../views/UserCreateMethod/controller/UserCreateMethod';
import UserContext from '~/src/models/UserContext';
import UserSelectMethod from '../views/UserSelectMethod/UserSelectMethod';



interface IUserMethods {
  open?: boolean | 'opened';
  customerMethods?: any;
  user?: UserContext;
  selected?: string;
  onSelect?: (id: string) => void;
}
const UserMethods: React.FC<any> = ({ user, open, customerMethods, selected, onSelect }: IUserMethods) => {
  const [loader, setLoader] = useLoader();
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

  const getAccountMethods = async (e?:any) => {
    const methodsResponse = await CustomerService.getMethods();
    if (methodsResponse) {
      setMethods(methodsResponse?.data);
      setUser(signed_in_user);
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
    if (!user) setUser(signed_in_user);
    setLoader({ active: true });


    handleLabel();
    if (!customerMethods) {
      getAccountMethods();
    } else {
      setMethods(customerMethods);
    }
    setLoader({ active: false });
  }, [setUser]);


  // if (open) return (
  //   <>
  //     <style jsx>{styles}</style>
  //     <div className='user-methods'>
  //       {methods.length > 0 && <>
  //         <div className='user-methods__existing'>
  //           <div className='user-methods__existing--title'>
  //             current methods
  //           </div>
  //           <div className='user-methods__list'>
  //             {Object.entries(methods).map(([key, method]) => {
  //               return <div className='user-methods__list-item' key={key} >
  //                 <UserCurrentMethod
  //                   default_payment_method={selectedUser?.invoice_settings?.default_payment_method}
  //                   method={method}
  //                   onDeleteSuccess={handleDelete}
  //                   response={loader?.active}
  //                   selected={selected}
  //                   onSelect={onSelect}
  //                 />
  //                 {selected &&
  //                   <div className='user-methods__select'>
  //                     <UiIcon icon={"fa-check"} />
  //                   </div>
  //                 }
  //               </div>
  //             })}
  //           </div>
  //         </div></>}
  //       <UserCreateMethod
  //         success_url='/profile?vid=billing+info'
  //         onSuccess={getAccountMethods}
  //       />
  //     </div>
  //   </>
  // );
  return (
    <>
      <style jsx>{styles}</style>
      <UiCollapse label={label} open={open || !loader.active || selectedUser?.invoice_settings?.default_payment_method == undefined}>
        <div className='user-methods'>
          {methods.length > 0 &&
            <div className='user-methods__existing'>
              <div className='user-methods__existing--title'>
                current methods
              </div>
              <div className='user-methods__list'>
             {selected &&  <UserCurrentMethod
                      user={selectedUser}
                      methods={methods}
                      onDeleteSuccess={handleDelete}
                      response={loader.active}
                    />
              }
              {/* {selected && <UserSelectMethod user={selectedUser} methods={methods}/>} */}
              </div>
            </div>
           }
          <div>
            <UserCreateMethod user={selectedUser} onSuccess={getAccountMethods} />
          </div>
        </div>
      </UiCollapse>
    </>
  );
};

export default UserMethods;