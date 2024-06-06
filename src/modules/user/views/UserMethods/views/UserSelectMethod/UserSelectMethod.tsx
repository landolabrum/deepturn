// Relative Path: ./UserSelectMethod.tsx
import React, { useEffect } from 'react';
import styles from './UserSelectMethod.scss';
import IUser from '~/src/models/UserContext';
import { IMethod } from '~/src/modules/user/model/IMethod';

// Remember to create a sibling SCSS file with the same name as this component
interface IUserSelectMethods{
    user?:IUser;
    methods:IMethod[]
}
const UserSelectMethod: React.FC<IUserSelectMethods> = ({user, methods}:IUserSelectMethods) => {
    const findDefaultMethod = () =>{
        if(!user || !methods)return;
        const methodIds = methods.map((m,v)=>(m.id));
        const defaults = [user?.invoice_settings?.default_payment_method, user?.default_source];
        const hasDefault = defaults.filter(d => d !== null);
        if(hasDefault?.length){
            console.log(hasDefault)
        }
        // console.log('methodIds: ', user?.default_source, user?.invoice_settings)
        // console.log('methodIds: ', methodIds)
    }
    
    useEffect(() => {
        findDefaultMethod();
    }, [user]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='user-select-method'>
      <div className='user-select-method__list'>
        {methods && Object.entries(methods).map((m,v)=>{
            return JSON.stringify(m)
        })}
      </div>
      </div>
    </>
  );
};

export default UserSelectMethod;