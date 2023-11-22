// Relative Path: ./Calendar.tsx
import React, { useEffect, useState } from 'react';
import styles from './Calendar.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import useCalendar from '../hooks/useCalendar';
import CalendarDate from '../views/CalendarDate/CalendarDate';
import { ICalendar } from '../models/ICalendar';
import { IDate } from '../models/IDate';
import { dowArray, monthArray } from '@webstack/helpers/userExperienceFormats';
import UiSelect from '@webstack/components/UiSelect/UiSelect';
import UiPill from '@webstack/components/UiPill/UiPill';



const Calendar: React.FC<ICalendar> = ({
    events = [
        { title: 'event test 1', description: 'desc 1', iso: '2023-11-01' },
        { title: 'event test 2', description: 'desc 2', iso: '2023-11-01T12:00:00Z' }
    ],
    year,
    month,
    title
}: ICalendar) => {
    const dayISO = (day: IDate) => day?.year && `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
    const [mmYY, setMmYy] = useState({ mm: month, yy: year });
    const [days, setDays] = useState([]);
    const [amount, setAmount] = useState<any>();
    const firstDay = () => dayISO(days[0]);
    const lastDay = () => dayISO(days[days.length - 1]);
    const calendar = (mm:any, yy:any)=>{
        return useCalendar(mm,yy)
    }
    const handleAmount = (direction: string) => {
        const dir = direction == 'plus' ? 1 : -1;
        const refDay: IDate = days[15];
        const refMonth = refDay.month;
        const newMonth = refDay.month + dir;
        const newYear = refMonth == 1 ? refDay.year - 1 : refMonth == 12 ? refDay.year + 1 : refDay.year;
        console.log({ m: newMonth, y: newYear });
        setDays(updatedDays(useCalendar(newMonth, newYear)));
        // monthArray.map((mm, i)=>{
        //     console.log(i, mm)
        // })
        // setAmount(direction)
        // if(direction == 'minus')setAmount(amount > 0 ? amount - 1:0);
        // else{setAmount( amount + 1);}
    }

    const updatedDays = (calendar:any)=>{
        return calendar.map((day:IDate) => {
            const iso:any = dayISO(day);

            const dayEvents = events
                .filter(event => event.iso.startsWith(iso))
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
    }
    useEffect(() => {
        // Append events to days
        // setDays(calendar)
        setDays(updatedDays(calendar));
    }, []);


    return (
        <>
            <style jsx>{styles}</style>

            <div className='calendar'>
                <div className='calendar__header'>
                    <div className='calendar__header--title'>
                        {title}
                    </div>
                    <div className='calendar__header--filters'>
                        {JSON.stringify(firstDay())}
                        {JSON.stringify(lastDay())}
                        <UiPill
                            amount={amount}
                            setAmount={setAmount}
                            traits={{
                                beforeIcon: {
                                    icon: amount > 1 ? "fas-minus" : "fa-trash-can",
                                    onClick: () => handleAmount('minus'),
                                    color: amount == 1 ? "red" : ""
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
