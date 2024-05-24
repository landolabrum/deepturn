// Relative Path: ./AdminMesenger.tsx
import React from 'react';
import styles from './AdminMesenger.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/core/environment';

// Remember to create a sibling SCSS file with the same name as this component

const AdminMesenger: React.FC = () => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='admin-mesenger'>
                <div className='admin-mesenger__header'>
                    <div className='admin-mesenger__header--icon'>
                        <UiIcon icon={`${environment.merchant.name}-logo`} />
                    </div>
                    Messenger

                </div>
            </div>
        </>
    );
};

export default AdminMesenger;