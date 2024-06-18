import React, { useEffect, useState } from "react";

const useFocus = (ref: React.MutableRefObject<HTMLElement | null>, defaultState: boolean = false) => {
    const [focused, setFocusedState] = useState<boolean>(defaultState);

    useEffect(() => {
        if (!ref.current) return;

        const onFocus = () => setFocusedState(true);
        const onBlur = () => setFocusedState(false);

        ref.current.addEventListener("focus", onFocus);
        ref.current.addEventListener("blur", onBlur);

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("focus", onFocus);
                ref.current.removeEventListener("blur", onBlur);
            }
        };
    }, [ref]);

    const setFocused = (shouldFocus: boolean = true) => {
        // alert(`SH F: ${shouldFocus.toString()}`)
        if (shouldFocus && ref.current) {
            ref.current.focus();
        } else if (!shouldFocus && ref.current) {
            ref.current.blur();
        }
    };

    return [focused, setFocused];
};

export default useFocus;
