// Relative Path: ./HomeGridItem.tsx
import React from 'react';
import styles from './HomeGridItem.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
interface IHomeGridItem {
    icon?: string;
    title?: string;
    children?: any
}
const HomeGridItem: React.FC<any> = ({ icon, title, children }: IHomeGridItem) => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='home-grid-item'>
                <div className='home-grid-item__header'>
                    {icon && <div className='home-grid-item__icon'>
                        <UiIcon icon={icon} />
                    </div>}
                    <div className='home-grid-item__title'>
                        {title}
                    </div>
                </div>
                <div className='home-grid-item__body home-grid-item__center'>
                    {children}
                </div>
            </div>
        </>
    );
};

export default HomeGridItem;