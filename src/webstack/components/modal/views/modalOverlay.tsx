import React, { useContext } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss"; // or use your preferred way of styling
import { ModalContext } from '../contexts/modalContext';
import useClass from '@webstack/hooks/useClass';

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
  let children = modalContent?.children || modalContent;

  return (
    <>
      <style jsx>{styles}</style>
      <div onClick={closeModal} className={modalOverlayClass} />
      <div className={modalClass}>
        <div className={modalContentClass}>
          <div className={modalHeaderClass}>
            <div className='modal-overlay__title'>
              {title}
            </div>
            <div className='modal-overlay__icon'>
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </div>

          <div className={modalBodyClass}>
            {children}
          </div>
          <div className='modal__footer'>
          </div>
        </div>
      </div>
    </>
  );
};

export { ModalOverlay };
