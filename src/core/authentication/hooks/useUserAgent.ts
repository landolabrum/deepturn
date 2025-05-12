import { useEffect, useState } from 'react';

const useUserAgent = () => {
  const [userAgentInfo, setUserAgentInfo] = useState<any>({});

  useEffect(() => {
    const getUserAgentInfo = async () => {
      if (typeof window !== 'undefined') {
        const navigator: any = window.navigator;
        const user_agent = navigator.userAgent;
        const user_agent_data = navigator.userAgentData;
        
        const getIp = async () => {
          try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
          } catch (error) {
            console.error('Error fetching IP:', error);
            return null;
          }
        };

        const wan = await getIp();
        // Combine userAgent and userAgentData into one object
        setUserAgentInfo({ user_agent, user_agent_data, wan });
      }
    };

    getUserAgentInfo();
  }, []);

  return userAgentInfo;
};

export default useUserAgent;
