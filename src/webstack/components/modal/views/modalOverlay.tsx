import React, { useContext } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss"; // or use your preferred way of styling
import { ModalContext } from '../contexts/modalContext';


const ModalOverlay: React.FC = () => {
  const { isModalOpen, closeModal, modalContent }: any = useContext(ModalContext);
  let variant;
  let title = modalContent?.title;
  let children = modalContent;
  if (modalContent?.children) children = modalContent.children;
  if (modalContent?.variant) variant = modalContent?.variant;
  if (!isModalOpen) {
    return null;
  }

  return (
    <>
      <style jsx>{styles}</style>
      <div onClick={closeModal} className={`modal-overlay${variant&&' '+variant || ''}`} />
      <div className='modal' >
        <div className='modal__content' >
          <div className='modal-overlay__header' >
            <div className='modal-overlay__title' >
              {title}
            </div>
            <div className='modal-overlay__icon' >
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </div>

          <div className='modal-overlay__body' >
            {children}
          </div>
          <div className='modal-overlay__footer' >
          </div>
        </div>
      </div>
    </>
  );
};

export { ModalOverlay };

