import React from 'react';
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
    const handleDrag = (event: React.MouseEvent<HTMLDivElement>) => {
        // Implement dragging logic here to adjust `percent`
    };

    const knobStyle = {
        background: `conic-gradient(${style?.color ?? '#ff3300'} 0% ${percent}%, ${style?.backgroundColor ?? '#000'} ${percent}% 100%)`
    };

    return (<>
    <style jsx>{styles}</style>
        <div className='knob-container'>
            <div className='knob' style={knobStyle} onMouseDown={handleDrag}>
                {label && <span className='label'>{label}</span>}
            </div>
        </div>
        </>
    );
};

export default UiKnob;
