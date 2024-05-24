import { useEffect, useState } from 'react';

export interface UserAgentContext {
    user_agent?: string;
    user_agent_data: {
      brands?: Array<{
        brand: string;
        version: string;
      }>;
      mobile: boolean;
      platform: string;
    } | null;
    public_ip?: string;
}

const useUserAgent = () => {
  const [userInformation, setUserInformation] = useState<UserAgentContext>({
    user_agent: '',
    user_agent_data: null,
    public_ip: '',
  });

  useEffect(() => {
    const handleLoad = async () => {
      // Get user_agent
      const user_agent = window.navigator.userAgent;

      // Check if the browser supports the 'getUserAgentData' API
      const nav: any = navigator;
      const user_agent_data = 'userAgentData' in nav ? nav.userAgentData : null;

      setUserInformation({ user_agent, user_agent_data });

      try {
        // Fetch IP address information from an IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const public_ip = data.ip;
          setUserInformation(prevState => ({ ...prevState, public_ip }));
        } else {
          console.error('Failed to fetch IP address information.');
        }
      } catch (error) {
        console.error('Error fetching IP address information:', error);
      }
    };

    // Call the handleLoad function immediately to ensure accurate data
    handleLoad();

    // Attach the 'load' event listener to the window
    window.addEventListener('load', handleLoad);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return userInformation;
};

export default useUserAgent;
