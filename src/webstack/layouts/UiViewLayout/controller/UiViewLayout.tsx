import React, { useEffect } from 'react';
import styles from './UiViewLayout.scss';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useViewState } from '../hooks/useViewState';

export type IView = {
    [key: string]: React.JSX.Element;
};

export interface IViewLayout {
    views?: IView;
    view?: string;
    title?: string;
    showActions?: boolean | IFormField;
    showTitle?: boolean;
}

const UiViewLayout: React.FC<IViewLayout> = ({ views, view, title, showActions = false, showTitle = false }) => {
    const [currentView, setView] = useViewState(views, view);
    const _title = showTitle && title ? keyStringConverter(title) : showTitle && currentView ? typeof currentView === 'string' && keyStringConverter(currentView) : '';
    if (!views || !currentView) return (<UiLoader />);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-view-layout'>
                {_title && (
                    <div className='ui-view-layout__header'>
                        <div className='ui-view-layout__header-title'>{_title}</div>
                    </div>
                )}
                {showActions && views && (
                    <div className='ui-view-layout__actions'>
                        {Object.keys(views).map((key) => <button key={key} onClick={() => setView(key)}>{key}</button>)}
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
