import React, { useContext, useEffect, useRef, useState } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss"; // or use your preferred way of styling
import { ModalContext, ModalContextType } from '../contexts/modalContext';
import useClass from '@webstack/hooks/useClass';
import UiButton from '@webstack/components/UiButton/UiButton';
import useMouse from '@webstack/hooks/interfaces/useMouse/useMouse';

const ModalOverlay: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const context = useContext<ModalContextType | undefined>(ModalContext);

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const { isModalOpen, closeModal, modalContent }: any = context;
  let confirm = modalContent?.confirm;
  let children = confirm && ' ' || modalContent?.children || modalContent;
  const { position } = useMouse();

  // Always call hooks unconditionally
  const modalOverlayClass = useClass('modal__overlay', undefined, `${modalContent?.variant || ''}${isDragging ? ' modal__overlay__dragging' : ''}` || undefined);
  const modalClass = useClass('modal', undefined, `${modalContent?.variant || ''}${isDragging ? ' modal__dragging' : ''}` || undefined);
  const modalContentClass = useClass('modal__content', undefined, modalContent?.variant || undefined);
  const modalHeaderClass = useClass('modal__header', undefined, modalContent?.variant || undefined);
  const modalBodyClass = useClass('modal__body', undefined, modalContent?.variant || undefined);





  let title = modalContent?.title;



  const stopDrag = () => {
    isDragging && setIsDragging(false);
  };


  const startDrag = (e: React.MouseEvent) => {
    setStartPosition({ x: position.x, y: position.y }); // Use current mouse position
    setIsDragging(true);
  };
  const modalContentInfer: any = context?.modalContent;
  const hasZindex = modalContentInfer && !['string', 'number'].includes(typeof modalContentInfer) && Boolean(modalContentInfer.zIndex);
  useEffect(() => {
    if (isDragging && modalRef.current) {
      const dx = position.x - startPosition.x + Number(modalRef.current?.offsetWidth * -0.5);
      const dy = position.y - startPosition.y + +Number(modalRef.current?.offsetHeight * -0.5);
      modalRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      // console.log('[ modalRef.current ]',modalRef.current?.offsetHeight)
      // console.log('[ modalRef.current.children ]',modalRef.current.children)
    }
  }, [position.x, position.y, startPosition, isDragging, closeModal]);

  if (!context) {
    return <div>Modal context not available</div>;
  }
  if (!isModalOpen) {
    return null;
  }

  if (hasZindex) return <>
    <style jsx>{styles}</style>

    <div
    style={{zIndex: modalContentInfer.zIndex}}
      onClick={closeModal}
      className={modalOverlayClass}
      onMouseUp={stopDrag}
    />
  </>;
  // console.log('[ CONTEXT ]', context?.modalContent)
  return (
    <>
      <style jsx>{styles}</style>
      <div
        onClick={closeModal}
        className={modalOverlayClass}
        onMouseUp={stopDrag}
      />
      <div
        ref={modalRef}

        // onMouseMove={(e) => {if (isDragging) {console.log('[ isDraging (54)]', isDragging)}}} 
        className={modalClass}>
        <div className={modalContentClass}>
          <a
            onMouseDown={startDrag}
            onMouseUp={stopDrag}
            className={`${modalHeaderClass}${isDragging ? ' modal__header__dragging' : ''}`}
          >
            <div className='modal-overlay__title'>
              {title || confirm?.title}
            </div>
            <div className='modal-overlay__icon'>
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </a>

          <div className={modalBodyClass}>
            {children}
            {Object(confirm?.statements)?.length &&
              <div className='modal-overlay__confirm'>

                {Object.values(confirm?.statements).map((btn: any, key: number) => {
                  return <div key={key} className='modal-overlay__confirm-btn'>
                    <UiButton onClick={btn.onClick} variant={btn.text == 'yes' ? 'primary' : btn?.variant}>{btn.text}</UiButton>
                  </div>
                })}
              </div>
            }
          </div>
          {modalContent?.footer && <div className='modal__footer'>
            {modalContent.footer}
          </div>}
        </div>
      </div>
    </>
  );
};

export { ModalOverlay };
