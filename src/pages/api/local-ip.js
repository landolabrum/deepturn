// pages/api/local-ip.js

export default async function handler(req, res) {
    try {
      // Create a temporary RTCPeerConnection object
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  
      // Create a dummy data channel
      await pc.createDataChannel('');
  
      // Get the local IP addresses from the RTCSessionDescription
      const sessionDescription = await pc.createOffer();
      const localIPRegex = /\d+\.\d+\.\d+\.\d+/;
      const localIPMatch = sessionDescription.sdp.match(localIPRegex);
  
      if (localIPMatch) {
        const [localIP] = localIPMatch;
        res.status(200).json({ ip: localIP });
      } else {
        throw new Error('Local IP address not found.');
      }
    } catch (error) {
      console.error('Error getting local IP address:', error);
      res.status(500).json({ error: 'Failed to get local IP address.' });
    }
  }
  