// Relative Path: ./AdminEarth.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminEarth.scss';
import UiEarth from '@webstack/components/Graphs/UiEarth/controller/EarthRenderer';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import AdminCustomerDetails from '../AdminCustomers/views/AdminCustomerDetail/controller/AdminCustomerDetail';

// Remember to create a sibling SCSS file with the same name as this component

const AdminEarth: React.FC = () => {
    const {openModal}=useModal();
    const [custLocations, setCustomers] = useState<any>();
    const [hasMore, setHasMore] = useState(false);
    const adminService = getService<IAdminService>('IAdminService');
    const formatCustomerAddresses = (customers: any) => {
        if (!customers) return;
        const custaddrs = customers.filter((customer: any) => customer.metadata['address.lat'])
            .map((customer: any) => {
                const addr = customer.address;
                return {
                    html: `
                    <div class='globe-html--title'>${customer?.name}</div>${
                        addr && `<div>${addr?.line1}</div>
                        <div>${addr?.city}, ${addr?.state}, ${addr?.postal_code}</div>` || ''
                    }`,
                    id: customer.id,
                    // address: customer.address,
                    lat: Number(customer.metadata['address.lat']),
                    lng: Number(customer.metadata['address.lng']),
                    alt: 0
                }
            })
        setCustomers(custaddrs);
    }
    const getMembers = async () => {
        if(custLocations)return;
        try {
            const response = await adminService.listCustomers();
            formatCustomerAddresses(response.data);
            setHasMore(response.has_more);
        } catch (e: any) {
            console.log('[ ADMIN EARTH GETMEMBERS ERROR ]', e)
        }
    }
    const onPointClick = (id?: string)=>{
        console.log('[ onPointClick ]', id)
           openModal({
            variant:'popup',
            // title:'ji',
            children:<AdminCustomerDetails id={id}/>
        });
    }
    useEffect(() => {
        getMembers();
    }, [setCustomers]);
    return (
        <>
            <style jsx>{styles}</style>
            {/* {custLocations && */}
             <UiEarth 
              points={custLocations}
              rotate={false}
              onPointClick={onPointClick}
            />
        </>
    );
};

export default AdminEarth;