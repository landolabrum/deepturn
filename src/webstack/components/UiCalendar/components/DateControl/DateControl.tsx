import type { NextComponentType, NextPageContext } from "next";
import styles from "./DateControl.scss";
import UiCalendar from "@webstack/components/UiCalendar/UiCalendar";
import { useEffect, useRef, useState } from "react";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import useWindow from "@webstack/helpers/useWindow";
import { VariantProps } from "@webstack/components/AdapTable/models/IVariant";

export type DateRangeProps = {
  start: string;
  end: string;
};

interface Props {
  onSelect?: (e: any) => void;
  dateRange: DateRangeProps;
  setDateRange: (e: any) => void;
  width?: number;
  variant?: "mobile-bottom";
}

const DateControl: NextComponentType<NextPageContext, {}, Props> = ({
  dateRange,
  setDateRange,
  onSelect,
  width,
  variant,
}: Props) => {
  const SORT_BY_OPTIONS = [
    { href: "daily", label: "daily", icon: "fa-calendar-day" },
    { href: "monthly", label: "monthly", icon: "fa-calendar-days" },
    { href: "custom", label: "custom", icon: "fa-calendar-pen" },
  ];
  const [sort, setSort_] = useState<VariantProps>('daily');

  function handleDateChange(e: any) {
    e.preventDefault;
    if ("start" in e && "end" in e) {
      setDateRange(e);
    } else {
      setDateRange(e.is_start ? { ...dateRange, start: e.value } : { ...dateRange, end: e.value });
    }
  }
  function handleSelect(sort: VariantProps) {
    setSort_(sort);
    if (onSelect) onSelect(sort);
  }
  const sortTitle = ()=>{
    const curr = SORT_BY_OPTIONS.find(o=>o.label===sort);
    if(curr)return {preIcon: curr.icon, text: curr.label};
    return 'select a date'
  }
  const pageWidth = useWindow().width;
  useEffect(() => {}, [sort, pageWidth]);
  return (
    <>
      <style jsx>{styles}</style>

      <section className={`date-control ${variant ? "date-control__"+variant : ""}`}>
        <h5>
          {sort} - {dateRange.start} {dateRange.start === dateRange.end ? "" : `/ ${dateRange.end}`}
        </h5>
        <div className="date-control__filters">
           <UiCalendar variant={sort} dateRange={dateRange} setDateRange={handleDateChange} label="date range:" />
          <div className="sort-by">
            <UiSelect
              traits={width? {width: width}:{}}
              label="sort by:"
              openDirection={pageWidth > 900 ? "down" : "up"}
              title={sortTitle()}
              onSelect={handleSelect}
              options={SORT_BY_OPTIONS}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default DateControl;
