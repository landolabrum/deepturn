// Relative Path: ./Instagram.tsx
import React, { useState } from 'react';
import styles from './Instagram.scss';
import InstagramAuthenticate from '../views/InstagramAuthenticate/InstagramAuthenticate';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import { useUser } from '~/src/core/authentication/hooks/useUser';


// Remember to create a sibling SCSS file with the same name as this component

const Instagram: React.FC<any> = ({ current }: { current?: string }) => {
    const [view, setView] = useState<string | undefined>('signin');
    const user = useUser();
    const views = {
        signin: <InstagramAuthenticate {...user} />,
    };
    const viewProps = { views, currentView: view };
    return (
        <>
            <style jsx>{styles}</style>
            {/* {JSON.stringify(user?.metadata?.user)} */}
            <div className='instagram'>
                <div className='instagram--view'>
                    <UiViewLayout
                        {...viewProps}
                    />
                </div>
            </div>
            <div className='instagram__tandc'>
                Not Responsible
            </div>
        </>
    );
};

export default Instagram;