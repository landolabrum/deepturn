// import { getService } from '@webstack/common';
// import { useEffect, useState } from 'react';
// import IProspectService from '../IProspectService';

// const usePaymentIntentSecret = () => {
//     const prospectService = getService<IProspectService>("IProspectService");
//     const [clientSecret, setClientSecret] = useState();
//     const fetchClientSecret = async () => {
//         if(!clientSecret )return;
//         const response = await prospectService.getPaymentIntentSecret(clientSecret)
//         if (response?.client_secret) {
//             setClientSecret(response.client_secret);
//         } else {
//             console.error("Client secret not found in the response", response);
//         }
//     };
//     useEffect(() => {
//         fetchClientSecret();
//     },[ setClientSecret]);
//   return clientSecret;
// };

// export default usePaymentIntentSecret;