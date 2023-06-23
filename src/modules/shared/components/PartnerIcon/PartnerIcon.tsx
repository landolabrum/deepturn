import checkString from "@webstack/helpers/checkString";
import { PartnersArray } from "~/src/models/reports/PartnerDefinition";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import styles from "./PartnerIcon.scss";
interface IProps {
    icon: any;
    width?: number;
    height?: number;
    type?: string;
    variant?: string;
}
export default function PartnerIcon({ icon, width, height, type="token", variant }: IProps): any {
    const brand = checkString(icon, PartnersArray);
    return <>
    <style jsx>{styles}</style>
   <div className={`partner-icon ${variant?variant:""}`} style={{ width: `${width}px`, height: `${height}px` }} >
        { variant !== 'smart-node-bundle' && brand ? <UiIcon icon={`${brand}-${type}`} /> : variant !== 'smart-node-bundle'?<UiIcon icon={`connect-token`} />:<UiIcon icon={`bundle-token`} />}
    </div>
    </>;
}