import React, { useEffect } from 'react';
import styles from './UiViewLayout.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useViewState } from '../hooks/useViewState';
import UiButton from '@webstack/components/UiButton/UiButton';

export type IView = {
    [key: string]: React.JSX.Element;
};

export interface IViewLayout {
    views?: IView;
    currentView?: string;
    backBtn?: boolean;
    title?: string;
    actions?: boolean | string[]; // Can be a boolean or an array of strings
    showTitle?: boolean;
    onViewChange?:(e:any)=>void;
}

const UiViewLayout: React.FC<IViewLayout> = ({
    views,
    currentView,
    onViewChange: onChange,
    title,
    actions = false,
    showTitle = false,
    backBtn = false
}) => {
    const { view, setView, goBack, last } = useViewState(views, currentView);

    const handleViewChange = (newView: string) => {
        if (!newView) return;
        setView(newView);
        onChange?.(newView);
    };
    
    useEffect(() => {}, [views]);
    if (!views || !view || currentView == 'loading') return <UiLoader />;

    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-view-layout'>
                {/* <div className='dev'>{JSON.stringify({currentView, last, })}</div> */}
                {backBtn && last !== currentView && (
                    <div className='back-btn'>
                        <div>
                            <UiButton traits={{beforeIcon:"fa-chevron-left"}} variant='flat' onClick={goBack}>Back</UiButton>
                        </div>
                    </div>
                )}
                {showTitle && (
                    <div className='ui-view-layout__header'>
                        <div className='ui-view-layout__header-title'>{title}</div>
                    </div>
                )}
                <div className='ui-view-layout__view'>
                    {view || <div>View not found</div>}
                </div>
            </div>
        </>
    );
};

export default UiViewLayout;
