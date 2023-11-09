import React from "react";
import PropTypes from "prop-types";
import styles from "./UiBar.scss";
import { UiIcon } from "../../UiIcon/UiIcon";

import { dateFormat } from "@webstack/helpers/userExperienceFormats";

interface BarProps {
  barCount: number;
  percentage: number;
  icon?: string;
  status?: string;
  timestamp?: string;
  header?: string | React.ReactElement;
}

const UiBar = ({ barCount, percentage, icon, status, timestamp, header }: BarProps) => {
  function generateColorByPercentage(percentage: number) {
    const greenStart = parseInt("ff", 16); // Red component at 100% (255 in decimal)
    const greenEnd = parseInt("00", 16); // Red component at 0% (0 in decimal)
    const redStart = parseInt("33", 16); // Green component at 100% (51 in decimal)
    const redEnd = parseInt("ff", 16); // Green component at 0% (255 in decimal)

    const red = Math.round((redStart - redEnd) * (percentage / 100) + redEnd);
    const green = Math.round((greenStart - greenEnd) * (percentage / 100) + greenEnd);

    const color = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}00`;

    return color;
  }

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
                style={{ height: `${fillPercentage}%`, backgroundColor: generateColorByPercentage(percentage) }}
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
                barClassName !== "bar__bars-bar-empty" ? { backgroundColor: generateColorByPercentage(percentage) } : {}
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
      <div className={`bar ${styles.graphContainer}`}>
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
                {status === "STATUS_LOW" && (
                  <div className="bars__status-low">
                    <UiIcon color="#f90" icon="fa-exclamation-triangle" />
                    low
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
            <div className={`bar__percentage ${styles.percentageText}`}>
              <div>{percentage}%</div>
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
};

export default UiBar;
