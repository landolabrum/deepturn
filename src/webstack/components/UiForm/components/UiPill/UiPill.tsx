import { useCallback, useState, useRef, useEffect } from 'react';
import styles from "./UiPill.scss";
import { IFormControlVariant } from '../../../AdapTable/models/IVariant';
import UiInput from '../UiInput/UiInput';
import debounce from 'lodash/debounce';
import { ITraits } from '@webstack/components/UiForm/components/FormControl/FormControl';

interface IPill {
  amount: number | string;
  setAmount: (qty: number) => void;
  variant?: IFormControlVariant;
  traits?: ITraits;
  /** step size for + / – buttons (default = 1, supports decimals like 0.4) */
  increment?: number;
  /** minimum allowed value (default = 0, but can be negative if you want) */
  min?: number;
  label?:string;
  name?:string;
}

const UiPill = ({ amount, setAmount, variant, traits, increment = 1, min = 0, label, name }: IPill) => {
  const [value, setValue] = useState<string>("0");

  const handleAmount = useCallback(
    (method: "plus" | "minus") => {
      if (typeof amount === "number") {
        const delta = method === "plus" ? increment : -increment;
        let next = amount + delta;
        if (next < min) next = min;
        // round to avoid floating point artifacts (e.g. 0.30000000000004)
        const rounded = parseFloat(next.toFixed(6));
        setAmount(rounded);
      }
    },
    [amount, setAmount, increment, min]
  );

  // default traits: minus / plus buttons
  let _traits: any = traits;
  if (!_traits && typeof amount === "number") {
    _traits = {
      beforeIcon: {
        icon: amount > min ? "fas-minus" : "fa-trash-can",
        onClick: () => handleAmount("minus"),
        color: amount <= min ? "red" : "",
      },
      afterIcon: {
        icon: "fas-plus",
        onClick: () => handleAmount("plus"),
      },
    };
  }
  if (traits) {
    Object.entries(traits).forEach(([traitKey, traitValue]: any) => {
      _traits[traitKey] = traitValue;
    });
  }

  const debouncedHandleInput = useRef(
    debounce((val: string) => {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        setAmount(parsed);
      }
    }, 800)
  ).current;

  const handleInput = useCallback(
    (e: any) => {
      setValue(e.target.value);
      debouncedHandleInput(e.target.value);
    },
    [debouncedHandleInput]
  );

  useEffect(() => {
    if (amount !== undefined && amount !== null && amount !== "") {
      setValue(amount.toString());
    }
  }, [amount]);

  return (
    <>
      <style jsx>{styles}</style>
      <div
        className={`ui-pill ${traits?.responsive ? " ui-pill-responsive" : ""} ${
          variant ? `ui-pill-${variant}` : ""
        }`}
      >
        <UiInput
          name={name?name:"ui-pill"}
          variant={variant}
          traits={_traits}
          label={label}
          value={value}
          onChange={handleInput}
        />
      </div>
    </>
  );
};

export default UiPill;
