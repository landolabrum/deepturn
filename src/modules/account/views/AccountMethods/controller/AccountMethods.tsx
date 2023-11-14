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
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountMethods{
  open?: boolean;
  customerMethods?: any;
}
const AccountMethods: React.FC<any> = ({open, customerMethods}:IAccountMethods) => {
  const [loading, setLoading] = useState<any>(true);
  const [label, setLabel] = useState<any>('payment methods');
  const [methods, setMethods] = useState<IMethod[]>([]);
  const memberService = getService<IMemberService>("IMemberService");
  const user = useUser();

  const handleDelete = async (id: string) => {
    getAccountMethods();
  }
  const handleCreated = () => {
    getAccountMethods();
  }

  const getAccountMethods = async () => {
    setLoading(true);
    const methodsResponse = await memberService.getMethods();
    if (methodsResponse) {
      setMethods(methodsResponse?.data);
    }
    setLoading(false);
  }
  const handleLabel = () =>{
    if(user && methods.length ){
      let default_method:any = methods.find(m=> m.id == user?.default_source);
      if(default_method?.card){
        default_method = <div style={{display:'flex', alignItems:"center", gap: '16px'}}>
        <UiIcon icon={default_method.card.brand} /> {`**** **** **** ${default_method.card.last4}`}
        </div>
        setLabel(default_method);
      }
    }
  }
  useEffect(() => {

    handleLabel();
    !customerMethods && getAccountMethods();
    customerMethods && setMethods(customerMethods);
  }, [methods.length]);

  return (
    <>
      <style jsx>{styles}</style>
      <UiCollapse label={label} open={!loading || open || user?.default_source == undefined}>
      <div className='account-methods'>
          <AccountCreateMethod
            user={user}
            onSuccess={handleCreated}
          />
        {methods.length > 0 && <>
          <div className='account-methods__existing'>

            <div className='account-methods__list'>
              {Object.entries(methods).map(([key, method]) => {
                return <div className='account-methods__list-item' key={key} >
                  <AccountCurrentMethod
                    default_source={user?.default_source}
                    method={method}
                    onDeleteSuccess={handleDelete}
                    response={loading}
                  />
                </div>
              })}
            </div>
          </div></>}
        {loading == true && <UiLoader position='relative' height={500} />}
      </div>
      </UiCollapse>
    </>
  );
};

export default AccountMethods;