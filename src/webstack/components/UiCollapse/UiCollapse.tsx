
// Relative Path: ./UiCollapse.tsx
import React, { useEffect, useState } from 'react';
import styles from './UiCollapse.scss';
import { UiIcon } from '../UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
interface ICollapse {
    open?: boolean;
    children: React.ReactElement | string | undefined;
    label?: string;
}
const UiCollapse: React.FC<ICollapse> = ({ open, children, label="Collapse" }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    useEffect(() => {
        if(open)setOpen(open);
    }, []);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='collapse'>
                <div className='collapse__button' onClick={() => setOpen(!isOpen)}>
                    <div>
                        {label}
                    </div>
                    <UiIcon icon={`fa-chevron-${isOpen ? "down" : "right"}`} />
                </div>
                <div className={`collapse__content ${isOpen ?"collapse__content-open":""}`}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default UiCollapse;