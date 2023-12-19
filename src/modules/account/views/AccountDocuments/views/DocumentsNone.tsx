// Relative Path: ./DocumentsNone.tsx
import React from 'react';
import styles from './DocumentsNone.scss';

// Remember to create a sibling SCSS file with the same name as this component

const DocumentsNone: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='documents-none'>
      <div className='documents-none--content'>
              no docs
        </div> 
        </div> 
    </>
  );
};

export default DocumentsNone;