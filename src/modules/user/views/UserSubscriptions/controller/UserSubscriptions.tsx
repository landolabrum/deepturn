// Relative Path: ./Subscriptions.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserSubscriptions.scss';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import Calendar from '@webstack/components/Calendar/controller/Calendar';
import IAuthenticatedUser from '~/src/models/UserContext';
import { IEvent } from '@webstack/components/Calendar/models/IEvent';

// Remember to create a sibling SCSS file with the same name as this component

const UserSubscriptions: React.FC<any> = ({ user }: { user: IAuthenticatedUser }) => {
    const today = dateFormat(new Date());
    const [events, setEvents] = useState<IEvent[] | undefined>(undefined);


    return (
        <>
            <style jsx>{styles}</style>
            <div className='subscriptions'>
                <div className='subscriptions__calendar'>
                    <Calendar title='subscriptions'/>
                </div>
            </div>
        </>
    );
};

export default UserSubscriptions;