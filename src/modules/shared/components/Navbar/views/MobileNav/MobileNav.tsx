import React from 'react';
import styles from './MobileNav.scss';
import { IRoute } from '../../data/routes';
import UiButton from '@webstack/components/UiButton/UiButton';

interface IMobileNav {
    routes: IRoute[],
    handleClick: (e: any) => void,
    onBack?: (e: any) => void,
};

const MobileNav: React.FC<IMobileNav> = ({ routes, handleClick, onBack }): React.ReactElement => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='navbar__mobile'>
                {onBack && <div className='navbar__mobile--actions'>
                    <div>
                        <UiButton
                            variant='inherit'
                            traits={{ beforeIcon: 'fa-chevron-left' }}
                            onClick={onBack}>back</UiButton>
                    </div>
                </div>}
                <div className='navbar__mobile--content'>
                    {[...routes].reverse().map((route: IRoute, key: number) => {
                        if (route?.hide) return null;
                        return (
                            <span key={key}>
                                <UiButton
                                    onClick={() => handleClick(route)}
                                    traits={{ beforeIcon: route?.icon }}
                                >
                                    {route.label}{route?.href == '/cart' ? 'cart' : ''}
                                </UiButton>
                            </span>
                        )
                    })}
                </div>
            </div>
        </>
    );
};

export default MobileNav;
