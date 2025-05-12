import React, { useContext, useRef } from 'react';
import { ModalContext, ModalContextType } from '../contexts/modalContext';
import styles from "./modalOverlay.scss";
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useRouter } from 'next/router';

const ModalOverlay: React.FC<any> = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isModalOpen, closeModal, modalContent, replaceModal }: ModalContextType = useContext(ModalContext) as ModalContextType;
  const router = useRouter(); // Ensure useRouter is called unconditionally
  const [hovered, setHovered] = React.useState<boolean>(false);  
  if (!isModalOpen || !modalContent) return null;

  const { confirm, title, children, footer, variant, dismissable = true }: any = modalContent;

  const handleClick = (btn: any) => {
    btn?.onClick && btn.onClick();
    btn?.href && router.push(btn.href);
    closeModal();
  };

  const classMaker = (c: string): string => {
    if (!c && !variant) return '';
    else if (c && variant) return `${c} ${c}__${variant}`;
    return c;
  };
  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };
  
  return (
    <>
      <style jsx>{styles}</style>
      {/* {children && <div className='dev'>{JSON.stringify(modalContent)}</div>} */}
      <div onClick={closeModal} id='modal-main' className={classMaker("modal__overlay")} />
      {(Boolean(children) || Boolean(confirm)) && (
        <div ref={modalRef} className={classMaker("modal")}>
          <div className={classMaker("modal__header")}>
            <div className='modal-overlay__title'>{title}</div>
            {dismissable && (
              <div className='close-btn' 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}

              >
                <UiButton onClick={closeModal} size='lg' traits={{beforeIcon:'fa-xmark'}}>{hovered?"close":''}
                </UiButton>
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
