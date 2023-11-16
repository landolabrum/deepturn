// Relative Path: ./Subscriptions.tsx
import React, { useEffect, useState } from 'react';
import styles from './Subscriptions.scss';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import Calendar from '@webstack/components/Calendar/controller/Calendar';

// Remember to create a sibling SCSS file with the same name as this component

const Subscriptions: React.FC = () => {
    const today = dateFormat(new Date());

    return (
        <>
            <style jsx>{styles}</style>
            {today}<br />
            <Calendar />
        </>
    );
};

export default Subscriptions;