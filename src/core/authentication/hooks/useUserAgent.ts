import  { useEffect, useState } from 'react';

const useUserAgent = () => {
    const[userAgentData, setNavigatorAvailable]=useState<any>(null);
    useEffect(() => {
        const checkNavigator = () => {
          if (typeof window !== 'undefined' && window.navigator?.userAgent) {
            const navigator:any = window.navigator;
            setNavigatorAvailable(navigator?.userAgentData);
          }
        };
        checkNavigator();
      }, []);
  return userAgentData;
};

export default useUserAgent;

const postUserAgent = () => {
    
}