// Relative Path: ./Calendar.tsx
import React, { useEffect, useState } from 'react';
import styles from './Calendar.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import useCalendar from '../hooks/useCalendar';
import CalendarDate from '../views/CalendarDate/CalendarDate';
import { ICalendar } from '../models/ICalendar';
import { IDate } from '../models/IDate';
import { daysOfWeek } from '@webstack/helpers/userExperienceFormats';



const Calendar: React.FC<ICalendar> = ({
    events = [
        { title: 'event test 1', description: 'desc 1', iso: '2023-11-01' },
        { title: 'event test 2', description: 'desc 2', iso: '2023-11-01T12:00:00Z' }
    ],
    year,
    month
}: ICalendar) => {
    const calendar = useCalendar(month, year); // November 2023
    const [days, setDays] = useState(calendar);

    useEffect(() => {
        // Append events to days
        const updatedDays = calendar.map(day => {
            const dayISO = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
            const dayEvents = events
                .filter(event => event.iso.startsWith(dayISO))
                .map(event => {
                    const timeMatch = event.iso.match(/T(\d{2}:\d{2})/);
                    return {
                        ...event,
                        time: timeMatch ? timeMatch[1] : 'all day',
                        sortKey: timeMatch ? timeMatch[1] : '00:00'
                    };
                })
                .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

            return { ...day, events: dayEvents };
        });
        setDays(updatedDays);
    }, []);


    return (
        <>
            <style jsx>{styles}</style>
            <div className='calendar'>
                <div className='calendar__dows'>
                    <AdaptGrid xs={7}>
                        {daysOfWeek.map((d, index) => (
                            <div key={index} className='calendar__dow'>{d}</div>
                        ))}
                    </AdaptGrid>

                </div>
                <AdaptGrid xs={7} responsive>
                    {days && days.map((date: IDate, key: number) => (
                        <div key={key} className='calendar__date-container'>
                            <CalendarDate date={date} />
                        </div>
                    ))}
                </AdaptGrid>
            </div>
        </>
    );
};

export default Calendar;
