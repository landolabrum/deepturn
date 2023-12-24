import React, { useContext, useEffect, useRef, useState } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss"; // or use your preferred way of styling
import { ModalContext, ModalContextType } from '../contexts/modalContext';
import useClass from '@webstack/hooks/useClass';
import UiButton, { IButton } from '@webstack/components/UiButton/UiButton';
import useMouse from '@webstack/hooks/interfaces/useMouse/useMouse';

const ModalOverlay: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const context = useContext<ModalContextType | undefined>(ModalContext);

  const { isModalOpen, closeModal, modalContent }:any = context;
  let confirm = modalContent?.confirm;
  let children = confirm && ' ' || modalContent?.children || modalContent;
  const {position}  = useMouse();

  // Always call hooks unconditionally
  const modalOverlayClass = useClass('modal__overlay', undefined, modalContent?.variant || undefined);
  const modalClass = useClass('modal', undefined, modalContent?.variant || undefined);
  const modalContentClass = useClass('modal__content', undefined, modalContent?.variant || undefined);
  const modalHeaderClass = useClass('modal__header', undefined, modalContent?.variant || undefined);
  const modalBodyClass = useClass('modal__body', undefined, modalContent?.variant || undefined);

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });




  let title = modalContent?.title;



  const stopDrag = () => {
    setIsDragging(false);
  };

 
  const startDrag = (e: React.MouseEvent) => {
    setStartPosition({ x: position.x, y: position.y }); // Use current mouse position
    setIsDragging(true);
  };

  useEffect(() => {
    if (isDragging && modalRef.current) {
      const dx = position.x - startPosition.x;
      const dy = position.y - startPosition.y;
      modalRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      // console.log('[ modalRef.current.children ]',modalRef.current.children)
    }
  }, [position.x, position.y, startPosition, isDragging]);

  if (!context) {
    return <div>Modal context not available</div>;
  }
  if (!isModalOpen) {
    return null;
  }
  return (
    <>
      <style jsx>{styles}</style>

      <div onClick={closeModal} className={modalOverlayClass} />
      <div 
      ref={modalRef}
      onDoubleClick={startDrag} onClick={stopDrag} 
      // onMouseMove={(e) => {if (isDragging) {console.log('[ isDraging (54)]', isDragging)}}} 
      className={modalClass}>
        <div className={modalContentClass}>
          <div className={`${modalHeaderClass}${isDragging?' modal__header__dragging':''}`}>
            <div className='modal-overlay__title'>
              {title || confirm?.title}
            </div>
            <div className='modal-overlay__icon'>
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </div>

          <div className={modalBodyClass}>
            {children}
            {Object(confirm?.statements)?.length && 
            <div className='modal-overlay__confirm'>

            {Object.values(confirm?.statements).map((btn:any, key: number)=>{
              return <div key={key} className='modal-overlay__confirm-btn'>
              <UiButton onClick={btn.onClick} variant={btn.text=='yes'?'primary':btn?.variant}>{btn.text}</UiButton>
            </div>
            })}
            </div>
            }
          </div>
          <div className='modal__footer'>
          </div>
        </div>
      </div>
    </>
  );
};

export { ModalOverlay };
