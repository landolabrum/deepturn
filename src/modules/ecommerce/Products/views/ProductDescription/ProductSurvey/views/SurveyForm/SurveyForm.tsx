// Relative Path: ./SurveyForm.tsx
import React, { useRef, useState } from 'react';
import styles from './SurveyForm.scss';
import { IMoreInfoField } from '../../controller/ProductSurvey';
import UiButton from '@webstack/components/UiButton/UiButton';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import SurveyChoiceOther from '../ProductFeatureOther/SurveyChoiceOther';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

// Remember to create a sibling SCSS file with the same name as this component
interface ISurveyForm {
    title: string;
    form: {
        survey: IMoreInfoField[];
    };
    setForm: (e: any) => void;
    handleView: (newView: any) => void;
}
const SurveyForm: React.FC<ISurveyForm> = ({ handleView, title, form, setForm }: ISurveyForm) => {
    const selectedRef = useRef<any | undefined>();
    const { openModal, closeModal, replaceModal } = useModal();

    const { survey } = form;
    const selected = form.survey.filter(f => f.selected);
    const clearAllSelected = () => setForm(defaultForm);
    const defaultForm = { survey: survey };






    const handleFeature = (choice: IMoreInfoField) => {
        const addCustom = async (choice: any) => handleFeature(choice);
        const isOther = !Boolean(survey.find((f: IFormField) => f.name === choice.name));
        if (choice.name === 'other' && !isOther) {
            return openModal(
                <SurveyChoiceOther
                    title={title}
                    choice={choice}
                    onSubmit={(e: any) => {
                        addCustom(e).then(closeModal)
                    }}
                />
            );
        }

        if (isOther) {
            survey.push(choice);
            setForm({ ...form, survey });
            handleView('form')
            return;
        }

        const updatedFeatures = survey.map(item =>
            item.name === choice.name ? { ...item, selected: !item.selected } : item
        );
        setForm({ ...form, survey: updatedFeatures });
    };

    const formTitle = `Appliances to Power`

    const calculateTotalValue = (): number => {
        return survey.reduce((acc, curr) => {
            if (curr.selected) {
                return acc + curr.value;
            }
            return acc;
        }, 0);
    };
    return (<>
        <style jsx>{styles}</style>
        <div ref={selectedRef} className='survey-form'>

            <div className='survey-form__options' >
            {survey && Boolean(selected?.length) &&
                <div className='survey-form__selection selection'>
                    <div className='selection__header'>
                        {`Selected ${formTitle}`} | total amps  {calculateTotalValue()}
                    </div>
                    <div className='selection__tools' >
                        <div className='selection__tools--tool'>
                            {Boolean(selected?.length) && <div onClick={clearAllSelected}>clear all</div>}
                        </div>
                    </div>
                    </div>
        }
                <AdaptGrid
                    xs={3}
                    sm={4}
                    lg={4}
                    gap={10} >
                    {survey !== null && survey.map((item, index) => {
                        return (
                            <div key={index} className={`option ${item?.selected ? 'option--choice' : ''}`} onClick={() => handleFeature(item)}>
                                <div className='option__name'>
                                    {item?.name} {item?.selected && (
                                        <div className='option__name--icon '>
                                            {item?.value}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </AdaptGrid>
                <div className='survey-form__submit'>
                    <UiButton
                        disabled={selected.length == 0}
                        onClick={() => handleView('contact')}
                        variant={Boolean(selected.length) && 'glow' || 'disabled'}
                    >Proceed to Quote</UiButton>
                </div>
            </div>
            {/* {survey && Boolean(selected?.length) &&
                <div className='survey-form__selection selection'>
                    <div className='selection__header'>
                        {`Selected ${formTitle}`} | total amps  {calculateTotalValue()}
                    </div>
                    <div className='selection__tools' >
                        <div className='selection__tools--tool'>
                            {Boolean(selected?.length) && <div onClick={clearAllSelected}>clear all</div>}
                        </div>
                    </div>
                    <div className='selection--selected'>
                        {Object.values(survey).map((item, index) => {
                            if (item?.selected) return (
                                <div key={index} className='selected-button'>
                                    <UiButton
                                        variant='flat'
                                        size='sm'
                                        traits={{
                                            afterIcon: {
                                                icon: 'fa-xmark',
                                                onClick: () => handleFeature(item)
                                            },
                                        }}
                                        onClick={() => handleFeature(item)}
                                    >
                                        {item.name} - {item?.value}
                                    </UiButton>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            } */}
            {!selected.length && <div className='survey-form__options survey-form__instructions'>please Select, {title} to continue.</div>}
            {/* <div id='survey-form__options' /> */}
        </div>
    </>
    );
};

export default SurveyForm;