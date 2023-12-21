import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./UiBar.scss";
import { UiIcon } from "../../UiIcon/UiIcon";

import { colorPercentage, dateFormat } from "@webstack/helpers/userExperienceFormats";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { debounce } from "lodash";

interface BarProps {
  barCount: number;
  percentage: number;
  icon?: string;
  status?: string;
  timestamp?: string;
  header?: string | React.ReactElement[] | React.ReactElement | string[];
  colorReverse?: boolean;
  background?: { start: string, end: string };
  onChange?: (newPercentage: number) => void; // Add this line
}


const UiBar = ({
  colorReverse,
  background,
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

  // Debounce function to limit calls to onChange
  const debouncedOnChange = useRef(
    debounce((newPercentage) => {
      if (onChange) {
        onChange(newPercentage.toFixed(0));
      }
    }, 1000)
  ).current;

    
  const handleMouseDrag = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const newPercentage = 100 - ((e.clientY - bounds.top) / bounds.height) * 100;
    const clampedPercentage = Math.max(0, Math.min(newPercentage, 100));

    setLocalPercentage(clampedPercentage);

    // Use the debounced function
    debouncedOnChange(clampedPercentage);
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

      if (i < Math.floor((localPercentage * barCount) / 100)) {
        barClassName = style.filledBar;
      } else if (i === Math.floor((localPercentage * barCount) / 100)) {
        const fillPercentage = (localPercentage * barCount) % 100;
        barClassName = style.partialBar;
        bars.push(
          <div key={i}>
            <style jsx>{styles}</style>
            <div className="bar__bars-content">
              <div
                className={`bar__bars-bar ${barClassName}`}
                style={{ height: `${fillPercentage}%`, backgroundColor: colorPercentage(localPercentage, colorReverse, background) }}
              ></div>
            </div>
          </div>
        );
        continue;
      } else {
        barClassName = style.emptyBar;
      }

      bars.push(
        <div key={i}>
          <style jsx>{styles}</style>
          <div className="bar__bars-content">
            <div
              className={`bar__bars-bar ${barClassName}`}
              style={
                barClassName !== style.emptyBar ? { backgroundColor: colorPercentage(localPercentage, colorReverse, background) } : {}
              }
            ></div>
          </div>
        </div>
      );
    }
    return bars;
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`bar${styles.graphContainer && ` ${styles.graphContainer}` || ''}`}>
        {timestamp && <div className="bar__timestamp">{dateFormat(timestamp, { time: true })}</div>}
        <div className="bar__container">
          <div className="bar__header">
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
            {/* {header && (
              <div className="bars__status">
               {header}
              </div>
            )} */}
          </div>
          <div 
            className={`bar__bars-container ${styles.barsContainer}`}
            ref={containerRef}
            onMouseDown={(e) => handleMouseDrag(e)}
            onMouseMove={(e) => e.buttons === 1 && handleMouseDrag(e)}
          >
            {renderBars()}
            <div className={`bar__percentage${styles.percentageText?` ${styles.percentageText}`:''}`}>
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
  icon: PropTypes.string,
  onChange: PropTypes.func,
};

export default UiBar;