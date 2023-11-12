import React, { useContext } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss"; // or use your preferred way of styling
import { ModalContext } from '../contexts/modalContext';
import useClass from '@webstack/hooks/useClass';


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
      <div onClick={closeModal} className={useClass('modal__overlay', undefined, variant)} />
      <div className={useClass('modal', undefined, variant)}  >
        <div className={useClass('modal__content', undefined, variant)}  >
          <div className={useClass('modal__header', undefined, variant)} >
            <div className='modal-overlay__title' >
              {title}
            </div>
            <div className='modal-overlay__icon' >
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </div>

          <div className={useClass('modal__body', undefined, variant)}>
            {children}
          </div>
          <div className='modal__footer' >
          </div>
        </div>
      </div>
    </>
  );
};

export { ModalOverlay };

