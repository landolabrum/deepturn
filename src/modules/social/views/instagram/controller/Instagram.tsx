// Relative Path: ./Instagram.tsx
import React, { useState } from 'react';
import styles from './Instagram.scss';
import InstagramSignIn from '../views/InstagramSignIn/InstagramSignIn';
import UiViewLayout from '@webstack/layouts/UiViewLayout/UiViewLayout';

// Remember to create a sibling SCSS file with the same name as this component

const Instagram: React.FC<any> = ({ current }: { current?: string }) => {
    const [view, setView] = useState<string | undefined>('auth');

    const views = {
      auth: <InstagramSignIn />,
    };
    return (
        <>
            <style jsx>{styles}</style>
            <div className='instagram'>
                <div className='instagram-header'>
                    <h1 className='instagram-header--title'>Instagram</h1>
                </div>
                <div className='instagram-body'>
                {UiViewLayout({views,view})}
                </div>
            </div>
        </>
    );
};

export default Instagram;