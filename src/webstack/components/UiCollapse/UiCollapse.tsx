
// Relative Path: ./UiCollapse.tsx
import React, { useEffect, useState } from 'react';
import styles from './UiCollapse.scss';
import { UiIcon } from '../UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
interface ICollapse {
    open?: boolean | 'opened';
    onToggle?: (e:any)=>void;
    children: React.ReactElement | string | undefined;
    label?: string | React.ReactElement;
    style?: { [key: string]: string };
    variant?: string,
    id?: string,
}
const UiCollapse: React.FC<ICollapse> = ({ id, open, children, variant, label = "Collapse", style, onToggle }) => {
    let _style = { ...style, height: undefined };
    let elStyle = {}
    if (style?.height) elStyle = { height: style.height };
    const [oOpen, setOpen] = useState<number | 'opened'>(0);

    const handleOpen = () => {
        let openState = 0;
        if (oOpen == 'opened')openState = 2;
        if (oOpen != 'opened' && [0, 1].includes(oOpen)) openState = (oOpen + 1);
        if (oOpen == 2) openState = 1;
        onToggle && onToggle(openState);
        setOpen(openState)
    }
    const createClass = (clzz: string) => {
        switch (oOpen) {
            case 'opened':
                return `${clzz} ${clzz}__opened ${variant ? ` ${clzz}__${variant}` : ''}`;
            case 0:
                return `${clzz} ${variant ? ` ${clzz}__${variant}` : ''}`;
            case 1:
                return `${clzz} ${clzz}__open ${variant ? ` ${clzz}__${variant}` : ''}`;
            case 2:
                return `${clzz} ${clzz}__close ${variant ? ` ${clzz}__${variant}` : ''}`;
            default:
                break;
        }
    }
    useEffect(() => {
        if (open === 'opened') setOpen(open);
        if (open === true) setOpen(1);
        if (open === false) setOpen(0);
    }, [open]);
    return (
        <>
            <style jsx>{styles}</style>
            <div
                id={id}
                style={_style}
                className={`${createClass('collapse')}`}
            >
                <div onClick={handleOpen} className={createClass('collapse__action')} style={elStyle}>
                    {label}
                    <UiIcon icon={`fa-chevron-${oOpen == 1 ? "down" : "right"}`} />
                </div>
                <div className={createClass('collapse__body')}>
                    {children}
                </div>
            </div>
        </>
    );
};
export default UiCollapse; 