import React, { useState } from 'react';
import styles from './UiUpload.scss';
import UiButton from '../../../views/UiButton/UiButton';
import UiInput from '../../UiInput/UiInput';

interface UiUploadProps {
  title: string;
  onFileUpload: (file: File) => void;
}

const UiUpload: React.FC<UiUploadProps> = ({ title, onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="ui-upload">
      <UiButton onClick={handleUploadClick} traits={{ beforeIcon: "fa-file-arrow-up" }}>
        {title}
      </UiButton>
      <UiInput variant="flat" type="file" onChange={handleFileChange} />
    </div>
  );
};

export default UiUpload;
