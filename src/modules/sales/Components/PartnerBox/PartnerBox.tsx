import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import styles from "./PartnerBox.scss";
import { numberToUsd } from "@webstack/helpers/userExperienceFormats";

const PartnerBox = ({ icon, revenue, withPennies = true }: any) => {
  let rev = numberToUsd(revenue);
  if (!withPennies) rev = rev.split('.')[0];
  return <>
    <style jsx>{styles}</style>
    <div className="partner">
      <div className="partner-wordmark">
        <UiIcon icon={icon} />
      </div>
      <div className="partner-revenue-header">
        Sales Revenue
      </div>
      <div className="partner-revenue">{rev}</div>
    </div>
  </>
}
export default PartnerBox
