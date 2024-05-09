import React, { useEffect, useState } from "react";

export const useViewState = (views?: any, initialKey?: string | number) => {
    const [history, setHistory] = useState<string[]>([]);
    const [view, setViewState] = useState<React.ReactElement | string>();

    const setView = (viewKey: number | string): void => {
        const keyAsString = String(viewKey);
        if (views && views[keyAsString]) {
            setViewState(views[keyAsString]);
            setHistory((prevHistory) => [...prevHistory, keyAsString]);
        }
    };

    const goBack = () => {
        setHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            if (newHistory.length > 1) {
                newHistory.pop(); // Remove the current view
                setView(newHistory[newHistory.length - 1]);
            }
            return newHistory;
        });
    };

    useEffect(() => {
        if (initialKey && views?.[initialKey]) {
            setView(initialKey);
        }
    }, [initialKey, views]);

    return { view, setView, last: history[history.length - 2], goBack };
};
