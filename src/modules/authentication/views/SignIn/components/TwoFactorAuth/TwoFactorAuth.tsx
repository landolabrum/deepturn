import React, { useEffect, useState } from 'react';
import UiInput from '@webstack/components/UiInput/UiInput';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import styles from "./TwoFactorAuth.scss";
 
type TwoFactorProps = {
    code: string;
    setCode: (e:any)=>void;
};

const TwoFactorInput: React.FC<TwoFactorProps> = ({code, setCode}) => {
    const defaultValue = "------";
    const [submitted, setSubmitted] = useState(false);
    const [focusIndex, setFocusIndex] = useState(0);
    function handlePaste(e: any) {
        const toPaste = e.clipboardData.getData("text");
        setCode(toPaste.substring(0, 6))
    }
    function handleModifierKey(key: string, index: number): any {
        switch (key) {
            case "Backspace":
                const first = [defaultValue, 0];
                const between = [code.substring(-1, index) + "-" + code.substring(index + 1), index - 1];
                const last = [code.substring(- 1), index - 1];
                return index === 0 ? first : index < code.length ? between : last;;
            case "Delete":
                return [defaultValue, 0];
            default:
                false;
        }
    }
    function handleKey(e: any) {
        const key = e.key;
        const isNum = !Number.isNaN(Number(key.slice(-1)));
        const index = parseInt(e.target.name.split("-")[1]);
        // console.log("[ EVENT ] ", { key: e.key, index: index })
        if (isNum) {
            const newCode = index === 0 ? key + code.substring(1) : code.substring(-1, index) + key + code.substring(index + 1);
            setCode(newCode);
            setFocusIndex(index + 1);
        }
        if (!isNum) {
            const newCodeIndex = handleModifierKey(key, index);
            newCodeIndex && setCode(newCodeIndex[0]);
            newCodeIndex && setFocusIndex(newCodeIndex[1]);
        }

    }
    useEffect(() => { }, [focusIndex])
    return (
        <>
        <style jsx>{styles}</style>
            {!submitted ? (
                <AdaptGrid xs={6} gap={10} focus={["input", focusIndex]}>
                    {Array.from(code).map((v, i) => {
                        return <span key={i} className='two-factor-auth__input'>
                            <UiInput variant="center" name={`tfa-${i}`} value={v} type="tel" onKeyDown={handleKey} onPaste={handlePaste} />
                        </span>;
                    })}
                </AdaptGrid>
            ) : (
                <p>2FA code submitted successfully!</p>
            )}
        </>
    );
};

export default TwoFactorInput;