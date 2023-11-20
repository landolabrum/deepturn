// Relative Path: ./MobileNav.tsx
import React, { useEffect } from 'react';
import styles from './MobileNav.scss';
import { IRoute } from '../../data/routes';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component
interface IMobileNav {
    routes: IRoute[],
    handleClick: (e: any) => void,
    onBack?: (e: any) => void,
};
const MobileNav: React.FC<IMobileNav> = ({ routes, handleClick, onBack, }) => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='navbar__mobile'>
                {onBack && <div className='navbar__mobile--actions'>
                    <div>
                        <UiButton
                            variant='flat'
                            traits={{ beforeIcon: 'fa-chevron-left' }}
                            onClick={onBack}>back</UiButton>
                    </div>
                </div>}
                <div className='navbar__mobile--content'>
                    {routes && routes.map((route: IRoute, key: number) => (
                        <span key={key}>
                            <UiButton
                                onClick={() => handleClick(route)}

                            >{route.label}</UiButton>
                        </span>
                        //   <div
                        //     key={key}
                        //     className={`nav__nav-item nav__nav-item--${route?.label}`}
                        //   >
                        //     <div className='nav__nav-item__label'>
                        //       {route.label}
                        //     </div>
                        //   </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MobileNav;