import { useEffect, useState } from 'react';

interface UserAgentData {
  brands: { brand: string; version: string }[];
  mobile: boolean;
}

interface NavigatorData {
  userAgent: string;
  platform: string;
  language: string;
  languages: readonly string[];
  cookieEnabled: boolean;
  brands?: { brand: string; version: string }[];
  mobile?: boolean;
}

interface ConnectionData {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
  carrier?: string;
}

interface DeviceData {
  memory: number | 0;
  hardwareConcurrency: number | 0;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
  window: {
    innerWidth: number;
    innerHeight: number;
  };
}

interface PermissionsData {
  [permissionName: string]: PermissionState;
}

interface UserData {
  navigator: NavigatorData;
  wan: string;
  lan: string;
  connection?: ConnectionData;
  device: DeviceData;
  permissions: PermissionsData;
}

const findLocalIp = (logInfo = true) => new Promise<string[]>((resolve, reject) => {
  if (typeof window.RTCPeerConnection === 'undefined') {
    return reject('WebRTC not supported by browser');
  }

  const pc = new RTCPeerConnection();
  const ips: string[] = [];

  pc.createDataChannel('');
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .catch(err => reject(err));

  pc.onicecandidate = event => {
    if (!event || !event.candidate) {
      // All ICE candidates have been sent.
      if (ips.length === 0) {
        return reject('WebRTC disabled or restricted by browser');
      }
      return resolve(ips);
    }

    const parts = event.candidate.candidate.split(' ');
    const ip = parts[4];

    if (!ips.includes(ip)) {
      ips.push(ip);
    }

    if (logInfo) {
      console.log('candidate:', parts[0].split(':')[1]);
      console.log('component:', ['rtp', 'rtpc'][parseInt(parts[1]) - 1]);
      console.log('protocol:', parts[2]);
      console.log('priority:', parts[3]);
      console.log('ip:', ip);
      console.log('port:', parts[5]);
      console.log('type:', parts[7]);

      if (parts.length > 8) {
        console.log('attributes:');
        for (let i = 8; i < parts.length; i += 2) {
          console.log(`> ${parts[i]}: ${parts[i + 1]}`);
        }
      }

      console.log();
    }
  };
});

const useDevice = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const collectData = async () => {
    const navigatorData: NavigatorData = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
    };

    // Check if userAgentData is available
    if ((navigator as any).userAgentData) {
      const { brands, mobile } = (navigator as any).userAgentData as UserAgentData;
      navigatorData.brands = brands;
      navigatorData.mobile = mobile;
    }

    let wan = '';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      wan = data.ip;
    } catch (error) {
      console.error('Error fetching public IP (WAN):', error);
    }

    let lan = 'Not connected to Wi-Fi, Ethernet, or cellular network';
    let connection: ConnectionData | undefined;

    try {
      const netInfo = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection || (navigator as any).network;
      if (netInfo) {
        const { effectiveType, downlink, rtt, saveData } = netInfo;
        connection = { effectiveType, downlink, rtt, saveData };

        if (effectiveType === 'cellular') {
          if (navigatorData.mobile) {
            connection.type = 'cellular';
            connection.carrier = 'Carrier info not available';  // Placeholder as browsers don't provide carrier info
          } else {
            connection.type = 'unknown';
          }
        } else if (effectiveType === 'wifi' || effectiveType === 'ethernet' || effectiveType === '2g' || effectiveType === '3g' || effectiveType === '4g') {
          connection.type = effectiveType;
          try {
            const ips = await findLocalIp(false);
            lan = ips[0] || lan;
          } catch (error) {
            console.error('Error fetching local IP (LAN):', error);
          }
        } else {
          connection.type = 'unknown';
        }
      }
    } catch (error) {
      console.error('Error determining connection type:', error);
      lan = 'Failed to determine connection type';
    }

    const deviceData: DeviceData = {
      memory: (navigator as any).deviceMemory || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      },
    };

    // Check browser permissions
    const permissions: PermissionsData = {};
    if (navigator.permissions) {
      try {
        const permissionNames = ['geolocation', 'notifications', 'camera', 'microphone', 'persistent-storage'];
        for (const name of permissionNames) {
          const permissionStatus = await navigator.permissions.query({ name } as any);
          permissions[name] = permissionStatus.state;
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    }

    setUserData({
      navigator: navigatorData,
      wan,
      lan,
      connection,
      device: deviceData,
      permissions,
    });
  };

  useEffect(() => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      collectData();
    } else {
      window.addEventListener('DOMContentLoaded', collectData);
      return () => window.removeEventListener('DOMContentLoaded', collectData);
    }
  }, []);

  // console.log("[ userData ]", userData);
  return userData;
};

export default useDevice;
