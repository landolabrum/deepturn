import React, { useEffect, useState } from 'react';
import styles from './UiViewLayout.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useViewState } from '../hooks/useViewState';
import UiButton from '@webstack/components/UiButton/UiButton';

export type IView = {
    [key: string]: React.JSX.Element;
};

export interface IViewLayout {
    views?: IView;
    view?:React.ReactElement | string;
    currentView?: string;
    backBtn?: boolean;
    title?: string;
    actions?: boolean | string[]; // Can be a boolean or an array of strings
    showTitle?: boolean;
    onChange?:(e:any)=>void;
    variant?:"anchor"
}

const UiViewLayout: React.FC<IViewLayout> = ({
    views,
    currentView,
    onChange,
    view,
    title,
    actions = false,
    showTitle = false,
    backBtn = false,
    variant
}) => {
    const { view: _view, setView: handleView, goBack, last } = useViewState(views, currentView);
    const changeView = (newView: string) => {
        if (!newView) return;
        handleView(newView);
        onChange?.(newView);
    };

    
    if (!views || !_view ) return <UiLoader position='fixed' />;
    
    return (
        <>
            <style jsx>{styles}</style>
            <div className={`ui-view-layout ${variant?`ui-view-layout--${variant}`:''}`}>{currentView == 'loading' && <UiLoader position='fixed' />}
                {Boolean(backBtn && last !== 'start' )&&(
                    <div className='back-btn'>
                        <div>
                            <UiButton traits={{beforeIcon:"fa-chevron-left"}} variant='flat' onClick={goBack}>Back</UiButton>
                        </div>
                    </div>
                )}
                {showTitle  && last !== 'start'&& (
                    <div className='ui-view-layout__header'>
                        <div className='ui-view-layout__header-title'>{title}</div>
                    </div>
                )}
                <div data-view={currentView} className='ui-view-layout__view'>
                    {view || _view || <div>View not found</div>}
                </div>
            </div>
        </>
    );
};

export default UiViewLayout;
