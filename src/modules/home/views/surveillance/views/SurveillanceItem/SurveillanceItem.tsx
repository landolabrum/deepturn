import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import styles from "./SurveillanceItem.scss";
import UiMedia from "@webstack/components/UiMedia/controller/UiMedia";
import environment from "~/src/core/environment";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import { useCallback, useEffect, useState } from "react";
import UiJoyStick from "@webstack/components/UiForm/components/UiJoyStick/UiJoyStick";
import SurveillanceController from "../SurveillanceController/SurveillanceController";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";

interface ISurveillanceItem {
    camera: any, onSelect?: (e: any) => void
}
const SurveillanceItem = ({ camera, onSelect }: ISurveillanceItem) => {
    const [status, setStatus] = useState<any>();
    const [isHovering, setIsHovering] = useState<any>();
    const strStatus=()=>typeof status?.available=='string'?"View":'huh';
    const handleStatus =
        (e: any) => {
            if (e.available && status?.available) return;
            setStatus(e)
        }
        
        useEffect(() => {}, [status]);
    return <>
        <style jsx>{styles}</style>
        <div className='surveillance-item' >
            {status && JSON.stringify({status})||'no staus'}
            <div className='surveillance-item__header'>
                <div className='surveillance-item__header--title'>
                    {camera?.nickname}
                </div>
                <div className='surveillance-item__header--status'>
                    <div className='surveillance-item__time'>
                        {dateFormat(camera?.img_time, { isTimestamp: true })}
                    </div>
                    <div>
                        <UiIcon icon={camera?.audio ? 'fa-volume' : 'fa-volume-xmark'} />
                    </div>
                    <div>
                        <UiIcon color={status?.available ? 'var(--green-70)' : 'var(--red-70)'} icon={status?.available ? 'fa-signal' : 'fa-signal-slash'} />
                        {strStatus()}
                    </div>
                </div>
            </div>
            <div
                className='surveillance-item__snapshot'
                onMouseEnter={()=>setIsHovering(true)}
                onMouseLeave={()=>setIsHovering(false)}
            >
                {/* {camera?.snapshot_url} */}
                {isHovering&&<div className='surveillance-item__snapshot__hover' onClick={()=>onSelect&&onSelect(camera.nickname)}>{strStatus()}</div>}
                {camera?.snapshot_url && <UiMedia
                    onLoad={handleStatus}
                    alt={camera.nickname}
                    loadingText={camera.nickname}
                    src={`${environment.serviceEndpoints.membership}/api/stream/img?id=${String(camera.nickname).toLowerCase()}`}
                />}
            </div>
        </div>
    </>
}
export default SurveillanceItem;