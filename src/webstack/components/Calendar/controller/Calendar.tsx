// Relative Path: ./Calendar.tsx
import React, { useEffect, useState } from 'react';
import styles from './Calendar.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import CalendarDate from '../views/CalendarDate/CalendarDate';
import { ICalendar } from '../models/ICalendar';
import { IDate } from '../models/IDate';
import { dowArray, monthArray } from '@webstack/helpers/userExperienceFormats';
import UiPill from '@webstack/components/UiForm/components/UiPill/UiPill';
import UiButton from '@webstack/components/UiButton/UiButton';

const Calendar: React.FC<ICalendar> = ({
    events = [
        { title: 'event test 1', description: 'desc 1', iso: '2023-11-01' },
        { title: 'event test 2', description: 'desc 2', iso: '2023-11-01T12:00:00Z' }
    ],
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
    title
}: ICalendar) => {
    const [mmYY, setMmYy] = useState({ mm: month, yy: year });
    const [days, setDays] = useState<IDate[]>([]);

    const generateCalendarDays = (month: number, year: number): IDate[] => {
        let days: IDate[] = [];
        let currentDate = new Date(year, month - 1, 1);
    
        // Move back to the first day of the week
        while (currentDate.getDay() !== 0) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
    
        // Track the first iteration to allow entry into the loop
        let isFirstIteration = true;
    
        do {
            if (currentDate.getMonth() + 1 !== month) {
                if (!isFirstIteration) {
                    break; // Exit the loop when it's no longer the target month
                }
            } else {
                isFirstIteration = false; // Clear the first iteration flag
            }
    
            const isoDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.iso.startsWith(isoDate));
    
            days.push({
                month: currentDate.getMonth() + 1,
                year: currentDate.getFullYear(),
                day: currentDate.getDate(),
                dow: currentDate.getDay(),
                events: dayEvents
            });
    
            currentDate.setDate(currentDate.getDate() + 1);
        } while (true); // Use break statements to exit the loop
    
        return days;
    };
    const handleToday = () =>{
        const currMonth =new Date().getMonth() + 1
        const currYear = new Date().getFullYear()
        setDays(generateCalendarDays(currMonth , currYear));
        setMmYy({ mm: currMonth, yy: currYear });
    }

    
    const handleAmount = (direction: string) => {
        const dir = direction === 'plus' ? 1 : -1;
        const newMonth = ((mmYY.mm - 1 + dir + 12) % 12) + 1;
        const newYear = mmYY.mm === 1 && dir === -1 ? mmYY.yy - 1 : mmYY.mm === 12 && dir === 1 ? mmYY.yy + 1 : mmYY.yy;
        setMmYy({ mm: newMonth, yy: newYear });
    };
    useEffect(() => {
        setDays(generateCalendarDays(mmYY.mm, mmYY.yy));
    }, [mmYY]);
    return (
        <>
            <style jsx>{styles}</style>
                        {/* {JSON.stringify({
                            mmyy: mmYY
                        })} */}
            <div className='calendar'>
            <div className='calendar__header'>
                    <div className='calendar__header--title'>
                        {title}
                    </div>
                    <div className='calendar__header--filters'>
                        <UiButton variant='dark' onClick={handleToday}>Today</UiButton>
                        <UiPill
                            variant='center dark'
                            amount={`${monthArray[mmYY.mm - 1]}, ${mmYY.yy}`}
                            setAmount={console.log}
                            traits={{
                                beforeIcon: {
                                    icon: "fas-minus",
                                    onClick: () => handleAmount('minus')
                                },
                                afterIcon: {
                                    icon: "fas-plus",
                                    onClick: () => handleAmount('plus')
                                },
                            }} />
                    </div>
                </div>
                <div className='calendar__dows'>
                    <AdaptGrid xs={7}>
                        {dowArray.map((d, index) => (
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
