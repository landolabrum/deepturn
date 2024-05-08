import React, { useContext, useEffect, useRef, useState } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import styles from "@webstack/components/modal/views/modalOverlay.scss";
import {  ModalContext, ModalContextType } from '../contexts/modalContext';
import useClass from '@webstack/hooks/useClass';
import UiButton from '@webstack/components/UiButton/UiButton';
// import useMouse from '@webstack/hooks/interfaces/useMouse/useMouse';
import { useRouter } from 'next/router';

const ModalOverlay: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const context = useContext<ModalContextType | undefined>(ModalContext);
  const router = useRouter();
  // const [isDragging, setIsDragging] = useState(false);
  // const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const { isModalOpen, closeModal, modalContent }: any = context; // Add replaceModal

  let confirm = modalContent?.confirm;
  let children =  modalContent?.children || modalContent;
  // let children = confirm && ' ' || modalContent?.children || modalContent;
  const modalOverlayClass = useClass({
    cls:'modal__overlay',
    variant: modalContent?.variant || '',
  })
  const modalClass = useClass({
    cls:'modal',
  variant:modalContent?.variant,
  });

  const modalContentClass = useClass({cls:'modal__content', variant:modalContent?.variant});
  const modalHeaderClass = useClass({cls:'modal__header', variant:modalContent?.variant});
  const modalBodyClass = useClass({cls:'modal__body', variant:modalContent?.variant});

  let title = modalContent?.title;

const statements = Object(confirm?.statements);
  const modalContentInfer: any = context?.modalContent;
  const hasZindex = modalContentInfer && !['string', 'number'].includes(typeof modalContentInfer) && Boolean(modalContentInfer.zIndex);


  if (!context) {
    return <div>Modal context not available</div>;
  }
  if (!isModalOpen) {
    return null;
  }
  const handleClick = (btn: any) => {
    // console.log('btn', btn)
    if (btn?.onClick) {
      btn.onClick(btn); // Make sure to call the function
    } else if (btn.href) {
      router.push(btn.href, undefined, { shallow: false });
    }
    closeModal();
  };
  if (hasZindex) return <>
    <style jsx>{styles}</style>
    <div
      style={{ zIndex: modalContentInfer.zIndex }}
      onClick={closeModal}
      className={modalOverlayClass}
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
          <a className={modalHeaderClass} >
            <div className='modal-overlay__title'>
              {title || confirm?.title}
            </div>
            <div className='modal-overlay__icon' onClick={closeModal} >
              <UiIcon icon='fa-xmark' />
            </div>
          </a>

          <div className={modalBodyClass}>
            {children}
            {statements?.length &&
              <div className={`modal-overlay__confirm ${statements.length > 2 ?" modal-overlay__confirm-col":""}`}>
                {statements.map((btn: any, key: number) => {
                  return (
                    <div key={key} className='modal-overlay__confirm-btn'>
                      <UiButton onClick={() => handleClick(btn)} variant={btn.label === 'yes' ? 'primary' : btn?.variant}>
                        {btn.label}
                      </UiButton>
                    </div>
                  );
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
