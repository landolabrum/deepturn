import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useLoader } from '@webstack/components/Loader/Loader';


export default function useSignOut() {
  const {query, push} = useRouter();
  const MemberService = getService<IMemberService>('IMemberService');
  const [, setLoader] = useLoader();

  useEffect(() => {
    const logoutUser = async () => {
      setLoader({ active: true, body: 'Logging out...' });
      await MemberService.signOut();
      setLoader({ active: true, body: 'Successfully logged out!' });
      setTimeout(() => {
        push('/');
        setLoader({ active: false });
      }, 2000); // Display the message for 2 seconds before redirecting
    };

    if (query.function === 'signout') {
      logoutUser();
    }
  }, [query, MemberService, setLoader]);

  return <></>;
}
