import { useEffect, useState } from "react";

const useClass = (cls: string, type: string, variant?: string) => {
    const [classState, setClassState] = useState<string>(cls);
    useEffect(() => {
        let newClass = cls;
        if (variant) {
            newClass += ` ${cls}__${variant}`;
        }
        if (type) {
            newClass += ` ${cls}__${type}`;
        }
        setClassState(newClass);
    }, [cls, variant, type]);

    return classState;
};
export default useClass;