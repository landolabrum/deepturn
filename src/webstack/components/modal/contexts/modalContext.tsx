import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { IFormControlVariant } from '@webstack/components/AdapTable/models/IVariant';

export type IConfirm = {
  title?: string | React.ReactElement;
  statements?: {
    label?: string,
    onClick?: (e: any) => void,
    href?: string,
    variant?: IFormControlVariant
  }[] | undefined;
  body?: any;
} | undefined;

export interface IModal {
  title?: string | ReactNode;
  children?: ReactNode | null | string;
  footer?: ReactNode;
  variant?: "popup" | 'fullscreen' | 'container';
  dismissable?: boolean;
  confirm?: IConfirm;
  zIndex?: number;
}

export type IModalContent = IModal | ReactNode | null;

export interface ModalContextType {
  confirm?: IConfirm;
  isModalOpen: boolean;
  openModal: (content: IModalContent) => void;
  closeModal: () => void;
  modalContent: IModalContent;
  replaceModal: (content: IModalContent) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface Props {
  children: any;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<IModalContent>(null);

  const openModal = (content: IModalContent) => {
    setIsModalOpen(true);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const replaceModal = (content: IModalContent) => {
    if (isModalOpen) {
      setModalContent(content);
    } else {
      openModal(content);
    }
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, modalContent, replaceModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  
  useEffect(() => {}, [ModalContext]);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
