
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
const UiCollapse: React.FC<ICollapse> = ({ open, children, label = "Collapse" }) => {
    const [isOpen, setOpen] = useState<number>(0);
    const handleOpen = () =>{
        if([0,1].includes(isOpen) )setOpen(isOpen + 1);
        if(isOpen == 2)setOpen(1);
    }
    return (
        <>
            <style jsx>{styles}</style>
            <div className={`collapse ${isOpen == 1 ? "collapse-open" : isOpen == 2?"collapse-closed":""}`}>
                <div className={`collapse__button`} onClick={handleOpen}>
                    {label}
                    <UiIcon icon={`fa-chevron-${isOpen == 1 ? "down" : "right"}`} />
                </div>
                <div className={`collapse__content`}>
                    {children}
                </div>
            </div>
        </>
    );
};
export default UiCollapse;