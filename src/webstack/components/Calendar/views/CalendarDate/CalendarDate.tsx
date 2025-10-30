import React, { useEffect } from 'react';
import styles from './CalendarDate.scss';
import { IDate } from '../../models/IDate';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { dowArray } from '@webstack/helpers/userExperienceFormats';
import { IEvent } from '../../models/IEvent';

const CalendarDate: React.FC<any> = ({ date, btnText = 'rsvp' }: { date: IDate, btnText: string }) => {
    const { openModal } = useModal();

    const Events = ({ events }: { events: IEvent[] }) => {
        const day = dateFormat(`${date.year}-${date.month}-${date.day}`);
        return (
            <>
                <style jsx>{styles}</style>
                <div className='calendar-date-modal'>
                    <div className='calendar-date-modal__title'>{day}</div>
                    {events.map((event, eventKey) => (
                        <div key={eventKey} className='calendar-date-modal__event'>
                            <div className='calendar-date-modal__event--header'>
                                <div className='calendar-date-modal__event--header--title'>{event.title}</div>
                                <div className='calendar-date-modal__event--header--time'>
                                    <UiIcon icon='fa-clock' />{dateFormat(event.iso)}
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
        );
    };

    const handleEventClick = (eventIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const events = date?.events;
        if (!events?.length) return;

        openModal(<Events events={[events[eventIndex]]} />);
    };

    const handleClick = () => {
        const events = date?.events;
        if (!events?.length) return;

        openModal(<Events events={events} />);
    };

    // Determine if this date is today
    const today = new Date();
    const isToday =
        today.getFullYear() === date.year &&
        today.getMonth() + 1 === date.month &&
        today.getDate() === date.day;

    const classNames = [
        'calendar-date',
        date?.events?.length ? 'calendar-date__has-event' : '',
        isToday ? 'calendar-date--today' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <style jsx>{styles}</style>
            <div
                className={classNames}
                data-day={String(date.day)}
                onClick={handleClick}
                data-mobile-day={`${dowArray[date.dow]} ${dateFormat(`${date.month}-${date.day}-${date.year}`)}`}
            >
                {date?.events?.map((event, eventKey) => (
                    <div
                        key={eventKey}
                        onClick={(e) => handleEventClick(eventKey, e)}
                        className='calendar-date__event'
                    >
                        <div className='calendar-date__event--title'>{event.title}</div>
                        {event.time && (
                            <div className='calendar-date__event--time'>
                                <UiIcon icon='fa-clock' />
                                <div>{event.time}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default CalendarDate;
