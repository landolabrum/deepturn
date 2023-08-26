
// Relative Path: ./UiCollapse.tsx
import React, { useEffect, useState } from 'react';
import styles from './UiCollapse.scss';
import { UiIcon } from '../UiIcon/UiIcon';
import UiButton from '../UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component
interface ICollapse {
    open?: boolean;
    children: React.ReactElement | string | undefined;
    label?: string;
    style?: { [key: string]: string };
    variant?: string,
}
const UiCollapse: React.FC<ICollapse> = ({ open, children, variant, label = "Collapse", style }) => {
    const [oOpen, setOpen] = useState<number>(0);
    const handleOpen = () => {
        if ([0, 1].includes(oOpen)) setOpen(oOpen + 1);
        if (oOpen == 2) setOpen(1);
    }
    const oClzz = (clzz: string) =>{
        switch (oOpen) {
            case 0:
                return clzz;
            case 1:
                return `${clzz} ${clzz}-open`;
            case 2:
                return `${clzz} ${clzz}-closed`;
            default:
                break;
        }
    }
    useEffect(() => {
        if (open === true) setOpen(1);
        if (open === false) setOpen(0);
    }, [open]);
    return (
        <>
            <style jsx>{styles}</style>
            <div
                style={style}
                className={`collapse${variant ? ` collapse-${variant}` : ''}`}
            >
                <div onClick={handleOpen} className={oClzz('collapse__action')}>
                    {label}
                    <UiIcon icon={`fa-chevron-${oOpen == 1 ? "down" : "right"}`}/>
                </div>
                <div className={oClzz('collapse__body')}>
                    {children}
                </div>
            </div>
        </>
    );
};
export default UiCollapse;