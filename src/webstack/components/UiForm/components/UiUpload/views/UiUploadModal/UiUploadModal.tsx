// Relative Path: ./UiUploadModal.tsx
import React from 'react';
import styles from './UiUploadModal.scss';

// Remember to create a sibling SCSS file with the same name as this component

const UiUploadModal: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='ui-upload-modal'>
        upload modal
      </div>
    </>
  );
};

export default UiUploadModal;