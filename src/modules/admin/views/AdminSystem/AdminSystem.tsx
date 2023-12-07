// Relative Path: ./AdminSystem.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminSystem.scss';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

// Remember to create a sibling SCSS file with the same name as this component

const AdminSystem: React.FC = () => {
    const [systemData, setSystemData]=useState<any>();
    const adminService = getService<IAdminService>('IAdminService');
    const fetchSystemData = async () =>{
        try{
            const systemResponse = await adminService.getSystemInfo();
            setSystemData(systemResponse)
        }catch(err:any){
            setSystemData(err);
        }
    };
    useEffect(() => {
        !systemData && fetchSystemData();
    }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-system'>
      <div className='admin-system__title'>admin system</div>
      <div className='admin-system__list'>
        {systemData && Object.entries(systemData).map(([key,val]:any)=>{
            return <div key={key} className='admin-system__list--item'>
                <div className='admin-system__list--item__key'>{keyStringConverter(key)}</div>
                <div className='admin-system__list--item__val'>{val}</div>
                </div>
        })}
      </div>
      </div>
    </>
  );
};

export default AdminSystem;