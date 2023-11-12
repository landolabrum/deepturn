import React, { useContext, useEffect, useState } from 'react';
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
 const classes:any = {
  modal__overlay: useClass('modal__overlay', undefined, modalContent?.variant || undefined),
  modal: useClass('modal', undefined, modalContent?.variant || undefined),
  modal__content: useClass('modal__content', undefined, modalContent?.variant || undefined),
  modal__header: useClass('modal__header', undefined, modalContent?.variant || undefined),
  modal__body: useClass('modal__body', undefined, modalContent?.variant || undefined),

 }

  return (
    <>
      <style jsx>{styles}</style>
      <div onClick={closeModal} className={"modal__overlay"} />
      <div className={classes.modal}  >
        <div className={classes.modal__content}  >
          <div className={classes.modal__header} >
            <div className='modal-overlay__title' >
              {title}
            </div>
            <div className='modal-overlay__icon' >
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </div>

          <div className={classes.modal__body}>
            {children}
          </div>
          <div className='modal__footer' >
          </div>
        </div>
      </div>
    </>
  );
  return <>loading</>
};

export { ModalOverlay };

