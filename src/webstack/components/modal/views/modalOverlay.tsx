import React, { useContext, useRef } from 'react';
import { ModalContext, ModalContextType } from '../contexts/modalContext';
import styles from "@webstack/components/modal/views/modalOverlay.scss";
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

const ModalOverlay: React.FC<any> = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isModalOpen, closeModal, modalContent, replaceModal }: ModalContextType = useContext(ModalContext) as ModalContextType;
  if (!isModalOpen || !modalContent) return null;

  const { confirm, title, children, footer, variant, dismissable = true }: any = modalContent;

  const handleClick = (btn: any) => {
    btn?.onClick();
    closeModal();
  };

  const classMaker = (c: string): string => {
    if (!c && !variant) return '';
    else if (c && variant) return `${c} ${c}__${variant}`;
    return c;
  };

  return (
    <>
      <style jsx>{styles}</style>
      {/* {children && <div className='dev'>{JSON.stringify(modalContent)}</div>} */}
      <div onClick={closeModal} className={classMaker("modal__overlay")} />
      {(Boolean(children) || Boolean(confirm)) && (
        <div ref={modalRef} className={classMaker("modal")}>
          <div className={classMaker("modal__header")}>
            <div className='modal-overlay__title'>{title}</div>
            {dismissable && (
              <div className='close-btn' onClick={closeModal}>
                <UiIcon icon='fa-xmark' />
              </div>
            )}
          </div>
          <div className={classMaker("modal__body")}>
            {children}
            {confirm && (
              <div className='modal-overlay__confirm--header header'>
                {confirm?.title && <div className='header--title'>{confirm.title}</div>}
                {confirm?.body && <div className='header--body'>{confirm.body}</div>}
              </div>
            )}
            {confirm && (
              <div className={`modal-overlay__confirm ${confirm.statements.length > 2 ? "modal-overlay__confirm-col" : ""}`}>
                {confirm.statements.map((btn: any, index: number) => (
                  <UiButton key={index} onClick={() => handleClick(btn)} variant={btn.label === 'yes' ? 'primary' : btn?.variant}>
                    {btn.label}
                  </UiButton>
                ))}
              </div>
            )}
          </div>
          {footer && <div className='modal__footer'>{footer}</div>}
        </div>
      )}
    </>
  );
};

export { ModalOverlay };
