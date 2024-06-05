import React, { useEffect, useRef, useState } from 'react';
import styles from './UiMenuFan.scss';
import { UiIcon } from '../UiIcon/UiIcon';

interface IUiMenuItem {
    icon: string;
    label: string;
}
interface IUiMenu {
    icon: string;
    items: IUiMenuItem[];
    onClick: (item: IUiMenuItem) => void;
}

const UiMenuFan: React.FC<IUiMenu> = ({ icon, items, onClick }) => {
    const distance = 130;
    const [show, setShow] = useState(false);
    const itemsRef = useRef<any>([]);

    const handleClick = () => {
        setShow(prevShow => !prevShow);
    };

    useEffect(() => {
        const updateItems = (isVisible: boolean) => {
            itemsRef.current.forEach((item: any, index: number) => {
                if (item) {
                    const angle = (Math.PI / 2) * (index / (items.length - 1)) - (Math.PI / 2);
                    const x = Math.cos(angle) * -distance;
                    const y = Math.sin(angle) * distance;
                    item.style.transitionDelay = isVisible ? `${index * 100}ms` : '0ms';
                    item.style.opacity = isVisible ? '1' : '0';
                    item.style.filter = isVisible ? 'blur(0)' : 'blur(2px)';
                    item.style.transform = isVisible ? `translate(${x}px, ${y}px) scale(1)` : 'translate(0, 0) scale(0)';
                }
            });
        };

        updateItems(show);
    }, [show, items.length, distance]);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='menu-fan'>
                <div
                    className={`menu-fan__trigger ${show ? 'menu-fan__trigger--show' : ''}`}
                    style={{
                        padding: `${distance * 0.15}px`,
                        bottom: `${distance * 0.2}px`,
                        right: `${distance * 0.2}px`,
                    }}
                    onClick={handleClick}
                >
                    <UiIcon icon={icon} size={distance * 0.35} />
                </div>
                <div
                    className={`menu-fan--items ${show ? 'show' : ''}`}
                    style={{
                        bottom: `${distance * 0.65}px`,
                        right: `${distance * 0.65}px`,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            ref={(el: any) => (itemsRef.current[index] = el)}
                            className="menu-fan--item"
                            style={{
                                padding: `${distance * 0.07}px`,
                            }}
                            onClick={() => onClick(item)}
                        >
                            <UiIcon size={distance * 0.27} icon={item.icon} />
                            <div className='menu-fan--item__label'>{item?.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UiMenuFan;
