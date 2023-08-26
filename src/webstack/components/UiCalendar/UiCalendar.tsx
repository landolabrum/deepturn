import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useEffect, useCallback } from "react";
import styles from "./UiCalendar.scss";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import FormControl, { FormControlProps } from "../FormControl/FormControl";
import { useCalendarState } from "./functions/calendarState";
import DateRangeMenu from "./components/DateRangeMenu/DateRangeMenu";
import generateDateId from "./functions/generateDateId";
import { IVariant } from "../AdapTable/models/IVariant";

type DateRangeProps = {
  start?: string;
  end?: string;
};
export interface CalendarDay {
  disp: number;
  dow: number;
  id: number;
  is_start: boolean;
  val: string;
  value: string;
}
export interface CalendarProps extends FormControlProps {
  dateRange: DateRangeProps;
  setDateRange: (value: any) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void | undefined;
}

export default function UiCalendar({ dateRange, setDateRange, label, open, setOpen, variant }: CalendarProps) {
  const { state, dispatch, createDay, modifyDay, createCalendarDays } = useCalendarState(dateRange);
  const { open: stateOpen, isStart, calendar, points } = state;
  const { start: pointStart, end: pointEnd } = points;
  const openState = open ?? stateOpen;

  const setOpen_ = useCallback(
    (state: any) => {
      const newState = state ?? !openState;
      const type: any = setOpen ? setOpen : dispatch;
      type({ type: "setOpen", payload: newState });
    },
    [open, stateOpen]
  );

  const handleClickDay = useCallback(
    (calDay: CalendarDay) => {
      calDay.is_start = isStart;
      setDateRange(calDay);
      const newPayload = isStart ? { start: calDay.id } : { end: calDay.id };
      dispatch({
        type: "setPoints",
        payload: { ...points, ...newPayload },
      });
      dispatch({ type: "setIsStart", payload: !isStart });
      if (!isStart && dateRange?.start && calDay.disp > new Date(dateRange.start).getDate()) setOpen_(false);
    },
    [isStart, dateRange]
  );

  const handleMonthViewChange = useCallback(
    (amount: number) => {
      const calendarDate = new Date(calendar[0].value);
      createCalendarDays({
        month: calendarDate.getMonth() + amount,
        year: calendarDate.getFullYear(),
      });
    },
    [calendar]
  );
  // controls the chevrons in the select Label
  const handleSelectLabel = useCallback(
    (amount: number, isStartBtn?: boolean) => {
      const calendarDate = new Date(calendar[0].value);
      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth() + amount;
      if (variant === "monthly") {
        setDateRange({
          start: createDay(new Date(year, month, 1)).value.toString(),
          end: createDay(new Date(year, month + 1, 0)).value.toString(),
        });
        handleMonthViewChange(amount);
      } else if (variant === "daily") {
        const modifiedDay = dateRange.start && modifyDay(dateRange.start, amount);
        setDateRange({ start: modifiedDay, end: modifiedDay });
      } else if (variant === "custom") {
        if (isStartBtn === true) {
          const modifiedDay = dateRange.start && modifyDay(dateRange.start, amount);
          generateDateId(modifiedDay) < generateDateId(dateRange.end)
            ? setDateRange({ ...dateRange, start: modifiedDay })
            : setDateRange({ start: modifiedDay, end: modifiedDay });
        } else {
          const modifiedDay = dateRange.end && modifyDay(dateRange.end, amount);
          generateDateId(modifiedDay) > generateDateId(dateRange.end)
            ? setDateRange({ ...dateRange, end: modifiedDay })
            : setDateRange({ start: modifiedDay, end: modifiedDay });
        }
      }
    },
    [variant, calendar, dateRange]
  );

  useEffect(() => {
    if (pointStart === 0) {
      const dateRangeDate = dateRange?.start && new Date(dateRange.start);
      dateRangeDate &&
        createCalendarDays({
          month: dateRangeDate.getMonth(),
          year: dateRangeDate.getFullYear(),
        });
      if (calendar?.length)
        dispatch({
          type: "setPoints",
          payload: {
            start: calendar[0]?.id,
            end: calendar[calendar?.length - 1]?.id,
          },
        });
    }
  }, [setOpen_, pointStart, calendar, dateRange.start]);

  const dayClass = useCallback(
    (calendarDay: CalendarDay) => {
      const id = calendarDay.id;
      let dayclass = "";
      if (variant !== "custom")
        dayclass =
          id < pointStart ? "before-start" : id > pointStart && id < pointEnd && isStart ? "current" : "available";
      if (id === pointStart) dayclass += " start";
      if (id === pointEnd) dayclass += " end";
      return dayclass;
    },
    [pointStart, pointEnd, isStart, variant]
  );

  const canShow = [undefined, "custom"].includes(variant);
  const currentLabel =
    variant === "daily"
      ? dateRange.start
      : [undefined, "custom", "monthly"].includes(variant)
      ? dateFormat(calendar[0].value, { format: "MM-YYYY" })
      : "date not selected";
  const renderFormControl = (
    labelValue?: string | React.ReactElement,
    variantValue?: IVariant,
    condition?: boolean
  ) => (
    <>
      <style jsx>{styles}</style>
      <FormControl
        label={labelValue}
        variant={variantValue}
        overlay={stateOpen !== false}
        setOverlay={() => setOpen_(false)}
      >
        <div className={`input-date-range${stateOpen ? " active" : ""}`}>
          <div className="view-options">
            <span className="icon" onClick={() => handleSelectLabel(-1, condition)}>
              <UiIcon icon="fa-chevron-left" />
            </span>
            <span className="selected" onClick={() => setOpen_(condition ? "start" : !open ? "end" : "start")}>
              { labelValue === "start date" ? dateRange.start : variant === 'monthly'?dateRange.end && dateFormat(dateRange.end,{format:"MM-YYYY"}):dateRange.end}
            </span>
            <span className="icon" onClick={() => handleSelectLabel(1, condition)}>
              <UiIcon icon="fa-chevron-right" />
            </span>
          </div>
          {((openState === "start" && condition && isStart) || (openState === "end" && !condition && !isStart)) &&
            canShow &&
            <DateRangeMenu 
            props={{
              calendar,
              isStart,
              handleMonthViewChange,
              handleClickDay,
              setOpen_,
              dayClass,
              currentLabel,
              pointStart,
              createDay,
            }}
            />
  }
      
        </div>
      </FormControl>
    </>
  );
  return variant === "custom"
    ? <><style jsx>{styles}</style>
    <div className="ui-calendar__custom-date-container">
      {renderFormControl("start date", isStart ? variant : "disabled", true)}
      { renderFormControl("end date", variant)}
    </div></>
    : renderFormControl(label, variant);
};