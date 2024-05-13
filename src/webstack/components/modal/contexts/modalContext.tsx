import { IFormControlVariant } from '@webstack/components/AdapTable/models/IVariant';
import React, { createContext, ReactNode, useContext,  useState } from 'react';

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



export type IModalContent = {
  title?: string | ReactNode;
  children?: ReactNode | null | string;
  footer?: ReactNode;
  variant?: "popup" | 'fullscreen';
  confirm?: IConfirm;
  zIndex?: number;
  draggable?: boolean;
} | ReactNode | null;

export interface ModalContextType {
  confirm?:IConfirm;
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

  const replaceModal = (content: IModalContent) => { // Implement replaceModal function
    setModalContent(content);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, modalContent, replaceModal }}>
      {children}
    </ModalContext.Provider>
  );
};


export const useModal = () => {
  const context = useContext<ModalContextType | undefined>(ModalContext);
  const [open, setOpen]=useState(context?.isModalOpen);
  const defaultContext: ModalContextType = {
    isModalOpen: false,
    openModal: (content: IModalContent) => {
      console.warn('openModal called before ModalProvider is ready.');
    },
    closeModal: () => {
      console.warn('closeModal called before ModalProvider is ready.');
    },
    replaceModal: () => {
      console.warn('replaceModal called before ModalProvider is ready.');
    },
    modalContent: null,
  };

  return context ?? defaultContext;
};
