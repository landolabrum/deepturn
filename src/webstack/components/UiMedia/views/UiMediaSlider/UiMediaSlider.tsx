import React, { useState, useEffect } from 'react';
import styles from './UiMediaSlider.scss';

interface IMediaSliderPt {
    time: number; // in milliseconds
    onPoint: (pointResponse: any) => any;
    value?: any;
    backgroundColor?: string;
}
interface IMediaSliderProps {
    atPoints?: IMediaSliderPt[];
    duration: number; // in milliseconds
    start: boolean;
    persistent?: boolean; // default is false
    loop?: boolean; // new prop to control looping
    backgroundColors?: string[]; // optional prop for background colors
  }
  
  const UiMediaSlider: React.FC<IMediaSliderProps> = ({
    atPoints,
    duration,
    start,
    persistent = false,
    loop = false, // Handle the loop prop
    backgroundColors = ['#ccc'],
  }) => {

    const [sliderProgress, setSliderProgress] = useState(0); // in milliseconds
    const [triggeredPoints, setTriggeredPoints] = useState<number[]>([]);

    useEffect(() => {
        let interval: number | undefined; // Declare as number | undefined
        if (start && duration) {
            const updateInterval = 10;
            interval = window.setInterval(() => { // Use window.setInterval to get the correct type
                setSliderProgress(prevProgress => {
                    const newProgress = prevProgress + updateInterval;
                    return newProgress <= duration ? newProgress : duration;
                });
            }, updateInterval);
        } else {
            if (interval !== undefined) clearInterval(interval); // Check if interval is not undefined
            setSliderProgress(0);
            setTriggeredPoints([]);
        }

        return () => {
            if (interval !== undefined) clearInterval(interval); // Check if interval is not undefined
        };
    }, [start, duration]);
    useEffect(() => {
        // const pointsOnPoints = atPoints&&atPoints.map((point:any)=> point)

        atPoints?.forEach((point, index) => {
            if (sliderProgress >= point.time && !triggeredPoints.includes(index)) {
                point?.onPoint(point.value); // Sending the time as part of the response
                if (!persistent) {
                    setTriggeredPoints(prevPoints => [...prevPoints, index]);
                }
            }
        });
    }, [sliderProgress, atPoints, triggeredPoints, persistent]);
    useEffect(() => {
        if (sliderProgress >= duration && loop) {
          // Reset progress and triggeredPoints if loop is true and duration is reached
          setSliderProgress(0);
          setTriggeredPoints([]);
        }
      }, [sliderProgress, duration, loop]);
    const sliderWidthPercentage = (sliderProgress / duration) * 100; // convert progress to percentage for styling

    // Generate linear gradient style for the slider track
    const gradient = backgroundColors.length > 1
        ? `linear-gradient(to right, ${backgroundColors.join(', ')})`
        : backgroundColors[0]; // single color or gradient

    const sliderTrackStyle = {
        width: `${sliderWidthPercentage}%`,
        background: gradient, // apply linear gradient or single color
    };

    return (
        <>
            <style jsx>{styles}</style>
            <div className="ui-media-slider">
                <div className="media-slider">
                    <div className='slider-track ' style={sliderTrackStyle}>
                        {/* Customize your slider track here */}
                    </div>
                </div>
                <div className="points">
                    {atPoints && atPoints.map((point, index) => (
                        <div
                            key={index}
                            className="point"
                            style={
                                point?.backgroundColor ? {
                                    left: `${(point.time / duration) * 100}%`,
                                    backgroundColor: point.value
                                } : { left: `${(point.time / duration) * 100}%` }
                            } // Position point based on time
                            onClick={() => point.onPoint(point.value)}
                        >
                            {/* Render point UI here */}
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UiMediaSlider;
