import { useEffect, useState } from 'react';

const useUserAgent = () => {
  const [userInformation, setUserInformation] = useState<any>({
    user_agent: '',
    user_agent_data: null,
    public_ip: '',
  });

  useEffect(() => {
    const handleLoad = async () => {
      // Get user_agent
      const user_agent = window.navigator.userAgent;

      // Check if the browser supports the 'getUserAgentData' API
      const nav:any = navigator
      const user_agent_data =
        'userAgentData' in nav ? nav.userAgentData : null;

      setUserInformation({ user_agent, user_agent_data });

      try {
        // Fetch IP address information from an IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const public_ip = data.ip;
          setUserInformation((prevState:any) => ({ ...prevState, public_ip }));
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
//   console.log("[ USER INFOR ]", userInformation)
  return userInformation;
};

export default useUserAgent;


