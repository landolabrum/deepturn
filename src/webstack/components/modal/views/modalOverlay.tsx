import React, { useContext } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss"; // or use your preferred way of styling
import { ModalContext } from '../contexts/modalContext';
import useClass from '@webstack/hooks/useClass';
import UiButton, { IButton } from '@webstack/components/UiButton/UiButton';

const ModalOverlay: React.FC = () => {
  const { isModalOpen, closeModal, modalContent }: any = useContext(ModalContext);

  // Always call hooks unconditionally
  const modalOverlayClass = useClass('modal__overlay', undefined, modalContent?.variant || undefined);
  const modalClass = useClass('modal', undefined, modalContent?.variant || undefined);
  const modalContentClass = useClass('modal__content', undefined, modalContent?.variant || undefined);
  const modalHeaderClass = useClass('modal__header', undefined, modalContent?.variant || undefined);
  const modalBodyClass = useClass('modal__body', undefined, modalContent?.variant || undefined);

  if (!isModalOpen) {
    return null;
  }

  let title = modalContent?.title;
  let confirm = modalContent?.confirm;
  let children = confirm && ' ' || modalContent?.children || modalContent;

  return (
    <>
      <style jsx>{styles}</style>
      <div onClick={closeModal} className={modalOverlayClass} />
      <div className={modalClass}>
        <div className={modalContentClass}>
          <div className={modalHeaderClass}>
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
              <UiButton onClick={btn.onClick} variant={btn?.variant}>{btn.text}</UiButton>
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
