import React, { useEffect, useState } from 'react';
import styles from './AddFieldForm.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiForm from '../../controller/UiForm';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

const AddFieldForm = ({ onAddField }: any) => {
    const [isBtn, setIsBtn] = useState<boolean>(true);
    const [newField, setNewField] = useState<any>();
    
    const onChange = (e: any) => {
        console.log('[ onChange ]', e);
        // Update the name and value properties in parallel within the target object
        const updatedField = {
            target: {
                name: e.target.value ? e.target.value.replaceAll(' ','_'): 'add-field',
                value: e.target.value,
            },
        };
        setNewField(updatedField);
    }

    const onSubmit = (e: any) => {
        setIsBtn(!isBtn);
        if (!isBtn) onAddField(newField);
    }

    useEffect(() => { }, [onChange]);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='form__add-field'>
                {isBtn && <UiButton variant='link' traits={{ afterIcon: 'fas-plus' }} onClick={onSubmit}>add field</UiButton>}
                {!isBtn && (
                    <UiForm
                        variant='mini'
                        onChange={onChange}
                        onSubmit={onSubmit}
                        fields={[
                            {
                                name: newField?.target?.name || 'add-field',
                                value: newField?.target?.value || '',
                                label: newField?.target?.value || "new field name"
                            }
                        ]}
                    />
                )}
            </div>
        </>
    );
};

export default AddFieldForm;
