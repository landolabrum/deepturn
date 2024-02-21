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
  let children = confirm && ' ' || modalContent?.children || modalContent;
  // const { position } = useMouse();

  // Always call hooks unconditionally
  const modalOverlayClass = useClass({
    cls:'modal__overlay',
    variant: modalContent?.variant || '',
    // extras:[isDragging ? ' modal__overlay__dragging':'']
  })
  const modalClass = useClass({
    cls:'modal',
  variant:modalContent?.variant,
  // extras:[isDragging ? ' modal__dragging':''
  });

  const modalContentClass = useClass({cls:'modal__content', variant:modalContent?.variant});
  const modalHeaderClass = useClass({cls:'modal__header', variant:modalContent?.variant});
  const modalBodyClass = useClass({cls:'modal__body', variant:modalContent?.variant});

  let title = modalContent?.title;


  // const handleReplaceModal = (newContent: IModalContent) => {
  //   replaceModal(newContent);
  // };
//   const stopDrag = () => {
//     isDragging && setIsDragging(false);
//   };
const statements = Object(confirm?.statements);
//   // const mouse = useMouse();
//   // const mousePos = mouse?.position;
//   const startDrag = (e: React.MouseEvent) => {
//     setStartPosition({ x: position.x, y: position.y }); // Use current mouse position
//     setIsDragging(true);
//   };
  const modalContentInfer: any = context?.modalContent;
  const hasZindex = modalContentInfer && !['string', 'number'].includes(typeof modalContentInfer) && Boolean(modalContentInfer.zIndex);

  // useEffect(() => {
  //   if (isDragging && modalRef.current) {
  //     // const dx = position.x - startPosition.x + Number(modalRef.current?.offsetWidth * -0.5);
  //     // const dy = position.y - startPosition.y + +Number(modalRef.current?.offsetHeight * -0.1);
  //     // modalRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  //     modalRef.current.style.transform = `translate(${mousePos.x + Number(modalRef.current?.offsetWidth * -0.5)}px, ${mousePos.y}px)`;
  //   }

  // }, [position.x, position.y, startPosition, isDragging, closeModal]);

  if (!context) {
    return <div>Modal context not available</div>;
  }
  if (!isModalOpen) {
    return null;
  }
  const handleClick = (btn: any) => {
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
      // onMouseUp={modalContent.draggable ? stopDrag : undefined}
    />
  </>;
  return (
    <>
      <style jsx>{styles}</style>
      <div
        onClick={closeModal}
        className={modalOverlayClass}
        // onMouseUp={modalContent.draggable ? stopDrag : undefined}
      />
      <div
        ref={modalRef}
        className={modalClass}>
        <div className={modalContentClass}>
          <a
          className={modalHeaderClass}
            // onMouseDown={modalContent.draggable ? startDrag : undefined}
            // className={`${modalHeaderClass}${isDragging ? ' modal__header__dragging' : modalContent.draggable ? '' : ' modal__header__no-drag'}`}
            // className={`${modalHeaderClass}${isDragging ? ' modal__header__dragging' : modalContent.draggable ? '' : ' modal__header__no-drag'}`}
            >
            <div className='modal-overlay__title'>
              {title || confirm?.title}
            </div>
            <div className='modal-overlay__icon'>
              <UiIcon icon='fa-xmark' onClick={closeModal} />
            </div>
          </a>

          <div className={modalBodyClass}>
            {children}
            {statements?.length &&
              <div className={`modal-overlay__confirm ${statements.length > 2 ?" modal-overlay__confirm-col":""}`}>
                {statements.map((btn: any, key: number) => {
                  return (
                    <div key={key} className='modal-overlay__confirm-btn'>
                      <UiButton onClick={() => handleClick(btn)} variant={btn.text === 'yes' ? 'primary' : btn?.variant}>
                        {btn.text}
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
