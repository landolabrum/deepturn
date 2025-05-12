// Relative Path: ./AdminProductList.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerList.scss';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import useAdminCustomers from './hooks/useAdminCustomers';

const AdminCustomerList: React.FC<any> = ({ onSelect }: { onSelect: (props: string) => void }) => {
  
const {customers, refresh, hasMore}=useAdminCustomers()

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer-list'>
      <div className='d-flex s-w-9 justify-end s-4-bottom'>
        <div>
        <UiButton onClick={refresh} busy={!customers} traits={{afterIcon:"fa-rotate"}}>refresh</UiButton>
      </div>
        </div>
        <div className='admin-customer-list__table'>
          <AdapTable
            // page={1}
            variant="mini"
            // limit={5}
            // total={Number(Object(customers)?.length)}
            // setPage={console.log}
            // setLimit={console.log}
            options={{
              hideColumns: ['extras', 'id'],
              // hide:['header']
            }}

            loading={!Object(customers)?.length}
            data={customers}
            onRowClick={onSelect}
          />
          {hasMore && "next"}
        </div>
      </div>
    </>
  );
};

export default AdminCustomerList;

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