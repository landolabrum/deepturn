import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import styles from "./SurveillanceItem.scss";
import UiMedia from "@webstack/components/UiMedia/controller/UiMedia";
import environment from "~/src/core/environment";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import { useEffect, useState } from "react";


const SurveillanceItem = (camera: any) => {
    const [status,setStatus]=useState<any>();
    
    useEffect(() => {}, [status]);
    return <>
        <style jsx>{styles}</style>
        <div className='surveillance-item'>
            {/* {status && JSON.stringify(status)||'no staus'} */}
            <div className='surveillance-item__header'>
                <div className='surveillance-item__header--title'>{camera?.nickname}</div>
           
            <div className='surveillance-item__header--status'>
            <div className='surveillance-item__time'>
                        {dateFormat(camera?.img_time, { isTimestamp: true })}
                    </div>
                <div>
                    <UiIcon icon={camera?.audio ? 'fa-volume' : 'fa-volume-xmark'} />
                </div>
                <div>
                    <UiIcon color={status?.complete?'var(--green-70)':'var(--red-70)'} icon={status?.complete ? 'fa-signal' : 'fa-signal-slash'} />
                </div>
                </div>
            </div>
            <div className='surveillance-item__snapshot'>
                {camera?.snapshot_url && <UiMedia
                    onLoad={setStatus}
                    alt={camera.nickname}
                    loadingText={camera.nickname}
                    src={`${environment.serviceEndpoints.membership}/api/stream/img?id=${String(camera.nickname).toLowerCase()}`}
                />}
            </div>
        </div>
    </>
}
export default SurveillanceItem; 