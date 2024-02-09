// Relative Path: ./AdminEarth.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminEarth.scss';
import UiEarth from '@webstack/components/Graphs/UiEarth/controller/EarthRenderer';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const AdminEarth: React.FC = () => {
    const [custLocations, setCustomers] = useState<any>();
    const [hasMore, setHasMore] = useState(false);
    const adminService = getService<IAdminService>('IAdminService');
    const formatCustomerAddresses = (customers: any) => {
        if (!customers) return;
    
        const custaddrs = customers.filter((customer: any) => customer.metadata['address.lat'])
            .map((customer: any) => {
                console.log('cus',customer)
                return {
                    html: customer.name,
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
        try {
            const response = await adminService.listCustomers();
            formatCustomerAddresses(response.data);
            setHasMore(response.has_more);
        } catch (e: any) {
            console.log('[ ADMIN EARTH GETMEMBERS ERROR ]', e)
        }
    }

    useEffect(() => {
        // if(!custLocations){
        getMembers();
        // }
    }, [setCustomers]);
    return (
        <>
            <style jsx>{styles}</style>
            {custLocations && <UiEarth points={custLocations} rotate={false} />}
        </>
    );
};

export default AdminEarth;