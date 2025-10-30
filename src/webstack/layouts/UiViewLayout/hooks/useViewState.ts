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
            if (prevHistory.length > 1) {
                const newHistory = prevHistory.slice(0, -1);
                const previousView = newHistory[newHistory.length - 1];
                setViewState(views[previousView]);
                return newHistory;
            }
            return prevHistory;
        });
    };

    useEffect(() => {
        if (!initialKey || !views?.[initialKey]) return;
        const keyAsString = String(initialKey);
        if (history[history.length - 1] !== keyAsString) {
            // Inline the logic to avoid depending on setView in deps
            setViewState(views[keyAsString]);
            setHistory((prevHistory) => [...prevHistory, keyAsString]);
        }
    }, [views, initialKey, history]);

    return { view, setView, last: history[history.length - 1], goBack };
};
