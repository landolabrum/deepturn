// UiRightClick.tsx
import { useModal } from '../modal/contexts/modalContext';
import React, { ReactElement, useState } from 'react';
import styles from './UiRightClick.scss';

interface UiRightClickProps {
  children: ReactElement;
}

export default function UiRightClick(props: UiRightClickProps) {
  const [lastTap, setLastTap] = useState(0);
  const { openModal } = useModal();
  const isModal = true;

  const DefaultContent = () => {
    return (
      <>
        <style jsx>{styles}</style>
        <div className='right-click right-click-default'>
          <div className='right-click-header'>
            header
          </div>
          <div className='right-click-body'>
            body - Lorem Ipsum Quazar Democrat poo
          </div>
        </div>
      </>
    );
  };

  const handleClick = () => {
    // Normal click logic here if needed
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isModal) openModal(<><DefaultContent /></>);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    setLastTap(currentTime);

    if (e.touches.length === 2) {
      if (isModal) openModal(<><DefaultContent /></>);
    }
  };

  return (
    <div
      // onClick={handleClick}
      // onContextMenu={handleRightClick}
      // onTouchStart={handleTouchStart}
    >
      {props.children}
    </div>
  );
}
