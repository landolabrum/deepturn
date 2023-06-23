import { useEffect, useCallback } from "react";
import styles from "./Brightness.scss";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";
import _ from "lodash";

function BrightnessSlider({ brite, id, onChange, hex }: any) {
  const memberService = getService<IMemberService>("IMemberService");

  const debouncedHandleSliderChange = useCallback(
    _.debounce(async (value) => {
      const response = await memberService.light({ id, bri: value, function: "bri" });
      // alert(JSON.stringify(response))
      onChange && onChange(response);
    }, 1000), // 3 seconds delay
    []
  );

  const handleSliderChange = (event: any) => {
    debouncedHandleSliderChange(event.target.value);
  };

  useEffect(() => {}, [onChange]);

  return (
    <>
      <style jsx>{styles}</style>
        <div className="legend">{brite}%</div>
      {/* <div className="fieldset"> */}
        {/* <div className="perc" style={{ background: hex, width: brite + "%" }}></div> */}
        <div className="brightness">
        <div className="brightness__content">
        <input
          type="range"
          min="1"
          max="100"
          value={brite}
          className="slider"
          id="brightnessSlider"
          onChange={handleSliderChange}
        />
      </div>
      </div>
    </>
  );
}

export default BrightnessSlider;
