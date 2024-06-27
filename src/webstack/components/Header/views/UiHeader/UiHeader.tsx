import React, { useEffect, useRef, useState } from 'react';
import styles from './UiHeader.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/core/environment';
import useWindow from '@webstack/hooks/useWindow';

interface IUiHeader {
    title?: any;
    subTitle?: string;
}
const mobileNavSize = 50;
const UiHeader: React.FC<IUiHeader> = ({ title, subTitle }) => {
    const hdRef = useRef<HTMLDivElement>(null);
    const head = hdRef?.current;
    const [set, setSet] = useState(false);
    const {width}=useWindow();
    
    const initHeader = async () => {
        const titleRef:any = head?.querySelector('.header--title');
        const subRef:any = head?.querySelector('.header--sub-title');
        const isMobile = width < 1100;
        const w = {
            window: width,
            head: head?.offsetWidth,
            title: titleRef?.offsetWidth,
            sub: subRef?.offsetWidth
        };

        if (set == true || !head) return;
        if(!w?.title || set)return;
        setSet(true);
        if(isMobile){
            const e = {
                smallTitle: Boolean(w.title > width - mobileNavSize),
                sm: width - mobileNavSize - w.title,
            }
            console.log("[ isMobile ]",{w,e})
        }
        // console.log({ow:head?.offsetWidth, width, sub, subWidth: sub?.offsetWidth})
        // head.style.width = `${head.offsetWidth}px`;
        // head.style.minHeight = `${Number(head.offsetHeight / 2)}px`;
        // _title?.classList.add("header--title-set");
        // sub?.classList.add("header--sub-title-set");
    };


useEffect(() => {
    !set && initHeader();
    while (!set) {
        setTimeout(initHeader, 500);
        break;
    }
}, [hdRef?.current]);
    return (
        <>

            <style jsx>{styles}</style>
            <div className='header' ref={hdRef}>
                <div className="header--title">
                    <UiIcon icon={`${environment.merchant.name}-logo`}/>
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
