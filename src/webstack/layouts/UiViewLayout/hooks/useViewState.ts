import React, { useEffect, useState } from "react";

export const useViewState = (views?: any, initialKey?: string | number): [React.ReactElement | string | undefined, (viewKey: string | number) => void] => {
    const [view, setViewState] = useState<React.ReactElement | string | undefined>();
    const setView = (viewKey: number | string): void => {
        const keyAsString = String(viewKey);
        if (views && views[keyAsString]) {
            setViewState(views[keyAsString]);
        }
    };

    useEffect(() => {
        const initialView = initialKey && views[initialKey] ? views[initialKey] : views ? views[0] : undefined;
        setViewState(initialView);
    }, [views, initialKey, setViewState]);


    return [view, setView];
};
