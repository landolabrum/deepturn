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
    const [set, setSet] = useState(false);
    const headerRef = header?.current;
    const sub = headerRef?.children[0];
    const initHeader = () => {
        if (!headerRef || set) return;
        headerRef.style.width = `${headerRef.offsetWidth}px`;
        headerRef.style.minHeight = `${headerRef.offsetHeight}px`;
        sub.classList += " header--sub-title-set"
        setSet(!set);
    }
    useEffect(() => {
        initHeader();
        // if(Array(sub?.classList).length > 2)console.log(sub?.classList?.includes("header--sub-title-set"))
    }, [!set, sub?.classList]);
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