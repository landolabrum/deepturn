// Relative Path: ./AdminProductList.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerList.scss';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';

// Remember to create a sibling SCSS file with the same name as this component
interface ICustomer {
  id: string;
  object: string;
  address: IAddress;
  balance: number;
  created: number;
  currency: string;
  default_source: string;
  delinquent: boolean;
  description: string;
  discount?: {
    coupon: string | null;
    customer: string | null;
    end: number | null;
    id: string | null;
    invoice_item: string | null;
    promotion_code: string | null;
    start: number | null;
    subscription: string | null;
    type: string | null;
  };
  email: string | null;
  invoice_prefix: string | null;
  invoice_settings: {
    custom_fields: Array<{
      name: string;
      value: string | null;
    }> | null;
    footer: string | null;
  };
  livemode: boolean;
  metadata: Record<string, any> | null;
  name: string | null;
  next_invoice_sequence: number | null;
  phone: string | null;
  preferred_locales: string[] | null;
  shipping: IShipping | null;
  tax_exempt: string | null;
  test_clock: number | null;
}

type IAddress = {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
} | string

interface IShipping {
  address: IAddress | null;
  name: string | null;
  carrier: string | null;
  phone: string | null;
  tracking_number: string | null;
}

const AdminCustomerList: React.FC<any> = ({onRowClick}:any) => {
  const [customers, setCustomers]=useState<ICustomer | null>(null);
  const adminService = getService<IAdminService>('IAdminService');

  const hideColumns = ['extras','id'];

  const getCustomerList = async () => {
    let customerList = await adminService.listCustomers();
    if (customerList?.object === 'list') {
      customerList = customerList.data;
  
      // Use a for loop or reduce function to transform the customer data
      const transformedCustomerList = customerList.map((customer: ICustomer) => {

  
        // Create a new dictionary for each customer
        const extras = {
          ...customer.metadata,
          ...customer.invoice_settings,
          ...customer.shipping,
          description: customer.description,
          discount: customer.discount,
          currency: customer.currency,
          invoice_prefix:customer.invoice_prefix,
          next_invoice_sequence: customer.next_invoice_sequence,
        }
        return {
          customer: <AdaptTableCell cell='member' data={{
            id: customer.id,
            name: customer.name,
            email: customer.email,
          }}/>,
          id: customer.id,
          address:  <AdaptTableCell cell='address' data={
            customer?.address
            // address.trim()
          }/> || '',
          phone: customer.phone && phoneFormat(customer.phone),
          balance: customer.balance,
          created: <AdaptTableCell cell='date' data={customer.created}/>,
          default_source: customer.default_source && <UiIcon icon='fas-circle-check'/>,
          delinquent: customer.delinquent,
          tax_exempt: <AdaptTableCell cell='check' data={Boolean(customer.tax_exempt == 'exempt')}/>,
          clearance: <AdaptTableCell cell='id' data={customer?.metadata?.clearance}/>,
          extras:extras
        };
      });
  
      // Set the transformed customer list in state
      setCustomers(transformedCustomerList);
    }
  };
  
  
  
  useEffect(() => {
     getCustomerList();
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer-list'>
      <div className='admin-customer-list__table'>
      <AdapTable 
        options={{
          hideColumns:hideColumns,
          tableTitle:'customer list'
        }}
        loading={!Object(customers)?.length}
        data={customers}
        onRowClick={onRowClick}
        />
        </div>
      </div>
    </>
  );
};

export default AdminCustomerList;