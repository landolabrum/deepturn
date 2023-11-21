import { useEffect, useState } from 'react';

const useUserAgent = () => {
  const [userAgentInfo, setUserAgentInfo] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navigator: any = window.navigator;
      const userAgent = navigator.userAgent;
      const userAgentData = navigator.userAgentData;

      // Combine userAgent and userAgentData into one object
      setUserAgentInfo({ userAgent, userAgentData });
    }
  }, []);

  return userAgentInfo;
};

export default useUserAgent;
