import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getService } from '@webstack/common';
import ICustomerService from '~/src/core/services/CustomerService/ICustomerService';
import { useLoader } from '@webstack/components/Loader/Loader';


export default function AuthQuery() {
  const router = useRouter();
  const CustomerService = getService<ICustomerService>('ICustomerService');
  const [, setLoader] = useLoader();

  useEffect(() => {
    const logoutUser = async () => {
      setLoader({ active: true, body: 'Logging out...' });
      await CustomerService.signOut();
      setLoader({ active: true, body: 'Successfully logged out!' });
      setTimeout(() => {
        setLoader({ active: false });
        router.push('/');
      }, 2000); // Display the message for 2 seconds before redirecting
    };

    if (router.query.function === 'signout') {
      logoutUser();
    }
  }, [router, CustomerService, setLoader]);

  return <></>;
}
