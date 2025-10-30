import React, { useEffect, useState } from 'react';
import styles from './AddFieldForm.scss';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import UiForm from '../../controller/UiForm';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
const AddFieldForm = ({ onAddField }: any) => {
  const [isBtn, setIsBtn] = useState(true);
  const [fieldValue, setFieldValue] = useState('');
  const onChange = (e: any) => {
    const val = e.target.value || '';
    setFieldValue(val);
  };

  const onSubmit = () => {
    const safeName = fieldValue.trim().replace(/\s+/g, '_').toLowerCase();
    if (!isBtn && safeName) {
      onAddField({
        target: {
          name: `metadata.${safeName}`,
          value: fieldValue,
        },
      });
      setIsBtn(true);
      setFieldValue('');
    } else {
      setIsBtn(false);
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="add-field">
        {isBtn ? (
          <UiButton variant="link" traits={{ afterIcon: 'fas-plus' }} onClick={onSubmit}>
            add field
          </UiButton>
        ) : (
          <div className="add-field-form">
            <UiForm
              variant="mini"
              onChange={onChange}
              onSubmit={onSubmit}
              fields={[
                {
                  name: 'new-metadata',
                  value: fieldValue,
                  label: 'New Field Name',
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AddFieldForm;
