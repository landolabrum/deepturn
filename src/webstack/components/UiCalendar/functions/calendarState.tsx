import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import { useReducer, useCallback, useEffect } from "react";

function reducer(state: any, action: any) {
    switch (action.type) {
      case "setOpen":
        return { ...state, open: action.payload };
      case "setIsStart":
        return { ...state, isStart: action.payload };
      case "setCalendar":
        return { ...state, calendar: action.payload };
      case "setPoints":
        return { ...state, points: action.payload };
      default:
        throw new Error();
    }
  }

const createDay = (date: any) => {
    const generateDateId = (date: any) => {
      let d = date;
      if (typeof d === "string") d = new Date(date);
      const strId = String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + d.getFullYear();
      return parseInt(strId, 10);
    };
    return {
      value: dateFormat(date),
      dow: date.getDay() + 1,
      disp: date.getDate(),
      id: generateDateId(date),
      val: date,
    };
  };
  const modifyDay = (date: string, amount: number) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + amount);

    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  };
export function useCalendarState(value: any) {
  const [state, dispatch] = useReducer(reducer, {
    open: value.open ? value.open : false,
    isStart: true,
    calendar: [],
    points: { start: 0, end: 0 },
  });
  const createCalendarDays = useCallback(({ month, year }: any) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth: any = [];

    for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
      daysInMonth.push(createDay(date));
    }
    dispatch({ type: "setCalendar", payload: daysInMonth });
  }, [value]);

  useEffect(()=>{},[value])
  return { state, dispatch, createDay, modifyDay, createCalendarDays };
};
