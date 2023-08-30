// Relative Path: ./AccountCurrentMethod.tsx
import React, { useState } from 'react';
import styles from './AccountCurrentMethod.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const AccountCurrentMethod: React.FC = ({ method }: any) => {
    const mm = String(method.card.exp_month).length == 1 ? `0${method.card.exp_month}` : method.card.exp_month;
    const [clicked, setClicked] = useState<number>(0);

    const handleClick = () => {
        // if(!clicked)setClicked(true);
        if ([0, 1].includes(clicked)) setClicked(clicked + 1);
        if (clicked == 2) setClicked(0);
    };
    const states = [
        '',
        'account-methods__method-content-show',
        'account-methods__method-content-hide'
    ]
    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-current-method' onClick={handleClick}>
                <div className={`account-current-method__content ${states[clicked]}`}>
                    <div className='account-methods__method-info'>
                        <UiIcon icon={method.card.brand} />
                        {`**** **** **** ${method.card.last4}`}
                    </div>
                    <div className='account-methods__method-exp'>
                        {mm} / {method.card.exp_year}
                    </div>
                </div>
                <div className={`account-methods__delete`}>
                    <UiIcon icon='fa-trash-can' />
                </div>
            </div>
        </>
    );
};

export default AccountCurrentMethod;