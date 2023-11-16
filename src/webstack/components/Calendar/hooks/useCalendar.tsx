import { useMemo } from 'react';

const useCalendar = (
        month:number = new Date().getMonth() + 1,
        year:number = new Date().getFullYear()
    ) => {
    const getCalendarDays = useMemo(() => {
        let days = [];
        
        // Start from the first day of the month
        let currentDate = new Date(year, month - 1, 1);

        // Adjust to include the last days of the previous month
        while (currentDate.getDay() !== 0) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        // Loop until you reach the first day of the next month
        do {
            days.push({
                month: currentDate.getMonth() + 1,
                year: currentDate.getFullYear(),
                day: currentDate.getDate(),
                dow: currentDate.getDay()
            });
            currentDate.setDate(currentDate.getDate() + 1);
        } while (currentDate.getMonth() !== month);

        // Continue to include days until the end of the week (Saturday)
        while (currentDate.getDay() !== 0) {
            days.push({
                month: currentDate.getMonth() + 1,
                year: currentDate.getFullYear(),
                day: currentDate.getDate(),
                dow: currentDate.getDay()
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    }, [month, year]);

    return getCalendarDays;
};

export default useCalendar;
