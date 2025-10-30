import React, { useState, useEffect, useCallback } from 'react';
import styles from './Surveillance.scss';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { getService } from '@webstack/common';
import IHomeService from '~/src/core/services/HomeService/IHomeService';
import SurveillanceDetails from '../views/SurveillanceDetails/SurveillanceDetails';
import { useRouter } from 'next/router';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import ToggleSwitch from '@webstack/components/UiForm/components/UiToggle/UiToggle';
import useLayout from '@webstack/layouts/default/hooks/useLayout';

interface ICameraInfo {
  apartalarmParm: { heightY: string; longX: string; startX: string; startY: string; type: string };
  audioParm: { sampleRate: string };
  basicInfo: { firmware: string; hardware: string; mac: string; model: string; type: string; wifidb: string };
  channelResquestResult: { audio: string; video: string };
  recordType: { type: string };
  sdParm: { capacity: string; detail: string; free: string; status: string };
  settingParm: { logSd: string; logUdisk: string; nightVision: string; osd: string; stateVision: string; telnet: string; tz: string };
  uDiskParm: { capacity: string; free: string; status: string };
  videoParm: { bitRate: string; fps: string; horizontalFlip: string; logo: string; resolution: string; time: string; type: string; verticalFlip: string };
}

interface ICamera {
  audio: boolean;
  camera_info: ICameraInfo | null;
  connected: boolean;
  dtls: number;
  enabled: boolean;
  firmware_ver: string;
  hls_url: string;
  img_time: number | null;
  img_url: string | null;
  ip: string;
  is_2k: boolean;
  is_battery: boolean;
  mac: string;
  model_name: string;
  motion: boolean;
  motion_ts: number;
  name_uri: string;
  nickname: string;
  on_demand: boolean;
  p2p_type: number;
  parent_dtls: number;
  parent_mac: string;
  product_model: string;
  record: boolean;
  req_bitrate: number;
  req_frame_size: number;
  rtmp_url: string;
  rtsp_fw: boolean;
  rtsp_fw_enabled: boolean;
  rtsp_url?: string;
  snapshot_url: string;
  start_time: number;
  status: number;
  stream_auth: boolean;
  substream: boolean;
  thumbnail: string;
  thumbnail_url: string;
  timezone_name: string;
  webrtc: boolean;
  webrtc_url: string;
}

interface ISurveillanceCam {
  available: number;
  cameras: Record<string, ICamera>;
  enabled: number;
  total: number;
}

const Surveillance: React.FC = () => {
  const { layout,setLayout } = useLayout();
  const { query, push, pathname } = useRouter();
  const queryId = query?.id;
  const homeService = getService<IHomeService>('IHomeService');
  const [camData, setCamData] = useState<any | null>(null);
  const [main, setMain] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<boolean>(true);
  const handleMain = (id: string) => {
    const camName = id.toLowerCase();
    // console.log(camData?.cameras[camName]);
    if (main == undefined || id !== main) {
      // push({ pathname: `${pathname}`, query: { ...query, id: camName } }, undefined, { shallow: true });
      return setMain(camData?.cameras[camName]);
    } else {
      return setMain(undefined);

    }
    // if (id !== main) push({ pathname: `${pathname}`, query: { ...query, id: camName } }, undefined, { shallow: true });

  };
  const handleMode = (e: any) => {
    setMode(e.target.value);
  }
  const getCameras = useCallback(async () => {
    if (camData) return;
    try {
      const response: any = await homeService.wbListCameras();
      setCamData(response);
      // console.log("[ SURVEILLANCE ]", response);
    } catch (error) {
      console.error('[ SURVEILLANCE ]', error);
    }
  }, [homeService, camData]);

  useEffect(() => {
    if (!camData) getCameras();
  }, [camData, getCameras, setMain]);

  useEffect(() => {
    !layout?.background && layout?.background !=="#130907" && setLayout({ background: "#130907" });
    // if (!queryId) {
    //   setMain(undefined);
    // }

    // console.log("[ handle mode]", mode);
  }, [handleMode]);

  // 🔄 New effect: toggle loading state every 30s for 1s
  // useEffect(() => {
  //   // const interval = setInterval(() => {
  //   //   setLoading(true);
  //   //   const timeout = setTimeout(() => setLoading(false), 1000);
  //   //   return () => clearTimeout(timeout);
  //   // }, 30000);

  //   // return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="surveillance">

        {loading && <div className="loading-indicator">Refreshing...</div>}
        {camData?.cameras ? (
          <>
            <div className="surveillance__header">
              <AdaptGrid xs={2} md={3} variant="card" gap={10}>
                {["available", "enabled", "total"].map((d: any) => (
                  <div key={d}>
                    {d}: {camData[d as keyof ISurveillanceCam]}
                  </div>
                ))}
                <div>
                  <ToggleSwitch
                    value={mode}
                    name="mode"
                    label={mode ? 'thumb' : 'live'}
                    onChange={handleMode}
                  />
                </div>

              </AdaptGrid>
            </div>
            {main && mode && (
              <div className="surveillance__details">
                <SurveillanceDetails camera={main} />
              </div>
            )}
            <AdaptGrid xs={1} md={3} variant="card" gap={10}>
              {!loading &&
                Object.values(camData.cameras).map((camera: any, idx: number) => (
                  <div key={idx} className={`surveillance__item ${mode ? "" : ""}`}>
                    <div className={`surveillance__header ${mode ? "" : ""}`}>{camera.name_uri}</div>
                    <div className={`surveillance__details ${mode ? "" : ""}`}>
                      <UiMedia

                        onClick={() => handleMain(camera.name_uri)}
                        // src={`https://wyze.tiktok.soy/${cameraData?.snapshot_url}`}

                        src={mode ? `https://tiktok.soy/api/stream/img?id=${camera?.name_uri}` : `https://tiktok.soy/api/stream/rtsp?id=${camera.name_uri}`}
                        alt="thumbnail"
                        width={250}
                        height={250}
                      />
                    </div>
                  </div>
                ))}
            </AdaptGrid>
          </>
        ) : (
          "still loading..."
        )}
      </div>
    </>
  );
};

export default Surveillance;
