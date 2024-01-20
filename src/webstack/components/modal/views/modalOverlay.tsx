import React, { useContext, useEffect, useRef, useState } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss";
import { IModalContent, ModalContext, ModalContextType } from '../contexts/modalContext';
import useClass from '@webstack/hooks/useClass';
import UiButton from '@webstack/components/UiButton/UiButton';
import useMouse from '@webstack/hooks/interfaces/useMouse/useMouse';
import { useRouter } from 'next/router';

const ModalOverlay: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const context = useContext<ModalContextType | undefined>(ModalContext);
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const { isModalOpen, closeModal, modalContent, replaceModal }: any = context; // Add replaceModal

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


  const handleReplaceModal = (newContent: IModalContent) => {
    replaceModal(newContent);
  };
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
    }
  }, [position.x, position.y, startPosition, isDragging, closeModal]);

  if (!context) {
    return <div>Modal context not available</div>;
  }
  if (!isModalOpen) {
    return null;
  }
  const handleClick = (btn: any) =>{
    if(btn?.onClick)btn.onClick;
    else if(btn.href){
      router.push(btn.href, undefined, {shallow: false})
    };
    closeModal();
  }
  if (hasZindex) return <>
    <style jsx>{styles}</style>
    <div
    style={{zIndex: modalContentInfer.zIndex}}
      onClick={closeModal}
      className={modalOverlayClass}
      onMouseUp={modalContent.drag && stopDrag}
    />
  </>;
  return (
    <>
      <style jsx>{styles}</style>
      <div
        onClick={closeModal}
        className={modalOverlayClass}
        />
      <div
        ref={modalRef}
        className={modalClass}>
        <div className={modalContentClass}>
          <a
            onMouseUp={modalContent.drag && stopDrag}
            onMouseDown={modalContent.drag && startDrag}
            className={`${modalHeaderClass}${ isDragging ? ' modal__header__dragging' : modalContent.drag ?'':' modal__header__no-drag'}`}
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
                    <UiButton onClick={()=>handleClick(btn)} variant={btn.text == 'yes' ? 'primary' : btn?.variant}>{btn.text}</UiButton>
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
