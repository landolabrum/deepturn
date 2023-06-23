import styles from "./DateRangeMenu.scss";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { CalendarDay } from "../../UiCalendar";
import UiButton from "@webstack/components/UiButton/UiButton";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useState } from "react";

import type { FC } from "react";

interface DateRangeMenuProps {
  props: any;
}

const DateRangeMenu: FC<DateRangeMenuProps> = ({ props }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const {
    calendar,
    isStart,
    handleMonthViewChange,
    handleClickDay,
    setOpen_,
    dayClass,
    currentLabel,
    pointStart,
    createDay,
  } = props;
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`date-range-menu`}>
        <div className={`date-range-menu__options ${fullScreen?" date-range-menu__options-full-screen":""}`}>
          <div className="date-range-menu__grid-control">
            <div className="date-range-menu__date-range-header">
              <div className="date-range-menu__month-controls">
                <span className="date-range-menu__icon">
                  <UiIcon icon="fa-chevron-left" onClick={() => handleMonthViewChange(-1)} />
                </span>
                <div className="date-range-menu__current-month-year">{currentLabel}</div>
                <span className="date-range-menu__icon">
                  <UiIcon icon="fa-chevron-right" onClick={() => handleMonthViewChange(1)} />
                </span>
              </div>
              {/* TOOLS */}
              <div className="date-range-menu__date-range-tools">
                <div>
                  <UiIcon icon={`${!fullScreen?"fa-up-right-and-down-left-from-center":"fa-down-left-and-up-right-to-center"}`} onClick={() => setFullScreen(!fullScreen)}/>
                </div>
                <div>
                  <UiIcon icon="fa-xmark" onClick={() => setOpen_(false)} />
                </div>
              </div>
              <div className="date-range-menu__date-range-state">
                <div className="date-range-menu__date-range-label">{isStart ? "start" : "end"} date:</div>
                <UiButton traits={{ height: fullScreen?undefined:25 }} onClick={() => handleClickDay(createDay(new Date()))} variant="">
                  Today
                </UiButton>
              </div>
            </div>
            <AdaptGrid xs={7} gapY={5}>
              {["s", "m", "t", "w", "t", "f", "s"].map((d, key) => (
                <div key={key} className="date-range-menu__day-name">
                  {d}
                </div>
              ))}
              {calendar?.map((calDay: CalendarDay, key: number) => (
                <div
                  key={key}
                  onClick={() => (isStart ? handleClickDay(calDay) : calDay.id >= pointStart && handleClickDay(calDay))}
                  className={`date-range-menu__calendar-day ${dayClass(calDay)}`}
                  // handles the pos of the dates to respective (DOW) day of week
                  style={key === 0 ? { gridColumn: calDay.dow } : {}}
                >
                  {calDay.disp}
                </div>
              ))}
            </AdaptGrid>
          </div>
        </div>
      </div>
    </>
  );
};
export default DateRangeMenu;