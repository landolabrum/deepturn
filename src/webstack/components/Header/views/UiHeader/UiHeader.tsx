// Relative Path: ./UiHeader.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './UiHeader.scss';

// Remember to create a sibling SCSS file with the same name as this component
interface IUiHeader {
    title?: any;
    subTitle?: string
}
const UiHeader: React.FC<IUiHeader> = ({ title, subTitle }) => {
    const header = useRef<any>();
    const [set, setSet]=useState(false);
    const headerRef = header?.current;
    const initHeader = () =>{
        if(!headerRef || set)return;
            const headerWidth = headerRef.offsetWidth;
            headerRef.style.width = headerWidth;
            const sub=headerRef.children[0]
            sub.classList += " header--sub-title-set"
            setSet(!set);
    }
    useEffect(() => initHeader(), [headerRef, !set]);
    return (
        <>
            <style jsx>{styles}</style>
            {/* {set.toString()} */}
            <div className='header' ref={header}>
                {title}
                {subTitle && (
                    <div className="header--sub-title">
                        {subTitle}
                    </div>
                )}
            </div>
        </>
    );
};

export default UiHeader;