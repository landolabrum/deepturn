import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./UiBar.scss";
import { UiIcon } from "../../UiIcon/UiIcon";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { debounce } from "lodash";

interface BarProps {
  barCount: number;
  percentage: number;
  icon?: string;
  status?: string;
  timestamp?: string;
  header?: string | React.ReactElement[] | React.ReactElement | string[];
  onChange?: (newPercentage: number | string) => void;
}
// Define helper functions outside of the UiBar component

const UiBar = ({
  barCount,
  percentage,
  icon,
  status,
  timestamp,
  header,
  onChange
}: BarProps) => {
  const [localPercentage, setLocalPercentage] = useState(percentage);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedOnChange = useRef(
    debounce((newPercentage) => {
      if (onChange) {
        onChange(newPercentage);
      }
    }, 1000)
  ).current;


const handleMouseDrag = (e: React.MouseEvent) => {
  // console.log('[ e ]',e )
  if (!containerRef.current) return;
  const bounds = containerRef.current.getBoundingClientRect();
  const newPercentage = 100 - ((e.clientY - bounds.top) / bounds.height) * 100;
  const clampedPercentage = Math.max(0, Math.min(newPercentage, 100));
  setLocalPercentage(clampedPercentage);
  debouncedOnChange(clampedPercentage.toFixed(0));
};




  const renderBars = () => {
    const bars = [];
    const style = {
      filledBar: "bar__bars-bar-filled",
      emptyBar: "bar__bars-bar-empty",
      partialBar: "bar__bars-bar-partial",
    };
  
    for (let i = 0; i < barCount; i++) {
      let barClassName;
      let barStyle: { backgroundColor?: string; height?: string } = {}; // Define barStyle with optional properties
  

      if (i < Math.floor((localPercentage * barCount) / 100)) {
        barClassName = style.filledBar;
      } else if (i === Math.floor((localPercentage * barCount) / 100)) {
        barStyle.height = `${(localPercentage * barCount) % 100}%`;
        barClassName = style.partialBar;
      } else {
        delete barStyle.height
        barClassName = style.emptyBar;
      }

      bars.push(
        <span key={i}>
          <style jsx>{styles}</style>
          <div className="bar__bars-content">
            <div
              className={`bar__bars-bar ${barClassName}`}
              style={barStyle}
            ></div>
          </div>
        </span>
      );
    }
    return bars;
  };


  useEffect(() => { 
    setLocalPercentage(percentage)
}, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='bar'>
        {timestamp && <div className="bar__timestamp">{dateFormat(timestamp, { time: true })}</div>}
        <div className="bar__container">
          {header && <div className="bar__header">
            {header}
            {icon && (
              <div className="bars__icon">
                <UiIcon icon={icon} />
              </div>
            )}
            {status && (
              <div className="bars__status">
                {["STATUS_LOW", 'low', 'high'].includes(status) && (
                  <div className="bars__status-low">
                    <UiIcon color="#f90" icon="fa-exclamation-triangle" />
                    {keyStringConverter(status)}
                  </div>
                )}
              </div>
            )}
          </div>}
          <div
            className='bar__bars-container'
            ref={containerRef}
            onMouseDown={(e) => handleMouseDrag(e)}
            onMouseMove={(e) => e.buttons === 1 && handleMouseDrag(e)}
          >
            {renderBars()}
            <div className="bar__percentage">
              <div>{localPercentage.toString().split('.')[0]}%</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
UiBar.propTypes = {
  barCount: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  isColor: PropTypes.bool,
  icon: PropTypes.string,
  onChange: PropTypes.func,
};

export default UiBar;
