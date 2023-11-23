// Relative Path: ./CalendarDate.tsx
import React, { useEffect } from 'react';
import styles from './CalendarDate.scss';
import { IDate } from '../../models/IDate';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { dowArray } from '@webstack/helpers/userExperienceFormats';
import { IEvent } from '../../models/IEvent';
// Remember to create a sibling SCSS file with the same name as this component

const CalendarDate: React.FC<any> = ({ date, btnText = 'rsvp' }: { date: IDate, btnText: string }) => {
    const { openModal, closeModal } = useModal();
    const Events = ({ events }: { events: IEvent[] }) => {
        const day = dateFormat(`${date.year}-${date.month}-${date.day}`);
        return <>
            <style jsx>{styles}</style>
            <div className='calendar-date-modal'>
                <div className='calendar-date-modal__title'>{day}</div>
                {events.map((event, eventKey) => (
                    <div key={eventKey} className='calendar-date-modal__event'>
                        {JSON.stringify(event)}
                        <div className='calendar-date-modal__event--header'>
                            <div className='calendar-date-modal__event--header--title'>{event.title}</div>
                            <div className='calendar-date-modal__event--header--time'>
                                <UiIcon icon='fa-clock' />{event.time}
                            </div>
                        </div>
                        <div className='calendar-date-modal__event--description'>{event.description}</div>
                        <div className='calendar-date-modal__event--action'>
                            <UiButton>{btnText}</UiButton>
                        </div>
                    </div>
                ))}
            </div>
        </>
    }
    const handleEventClick = (eventIndex: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up to the parent

        let events = date?.events;
        if(!events?.length) return;

        openModal(<Events events={[events[eventIndex]]} />);
    }

    const handleClick = () => {
        let events = date?.events;
        if(!events?.length) return;

        openModal(<Events events={events} />);
    }
    
    useEffect(() => {}, [date]);
    return (
        <>
            <style jsx>{styles}</style>
            <div
                className={`calendar-date${date?.events?.length && ' calendar-date__has-event' || ''}`}
                data-day={String(date.day)}
                onClick={handleClick}
                data-mobile-day={`${dowArray[date.dow]} ${dateFormat(`${date.month}-${date.day}-${date.year}`)}`}
            >
                {date?.events && date.events.map((event, eventKey) => (
                    <div onClick={(e) => handleEventClick(eventKey, e)} key={eventKey} className='calendar-date__event'>
                        <div className='calendar-date__event--title'>{event.title}</div>
                        {event.time && <div className='calendar-date__event--time'>
                            <UiIcon icon='fa-clock' />
                            <div> {event.time}</div>
                        </div>}
                    </div>
                ))}
            </div>
        </>
    );
};

export default CalendarDate;