import React, { useEffect } from 'react';
import styles from './UiViewLayout.scss';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useViewState } from '../hooks/useViewState';
import UiButton from '@webstack/components/UiButton/UiButton';

export type IView = {
    [key: string]: React.JSX.Element;
};

export interface IViewLayout {
    views?: IView;
    view?: string;
    title?: string;
    showActions?: boolean | string[]; // Can be a boolean or an array of strings
    showTitle?: boolean;
}

const UiViewLayout: React.FC<IViewLayout> = ({ views, view, title, showActions = false, showTitle = false }) => {
    const [currentView, setView] = useViewState(views, view);
    const _title = showTitle && title ? keyStringConverter(title) : showTitle && currentView ? typeof currentView === 'string' && keyStringConverter(currentView) : '';
    useEffect(() => {}, [view]);

    if (!views || !currentView) return (<UiLoader />);

    // Determine which actions to display based on showActions prop
    const actionButtons = Array.isArray(showActions) ?
        showActions.filter(action => Object.keys(views).includes(action)).map(action => (
            <div key={action} className='ui-view-layout__actions-item'>
                <UiButton disabled={action === view} onClick={() => setView(action)}>{action}</UiButton>
            </div>
        )) : [];
            
    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-view-layout'>
                {_title && (
                    <div className='ui-view-layout__header'>
                        <div className='ui-view-layout__header-title'>{_title}</div>
                    </div>
                )}
                {showActions && Array.isArray(showActions) && (
                    <div className='ui-view-layout__actions'>
                        {actionButtons}
                    </div>
                )}
                <div className='ui-view-layout__view'>
                    {currentView || <div>View not found</div>}
                </div>
            </div>
        </>
    );
};

export default UiViewLayout;
