import React, { useEffect, useState } from 'react';
import styles from "./SurveillanceController.scss";
import UiJoyStick from '@webstack/components/UiForm/components/UiJoyStick/UiJoyStick';
import IHomeService from '~/src/core/services/HomeService/IHomeService';
import { getService } from '@webstack/common';
import UiDev from '@webstack/components/UiDev/UiDev';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';
import UiPill from '@webstack/components/UiForm/components/UiPill/UiPill';

interface ISurveillanceControlsProps {
  cameraId: string;
}

const SurveillanceController: React.FC<ISurveillanceControlsProps> = ({ cameraId }) => {
  const [camera, setCamera] = useState<any>();
  const homeService = getService<IHomeService>("IHomeService");
const getCameraInfo = async () =>{
  if(camera || !cameraId)return;
  const response =await homeService.wbInfo(cameraId.toLowerCase());
  if(response)setCamera(response);
}
  const handleJoyStickMove = async (x: number, y: number) => {
    if(!camera)return;
    const SENSITIVITY = 50;
    // Normalize and clamp values to ensure they are within 0 to 255
    if( camera?.ptz_position.horizontal == x &&  camera?.ptz_position.vertical == y)return;
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
    const normalizedX = clamp(Number(((x + camera?.ptz_position.horizontal||0 + SENSITIVITY) / 2).toFixed(0)), 0, 350);
    const normalizedY = clamp(Number(((y + camera?.ptz_position.vertical ||0 + SENSITIVITY) / 2).toFixed(0)), 0, 180);
    setCamera({...camera, ptz_position: {vertical:normalizedY, horizontal:normalizedX}});
// console.log({cameraId, normalizedX, normalizedY})

    const resp =await homeService.ptzPosition(cameraId, normalizedX, normalizedY);
    return resp
    // console.log({resp})
  };


useEffect(() => {
   getCameraInfo()
}, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='surveillance-controller'>
        <div className='surveillance-controller--coordinates'>
          {/* <UiDev data={camera}/> */}
          {`X: ${camera?.ptz_position.horizontal}, Y: ${camera?.ptz_position.vertical}`}
        </div>
        <div className='surveillance-controller--joystick'>
          <UiJoyStick onMove={handleJoyStickMove} />
          <div>

          </div>
        </div>
    
          <UiInput 
          value={camera?.ptz_position.vertical} 
          onChange={(field)=>handleJoyStickMove(camera.ptz_position.horizontal,Number(field.value))} 

          label="vertical" 
          type="range"
        /> 
       <UiInput 
          value={camera?.ptz_position.horizontal} 
          label="horizontal"
           onChange={(field)=>handleJoyStickMove(Number(field.value),camera.ptz_position.vertical)} 
           type="range"
          />
      </div>
    </>
  );
};

export default SurveillanceController;
