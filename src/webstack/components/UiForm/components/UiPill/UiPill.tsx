import { useCallback, useState, useRef, useEffect } from 'react';
import styles from "./UiPill.scss";
import { IFormControlVariant } from '../../../AdapTable/models/IVariant';
import UiInput from '../UiInput/UiInput';
import debounce from 'lodash/debounce';
import { ITraits } from '@webstack/components/UiForm/components/FormControl/FormControl';

interface IPill {
  amount: number | string,
  setAmount: (qty: number) => void,
  variant?: IFormControlVariant,
  traits?: ITraits
};

const UiPill = ({ amount, setAmount, variant, traits }: IPill) => {
  const [value,setValue]=useState<string>("0");
  let _traits:any = traits;
  if(!_traits && typeof amount == 'number')_traits = {
    beforeIcon:{
      icon:amount > 1 ?"fas-minus": "fa-trash-can",
      onClick:()=>handleAmount('minus'),
      color:amount == 1?"red":""
    },
    afterIcon:{
      icon:"fas-plus",
      onClick:()=>handleAmount('plus')
    },
  }
  if(traits){
    Object.entries(traits).forEach(([traitKey, traitValue]:any) => {
      _traits[traitKey]=traitValue;
    });
  }
  const debouncedHandleInput = useRef(debounce((value: string) => {
    const isNumber = !isNaN(Number(value));
    isNumber && setAmount(Number(value));
  }, 1500)).current;

  const handleInput = useCallback((e: any) => {
    setValue(e.target.value);
    debouncedHandleInput(e.target.value);
  }, [debouncedHandleInput]);

  const handleAmount = useCallback((method: "plus" | "minus") => {
    typeof amount == 'number' && setAmount(amount + (method === "plus" ? 1 : -1));
  }, [amount, setAmount]);

useEffect(() => {
  amount && setValue(amount.toString());
}, [amount]);
  return (
    <>
    <style jsx>{styles}</style>
        <div className={`ui-pill ${traits?.responsive?' ui-pill-responsive':''}`}>
          <UiInput
            name="ui-pill"
            variant={variant} 
            traits={_traits}
            value={value}
            onChange={handleInput}
            />
        </div>
    </>
  );
}

export default UiPill;
