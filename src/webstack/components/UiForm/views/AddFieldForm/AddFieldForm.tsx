import React, { useEffect, useState } from 'react';
import styles from './AddFieldForm.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiForm from '../../controller/UiForm';
import { useModal } from '@webstack/components/modal/contexts/modalContext';

const AddFieldForm = ({ onAddField }: any) => {
    const [isBtn, setIsBtn] = useState<boolean>(true);
    const { openModal, closeModal } = useModal();
    const [newField, setNewField] = useState<any>();
    const onChange = (e: any) => {
        // Update the name and value properties in parallel within the target object
        const updatedField = {
            target: {
                name: e.target.value ? e.target.value.replaceAll(' ', '_') : 'add-field',
                value: e.target.value,
            },
        };
        setNewField(updatedField);
    }
    useEffect(() => { }, [onChange]);
    const AddFieldComponent = () =>{
        return <>
        <style jsx>{styles}</style>
        <div className='add-field-form'>
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
        </div>
    </>
    }
    const onSubmit = (e: any) => {
        if (isBtn) {
            openModal(<AddFieldComponent/>)
            setIsBtn(!isBtn);
        }
        if (!isBtn) onAddField(newField);
    }


    return (
        <>
            <style jsx>{styles}</style>
            <div className='add-field'>
                <UiButton variant='link' traits={{ afterIcon: 'fas-plus' }} onClick={onSubmit}>add field</UiButton>
            </div>
        </>
    );
};

export default AddFieldForm;
