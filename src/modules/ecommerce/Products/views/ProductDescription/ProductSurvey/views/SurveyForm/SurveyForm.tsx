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
 survey: IMoreInfoField[];
 setSurvey: (e: any) => void;
 handleView: (newView: any) => void;
}
const SurveyForm: React.FC<ISurveyForm> = ({ handleView, title, survey, setSurvey }: ISurveyForm) => {
 const selectedRef = useRef<any | undefined>();
 const { openModal, closeModal, replaceModal } = useModal();
 const [form, setForm] = useState<IMoreInfoField[]>(survey);

 const selected = form.filter(f => f.selected);
 const clearAllSelected = () => setForm(defaultForm);
 const defaultForm = survey;


 const handleFeature = (choice: IMoreInfoField) => {
  const addCustom = async (choice: any) => handleFeature(choice);
  const isOther = !Boolean(form.find((f: IFormField) => f.name === choice.name));
  if (choice.name === 'other' && !isOther) {
   return openModal(
    {
     children: <SurveyChoiceOther
      title={title}
      choice={choice}
      onSubmit={(e: any) => {
       addCustom(e).then(closeModal)
      }}
     />
    }
   );
  }

  if (isOther) {
   form.push(choice);
   setForm({ ...form });
   handleView('form')
   return;
  }

  const updatedFeatures = form.map(item =>
   item.name === choice.name ? { ...item, selected: !item.selected } : item
  );
  setForm(updatedFeatures);
 };

 const formTitle = `Appliances to Power`

 const calculateTotalValue = (): number => {
  return form.reduce((acc, curr) => {
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
    <div className='survey-form__selection selection'>
     {form && Boolean(selected?.length) && <>
      <div className='selection__header'>
       <div className='selection__header--title'>
        {`Selected ${formTitle}`} | total amps  {calculateTotalValue()}
       </div>
       <div className='selection__tools' >
        <div className='selection__tools--tool'>
         {Boolean(selected?.length) && <div onClick={clearAllSelected}>clear all</div>}
        </div>
       </div>
      </div>
     </> || <div className='survey-form__instructions'>please Select, {title} to continue.</div>
     }
    </div>
    <AdaptGrid
     xs={2}
     sm={4}
     lg={3}
     gap={10} >
     {form !== null && form.map((item, index) => {
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
      onClick={() => {
       setSurvey(form);
       handleView('contact');
      }}
      variant={Boolean(selected.length) && 'glow' || 'disabled'}
     >Proceed to Quote</UiButton>
    </div>
   </div>
  </div>
 </>
 );
};

export default SurveyForm;