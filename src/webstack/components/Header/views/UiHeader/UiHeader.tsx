import React, { useEffect, useRef, useState } from 'react';
import styles from './UiHeader.scss';

interface IUiHeader {
    title?: any;
    subTitle?: string;
}

const UiHeader: React.FC<IUiHeader> = ({ title, subTitle }) => {
    const hdRef = useRef<HTMLDivElement>(null);
    const head = hdRef?.current;
    const [set, setSet] = useState(false);


    const initHeader = async () => {
        if (set == true || !head) return;
        setSet(true);
        const title = head.querySelector('.header--title');
        const sub = head.querySelector('.header--sub-title');
        head.style.width = `${head.offsetWidth}px`;
        head.style.minHeight = `${Number(head.offsetHeight / 2)}px`;
        title?.classList.add("header--title-set");
        sub?.classList.add("header--sub-title-set");

        console.log("[ initHeader ]", { c: sub?.classList });
        return;
    };


useEffect(() => {
    !set && initHeader();
    while (!set) {
        setTimeout(initHeader, 500);
        break;
    }
}, [head]);
    return (
        <>

            <style jsx>{styles}</style>
            <div className='header' ref={hdRef}>
                <div className="header--title">
                    {title}
                </div>
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
