import React, { useEffect, useState } from 'react';
import styles from './UiViewLayout.scss';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

export type IView = {
    [key: string]: React.JSX.Element;
}
export interface IViewLayout {
    views?: IView; // Changed from IView[] to IView
    view?: string;
    title?: string;
    showActions?: boolean | IFormField;
    showTitle?: boolean;
}
const UiViewLayout: React.FC<IViewLayout> = (props:IViewLayout) => {
    const { views, view, showActions, title,showTitle } = props;
    const [current, setView] = useState<string | undefined>();
    const handleViews = () => views && setView(view || Object.keys(views)[0]);

    
    useEffect(() => {
        handleViews();
    }, [handleViews]);
    

    const _views = views && current && Object.entries(views);
    const _title = showTitle !== false && (
        title && keyStringConverter(title)
        ) || (view && keyStringConverter(view)
        ) || (current && keyStringConverter(current)
    );
    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-view-layout'>
                {_title && (
                    <div className='ui-view-layout__header'>
                    <div className='ui-view-layout__header-title'>
                        {_title}
                    </div>
                    </div>
                )}
                {_views && showActions && <div className='ui-view-layout__actions'>
                    {_views.map(([key,value], index)=>(JSON.stringify(key)))}
                </div>}
                <div className='ui-view-layout__view'>
                    {_views && views[current]}
                </div>
            </div>
        </>
    );
};

export default UiViewLayout;
