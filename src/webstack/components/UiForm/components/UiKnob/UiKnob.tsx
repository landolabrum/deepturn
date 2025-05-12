import React, { useState } from 'react';
import styles from './UiKnob.scss';

type IRangeStyle = {
    glow?: boolean;
    color?: string;
    backgroundColor?: string;
};

interface IKnob {
    percent: number;
    setPercent?: (percent: number) => void;
    style?: IRangeStyle;
    label?: string;
}

const UiKnob: React.FC<IKnob> = ({ percent, setPercent, style, label }) => {
    const [value,setValue]=useState<number|undefined>()
    const handleDrag = (event: any) => {
        const {value}=event.target;
        
        setValue(Number(value))
        // Implement dragging logic here to adjust `percent`
    };

    const knobStyle = {
        background: `conic-gradient(${style?.color ?? '#ff3300'} 0% ${percent}%, ${style?.backgroundColor ?? '#000'} ${percent}% 100%)`
    };

    return (<>
    <style jsx>{styles}</style>
    {value}
        <div className='knob-container'>
            <input className='knob' style={knobStyle} onMouseDown={handleDrag} value={value||percent} onMouseUp={()=>value&&setPercent?.(value)}>
                {label && <span className='label'>{label}</span>}
            </input>
        </div>
        </>
    );
};

export default UiKnob;
