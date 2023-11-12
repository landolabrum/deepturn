import { createContext, ReactNode, useContext, useState } from 'react';

export type IModalContent = {
  children?: ReactNode | null | string;
  variant?: "popup" | 'fullscreen';
} | ReactNode | null;

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (content: any) => ModalContextType;
  closeModal: () => void;
  modalContent: IModalContent;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface Props {
  children: any;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = (content: ReactNode): ModalContextType => {
    setIsModalOpen(true);
    setModalContent(content);
    return { isModalOpen: true, openModal, closeModal, modalContent: content };
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, modalContent }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook for the modal context
export const useModal = () => {
  const context = useContext(ModalContext);

  const defaultContext: ModalContextType = {
    isModalOpen: false,
    openModal: (content: IModalContent) => {
      console.warn('openModal called before ModalProvider is ready.');
      return defaultContext;
    },
    closeModal: () => {
      console.warn('closeModal called before ModalProvider is ready.');
    },
    modalContent: null,
  };

  return context ?? defaultContext;
};
