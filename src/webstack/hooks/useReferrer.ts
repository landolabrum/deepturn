import { useRouter } from 'next/router';
import React from 'react';

const useReferrer = () => {
    const { asPath } = useRouter();
    const origin =
    typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : '';
    const URL = `${origin}${asPath}`;
  return URL;
};

export default useReferrer;