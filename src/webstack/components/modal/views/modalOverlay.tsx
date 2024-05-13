import React, { useContext, useEffect, useRef } from 'react';
import { ModalContext, ModalContextType } from '../contexts/modalContext';
import styles from "@webstack/components/modal/views/modalOverlay.scss";
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

const ModalOverlay: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  if(!ModalContext)return<></>;
  const { isModalOpen, closeModal, modalContent }:any = useContext<ModalContextType | undefined>(ModalContext);
  
  if (!isModalOpen || !modalContent) {
    return null;
  }

  // Call useClass outside of any conditional logic to ensure hooks are called consistently
  const modalOverlayClass = 'modal__overlay ' + (modalContent?.variant || '');
  const modalClass = 'modal ' + (modalContent?.variant || '');
  const modalHeaderClass = 'modal__header ' + (modalContent?.variant || '');
  const modalBodyClass = 'modal__body ' + (modalContent?.variant || '');

  const { confirm, title, children, footer, variant }:any = modalContent;

  const handleClick = (btn:any) => {
    if (btn.onClick) {
      btn.onClick(); // call the onClick function passed with the button
    }
    closeModal();
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div onClick={closeModal} className={modalOverlayClass} />
      <div ref={modalRef} className={modalClass}>
        <div className={modalHeaderClass}>
          <div className='modal-overlay__title'>{title}</div>
          <div className='modal-overlay__icon' onClick={closeModal}>
            <UiIcon icon='fa-xmark' />
          </div>
        </div>
        <div className={modalBodyClass}>
          {children}
     <div className='modal-overlay__confirm--header header'>
          {confirm?.title && <div className='header--title'>{confirm.title}</div>}
          {confirm?.body && <div className='header--body'>{confirm.body}</div>}
            </div>
          {confirm && (
            <div className={`modal-overlay__confirm ${confirm.statements.length > 2 ? "modal-overlay__confirm-col" : ""}`}>
              {confirm.statements.map((btn:any, index:number) => (
                <UiButton key={index} onClick={() => handleClick(btn)} variant={btn.label === 'yes' ? 'primary' : btn?.variant}>
                  {btn.label}
                </UiButton>
              ))}
            </div>
          )}
        </div>
        {footer && <div className='modal__footer'>{footer}</div>}
      </div>
    </>
  );
};

export { ModalOverlay };
