import { useEffect, useState } from 'react';

const useUserAgent = () => {
  const [userAgentInfo, setUserAgentInfo] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navigator: any = window.navigator;
      const user_agent = navigator.userAgent;
      const user_agent_data = navigator.userAgentData;

      // Combine userAgent and userAgentData into one object
      setUserAgentInfo({ user_agent, user_agent_data });
    }
  }, []);

  return userAgentInfo;
};

export default useUserAgent;
