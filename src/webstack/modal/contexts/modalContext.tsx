// contexts/ModalContext.tsx

import { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = (content: ReactNode) => {
    setIsModalOpen(true);
    setModalContent(content);
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
  function A(){
    alert("")
  }
  if (!context) {
    // throw new Error('useModal must be used within a ModalProvider');
    return { openModal: A, closeModal: A, modalContent: null };
  }
  return context;
};
