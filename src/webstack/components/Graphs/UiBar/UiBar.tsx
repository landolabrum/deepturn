import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./UiBar.scss";
import { UiIcon } from "../../UiIcon/UiIcon";

import { colorPercentage, dateFormat } from "@webstack/helpers/userExperienceFormats";
import keyStringConverter from "@webstack/helpers/keyStringConverter";

interface BarProps {
  barCount: number;
  percentage: number;
  icon?: string;
  status?: string;
  timestamp?: string;
  header?: string | React.ReactElement;
  colorReverse?: boolean;
  onChange?: (newPercentage: number) => void; // Add this line
}

const UiBar = ({
  colorReverse,
  barCount,
  percentage,
  icon,
  status,
  timestamp,
  header,
  onChange // Add this line
}: BarProps) => {
  const [localPercentage, setLocalPercentage] = useState(percentage);

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = Number(e.target.value);
    setLocalPercentage(newPercentage);
    if (onChange) {
      onChange(newPercentage);
    }
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

      if (i < Math.floor((percentage * barCount) / 100)) {
        barClassName = style.filledBar;
      } else if (i === Math.floor((percentage * barCount) / 100)) {
        const fillPercentage = (percentage * barCount) % 100;
        barClassName = style.partialBar;
        bars.push(
          <div key={i}>
            <style jsx>{styles}</style>
            <div className="bar__bars-content">
              <div
                className={`bar__bars-bar ${barClassName}`}
                style={{ height: `${fillPercentage}%`, backgroundColor: colorPercentage(percentage, colorReverse) }}
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
              style={
                barClassName !== "bar__bars-bar-empty" ? { backgroundColor: colorPercentage(percentage, colorReverse) } : {}
              }
              className={`bar__bars-bar ${barClassName}`}
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
            {header && (
              <div className="bars__status">
               {header}
              </div>
            )}
          </div>
          <div className={`bar__bars-container ${styles.barsContainer}`}>
            {renderBars()}
            <div className={`bar__percentage${styles.percentageText?` ${styles.percentageText}`:''}`}>
              <div>{String(percentage)?.split('.')[0]}%</div>
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
  onChange: PropTypes.func, // Add this line
};

export default UiBar;
