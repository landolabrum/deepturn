// Relative Path: ./AdminProductList.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerList.scss';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import environment from '~/src/core/environment';
import { ICustomer } from '~/src/models/CustomerContext';
import { getUserClearance, useClearance } from '~/src/core/authentication/hooks/useUser';
import canViewCustomer from '../../functions/canViewCustomer';
import keyStringConverter from '@webstack/helpers/keyStringConverter';


const AdminCustomerList: React.FC<any> = ({ onSelect }: { onSelect: (props: string) => void }) => {
  const [customers, setCustomers] = useState<ICustomer | undefined>();

  const [hasMore, setHasMore] = useState(false);
  const adminService = getService<IAdminService>('IAdminService');

  const hideColumns = ['extras', 'id'];
  const level = useClearance();
  
  const getCustomerList = async () => {
    let customerList = await adminService.listCustomers();
    if (customerList?.object === 'list') {
      setHasMore(customerList.has_more)
      customerList = customerList.data;

      // Use a for loop or reduce function to transform the customer data
      const transformedCustomerList = customerList.map((customer: ICustomer) => {
        // if(level >= 10 )


        const canViwCustomer = canViewCustomer(customer, level);
        // Create a new dictionary for each customer
        const extras = {
          ...customer.metadata,
          ...customer.invoice_settings,
          ...customer.shipping,
          description: customer.description,
          discount: customer.discount,
          currency: customer.currency,
          invoice_prefix: customer.invoice_prefix,
          next_invoice_sequence: customer.next_invoice_sequence,
        }
        if (canViwCustomer) return {
          customer: <AdaptTableCell cell='member' data={{
            id: customer.id,
            name: customer.name,
            email: customer.email,
          }} />,
          id: customer.id,
          name: customer.name,
          balance: customer.balance,
          created: <AdaptTableCell cell='date' data={customer.created} />,
          default_source: <AdaptTableCell cell='check' data={Boolean(customer.default_source)} />,
          // delinquent: customer.delinquent,
          tax_exempt: <AdaptTableCell cell='check' data={Boolean(customer.tax_exempt == 'exempt')} />,
          clearance: <AdaptTableCell cell='id' data={keyStringConverter(getUserClearance(customer?.metadata?.user?.clearance)?.user.type,{textTransform:"capitalize"})} />,
          extras: extras,
          request: customer.metadata && <AdaptTableCell cell='check' data={Boolean(Object.entries(customer.metadata).find((f: any) => String(f).includes(String(environment.merchant.mid))))} />,
        };
      });

      // Set the transformed customer list in state
      setCustomers(transformedCustomerList);
    }
  };
  // const getLocalIPs = (callback) => {
  //   const ipDuplicates = {};
  
  //   // Compatibility for different browsers
  //   const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  //   if (!RTCPeerConnection) {
  //     const iframe = document.createElement('iframe');
  //     iframe.style.display = 'none';
  //     document.body.appendChild(iframe);
  //     const win = iframe.contentWindow;
  //     window.RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
  //   }
  
  //   const pc = new RTCPeerConnection({
  //     iceServers: []
  //   });
  
  //   const handleCandidate = (candidate) => {
  //     console.log('ICE Candidate:', candidate); // Log the entire candidate for debugging
  //     // Match IP address
  //     const ipRegex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/; // Updated regex to be simpler and more specific
  //     const candi = ipRegex.exec(candidate);
  //     console.log({ candi });
  //     if (candi) {
  //       const ipAddress = candi[1];
  
  //       // Remove duplicates
  //       if (!ipDuplicates[ipAddress]) {
  //         callback(ipAddress);
  //       }
  //       ipDuplicates[ipAddress] = true;
  //     }
  //   };
  
    // Create a bogus data channel
  //   pc.createDataChannel('');
  
  //   // Create an offer
  //   pc.createOffer()
  //     .then((offer) => pc.setLocalDescription(offer))
  //     .catch((error) => console.error('Error creating offer:', error));
  
  //   // Listen for candidate events
  //   pc.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       console.log({ e: event.candidate });
  //       handleCandidate(event.candidate.candidate);
  //     }
  //   };
  // };
  
  // // Usage:
  // useEffect(() => {
  //   getLocalIPs((ip) => {
  //     console.log('Local IP address:', ip);
  //   });
  //   if (!customers) getCustomerList();
  // }, [setCustomers]);
  
  useEffect(() => {
    if (!customers) getCustomerList();
  }, [setCustomers]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer-list'>
        <div className='admin-customer-list__table'>
          <AdapTable
            // page={1}
            // limit={5}
            // total={Number(Object(customers)?.length)}
            // setPage={console.log}
            // setLimit={console.log}
            options={{
              hideColumns: hideColumns,
              // hide:['header']
            }}

            loading={!Object(customers)?.length}
            data={customers}
            onRowClick={onSelect}
          />
        </div>
      </div>
    </>
  );
};

export default AdminCustomerList;