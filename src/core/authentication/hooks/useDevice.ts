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
const fetchWAN = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch (err) {
    console.error('Error fetching WAN IP:', err);
    return '';
  }
};

const getNavigatorData = (): NavigatorData => {
  const { userAgent, platform, language, languages, cookieEnabled } = navigator;
  const data: NavigatorData = { userAgent, platform, language, languages, cookieEnabled };

  if ('userAgentData' in navigator) {
    const { brands, mobile } = navigator.userAgentData as UserAgentData;
    Object.assign(data, { brands, mobile });
  }

  return data;
};

const getConnectionData = async (navigatorData: NavigatorData): Promise<{ connection?: ConnectionData; lan: string }> => {
  let lan = 'Not connected to Wi-Fi, Ethernet, or cellular network';
  const netInfo = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (!netInfo) return { lan, connection: undefined };

  const { effectiveType, downlink, rtt, saveData } = netInfo;
  const connection: ConnectionData = { effectiveType, downlink, rtt, saveData, type: 'unknown' };

  if (effectiveType === 'cellular') {
    connection.type = navigatorData.mobile ? 'cellular' : 'unknown';
    connection.carrier = 'Carrier info not available';
  } else if (['wifi', 'ethernet', '2g', '3g', '4g'].includes(effectiveType)) {
    connection.type = effectiveType;
    try {
      const ips = await findLocalIp(false);
      lan = ips[0] || lan;
    } catch (err) {
      console.error('Error fetching LAN IP:', err);
    }
  }

  return { connection, lan };
};

const getDeviceSpecs = (): DeviceData => ({
  memory: (navigator as any).deviceMemory || 0,
  hardwareConcurrency: navigator.hardwareConcurrency || 0,
  screen: {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
  },
  window: {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  },
});

const getPermissions = async (): Promise<PermissionsData> => {
  const permissions: PermissionsData = {};
  if (!navigator.permissions) return permissions;

  try {
    const names = ['geolocation', 'notifications', 'camera', 'microphone', 'persistent-storage'];
    for (const name of names) {
      const status = await navigator.permissions.query({ name } as any);
      permissions[name] = status.state;
    }
  } catch (err) {
    console.error('Error fetching permissions:', err);
  }

  return permissions;
};

const useDevice = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const collectData = async () => {
      const navigatorData = getNavigatorData();
      const wan = await fetchWAN();
      const { connection, lan } = await getConnectionData(navigatorData);
      const device = getDeviceSpecs();
      const permissions = await getPermissions();

      setUserData({ navigator: navigatorData, wan, lan, connection, device, permissions });
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      collectData();
    } else {
      window.addEventListener('DOMContentLoaded', collectData);
      return () => window.removeEventListener('DOMContentLoaded', collectData);
    }
  }, []);

  return userData;
};

export default useDevice;
