// Relative Path: ./QuoteForm.tsx
import React, { useRef, useState, useEffect } from 'react';
import styles from './SurveyForm.scss';
import { IProductQuoteField } from '../../controller/ProductQuote';
import UiButton from '@webstack/components/UiButton/UiButton';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import QuoteChoiceOther from '../ProductFeatureOther/SurveyChoiceOther';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

interface IQuoteForm {
  title: string;
  quote: IProductQuoteField[];
  setQuote: (e: any) => void;
  handleView: (newView: any) => void;
}

const QuoteForm: React.FC<IQuoteForm> = ({ handleView, title, quote, setQuote }: IQuoteForm) => {
  const selectedRef = useRef<any | undefined>();
  const { openModal, closeModal } = useModal();
  const [form, setForm] = useState<IProductQuoteField[]>([]);

  useEffect(() => {
    // Convert quote object to array if necessary
    const surveyArray:any = Array.isArray(quote) ? quote : Object.values(quote);
    setForm(surveyArray);
  }, [quote]);

  const selected = form.filter(f => f.selected);

  const clearAllSelected = () => setForm(form.map(item => ({ ...item, selected: false })));

  const handleFeature = (choice: IProductQuoteField) => {
    const addCustom = async (choice: any) => handleFeature(choice);
    const isOther = !Boolean(form.find((f: IFormField) => f.name === choice.name));
    if (choice.name === 'other' && !isOther) {
      return openModal({
        children: <QuoteChoiceOther
          title={title}
          choice={choice}
          onSubmit={(e: any) => {
            form.push(e);
            setForm([...form]);
            closeModal();
          }}
        />
      });
    }

    if (isOther) {
      form.push(choice);
      setForm([...form]);
      handleView('form');
      return;
    }

    const updatedFeatures = form.map(item =>
      item.name === choice.name ? { ...item, selected: !item.selected } : item
    );
    setForm(updatedFeatures);
  };

  const formTitle = `Appliances to Power`;

  const calculateTotalValue = (): number => {
    return form.reduce((acc, curr) => (curr.selected ? acc + (curr.value || 0) : acc), 0);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={selectedRef} className='quote-form'>
        <div className='quote-form__options'>
          <div className='quote-form__selection selection'>
            {Boolean(selected.length) ? (
              <>
                <div className='selection__header'>
                  <div className='selection__header--title'>
                    {`Selected ${formTitle}`} | total amps {calculateTotalValue()}
                  </div>
                  <div className='selection__tools'>
                    <div className='selection__tools--tool' onClick={clearAllSelected}>
                      clear all
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='quote-form__instructions'>
                please Select, {title} to continue.
              </div>
            )}
          </div>
          <AdaptGrid xs={2} sm={4} lg={3} gap={10}>
            {form.map((item, index) => (
              <div
                key={index}
                className={`option ${item.selected ? 'option--choice' : ''}`}
                onClick={() => handleFeature(item)}
              >
                <div className='option__name'>
                  {item.name}
                  {item.selected && <div className='option__name--icon'>{item.value}</div>}
                </div>
              </div>
            ))}
          </AdaptGrid>
          <div className='quote-form__submit'>
            <UiButton
              disabled={selected.length === 0}
              onClick={() => {
                setQuote(form);
                handleView('contact');
              }}
              variant={selected.length ? 'glow' : 'disabled'}
            >
              Proceed to Quote
            </UiButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteForm;
