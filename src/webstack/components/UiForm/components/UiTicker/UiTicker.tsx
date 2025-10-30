import { useCallback, useState, useRef, useEffect } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import debounce from 'lodash/debounce';
import { IFormControlVariant } from '../../../AdapTable/models/IVariant';
import { ITraits } from '@webstack/components/UiForm/components/FormControl/FormControl';
import UiInput from '../UiInput/UiInput';

// import global SCSS (no styled-jsx)
import './UiTicker.scss';

interface UiTickerProps {
  amount: number | string;
  setAmount: (qty: number) => void;
  variant?: IFormControlVariant;
  traits?: ITraits;
  increment?: number;
  min?: number;
  onClick?: () => void;
}

const UiTicker = ({
  amount,
  setAmount,
  variant,
  traits,
  increment = 1,
  min = 0,
  onClick,
}: UiTickerProps) => {
  const [value, setValue] = useState<string>('0');

  const handleAmount = useCallback(
    (method: 'plus' | 'minus') => {
      if (typeof amount === 'number') {
        const delta = method === 'plus' ? increment : -increment;
        let next = amount + delta;
        if (next < min) next = min;
        const rounded = parseFloat(next.toFixed(6));
        setAmount(rounded);
      }
    },
    [amount, setAmount, increment, min]
  );

  // Default traits if none are provided
  let _traits: any = traits;
  if (!_traits && typeof amount === 'number') {
    _traits = {
      width: '80px',
      beforeIcon: {
        icon: amount > min ? 'fa-chevron-left' : 'fa-xmark',
        onClick: () => handleAmount('minus'),
        color: amount <= min ? 'red' : '',
      },
      afterIcon: {
        icon: 'fa-chevron-right',
        onClick: () => handleAmount('plus'),
      },
    };
  }
  if (traits) {
    Object.entries(traits).forEach(([k, v]: any) => {
      _traits[k] = v;
    });
  }

  const debouncedHandleInput = useRef(
    debounce((val: string) => {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) setAmount(parsed);
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
    if (amount !== undefined && amount !== null && amount !== '') {
      setValue(amount.toString());
    }
  }, [amount]);

  return (
    <div
      className={`ui-ticker ${variant ? `ui-ticker-${variant}` : ''}`}
      onClick={onClick}
    >
      {/* Uncomment if you want the side icons visible */}
      {/* <button className="ui-ticker__icon" type="button" onClick={() => handleAmount('minus')}>
        <UiIcon {..._traits?.beforeIcon} />
      </button> */}

      <div className="ui-ticker__value">
        <UiInput
          variant="flat"
          traits={_traits}
          value={value}
          onChange={handleInput}
        />
      </div>

      {/* <button className="ui-ticker__icon" type="button" onClick={() => handleAmount('plus')}>
        <UiIcon {..._traits?.afterIcon} />
      </button> */}
    </div>
  );
};

export default UiTicker;
