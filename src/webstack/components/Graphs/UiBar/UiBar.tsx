import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./UiBar.scss";
import { UiIcon } from "../../UiIcon/UiIcon";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { debounce } from "lodash";

interface BarProps {
  barCount: number;
  percentage: number;
  isColor?: boolean;
  icon?: string;
  status?: string;
  timestamp?: string;
  header?: string | React.ReactElement[] | React.ReactElement | string[];
  onChange?: (newPercentage: number | string) => void;
}

const UiBar = ({
  barCount,
  percentage,
  isColor,
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
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const newPercentage = 100 - ((e.clientY - bounds.top) / bounds.height) * 100;
    const clampedPercentage = Math.max(0, Math.min(newPercentage, 100));
    let newVale = isColor == true ? percentageToHex(clampedPercentage) : newPercentage.toFixed(0)
    setLocalPercentage(newPercentage);
    debouncedOnChange(newVale);
  };
  const percentageToHue = (percentage: number): number => {
    // Mapping 0-100% to 0-240 degrees (red to blue)
    return (percentage / 100) * 240;
  };
  
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number): number => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
  };
  
  const percentageToHex = (percentage: number): string => {
    const hue = percentageToHue(percentage);
    // Assuming full saturation (100%) and lightness (50%) for vivid colors
    return hslToHex(hue, 100, 50);
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

      if (isColor) {
        barStyle.backgroundColor = percentageToHex(localPercentage);
      }

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

    // if(isColor && containerRef.current){
    //   containerRef = containerRef
    // }

}, [Boolean(percentage != localPercentage && !isColor) ]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`bar${styles.graphContainer && ` ${styles.graphContainer}` || ''}`}>
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
            className={`bar__bars-container ${styles.barsContainer || ''}${
            isColor && ' bar__bars-container--is-color' || ''}
            }`}
            ref={containerRef}
            onMouseDown={(e) => handleMouseDrag(e)}
            onMouseMove={(e) => e.buttons === 1 && handleMouseDrag(e)}
          >
            {renderBars()}
            <div className={`bar__percentage${styles.percentageText ? ` ${styles.percentageText}` : ''}`}>
              <div>{String(localPercentage)?.split('.')[0]}%</div>
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
