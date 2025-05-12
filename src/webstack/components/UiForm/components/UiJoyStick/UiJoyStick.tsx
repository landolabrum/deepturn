import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './UiJoyStick.scss'; // Adjust the import according to your actual stylesheet path

interface IUiJoyStickProps {
  onMove?: (x: number, y: number) => void;
}

const UiJoyStick: React.FC<IUiJoyStickProps> = ({ onMove }) => {
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const joystickRef = useRef<any>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<any>(null);

  useEffect(() => {
    const transition = 500;

    const smoothTransition = (from: [number, number], to: [number, number], duration: number) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const newX = from[0] + (to[0] - from[0]) * progress;
        const newY = from[1] + (to[1] - from[1]) * progress;
        setPos([newX, newY]);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = joystickRef.current.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      if (!joystickRef.current || !thumbRef.current) return;

      if (x > width / 2 || y > height / 2 || x < -width / 2 || y < -height / 2) {
        return;
      } else {
        setPos([
          Math.max(Math.min(x, width / 2), -width / 2),
          Math.max(Math.min(y, height / 2), -height / 2),
        ]);
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
          if (onMove) {
            onMove(x, y);
          }
        }, 1000);
      }
    };

    const handleMouseUp = () => {
      smoothTransition(pos, [0, 0], transition); // Move back to center
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = joystickRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;

      if (!joystickRef.current || !thumbRef.current) return;

      if (x > rect.width / 2 || y > rect.height / 2 || x < -rect.width / 2 || y < -rect.height / 2) {
        smoothTransition([x, y], [0, 0], transition); // Move back to center
      } else {
        setPos([
          Math.max(Math.min(x, rect.width / 2), -rect.width / 2),
          Math.max(Math.min(y, rect.height / 2), -rect.height / 2),
        ]);
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
          if (onMove) {
            onMove(x, y);
          }
        }, 1000);
      }
    };

    const handleTouchEnd = () => {
      smoothTransition(pos, [0, 0], transition); // Move back to center
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleTouchStart = () => {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    if (thumbRef.current) {
      thumbRef.current.addEventListener('mousedown', handleMouseDown as EventListener);
      thumbRef.current.addEventListener('touchstart', handleTouchStart as EventListener);
    }

    return () => {
      if (thumbRef.current) {
        thumbRef.current.removeEventListener('mousedown', handleMouseDown as EventListener);
        thumbRef.current.removeEventListener('touchstart', handleTouchStart as EventListener);
      }
    };
  }, [pos, onMove]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='joystick__container'>
        <div ref={joystickRef} className='joystick'>
          <div
            ref={thumbRef}
            className='joystick-thumb'
            style={{ transform: `translate(${pos[0]}px, ${pos[1]}px)` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default UiJoyStick;
