import React, { useContext } from 'react';
import styles from './ModalOverlay.scss'; // or use your preferred way of styling
import { ModalContext } from '@webstack/modal/contexts/modalContext';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';


const ModalOverlay: React.FC = () => {
  const { isModalOpen, closeModal, modalContent }: any = useContext(ModalContext);

  if (!isModalOpen) {
    return null;
  }

  return (
    <>
      <style jsx>{styles}</style>
      <div className='modal-overlay' >
        <div className='modal-overlay__content' >
          <div className='modal-overlay__header' >
            <div className='modal-overlay__title' >
              Checkout
            </div>
            <div className='modal-overlay__icon' >
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </div>

          <div className='modal-overlay__body' >
            {modalContent}
          </div>

        </div>
      </div>
    </>
  );
};

export { ModalOverlay };

