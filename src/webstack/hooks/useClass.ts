import { useEffect, useState } from "react";

const useClass = (cls: string, type?: string, variant?: string, extras?:string[]| undefined) => {
    const [classState, setClassState] = useState<string>(cls);
    useEffect(() => {
        let newClass = cls;
        if (variant) {
            newClass += ` ${cls}__${variant}`;
        }
        if (type) {
            newClass += ` ${cls}__${type}`;
        }
        if(extras){
            const extraClasses = () => extras.map((extra: string)=>` ${cls}__${extra}`);
            newClass += ` ${cls}__${extraClasses}`
        }
        setClassState(newClass);
    }, [cls, variant, type]);

    return classState;
};
export default useClass;