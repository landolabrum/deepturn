import { useCallback, useState } from 'react';
import styles from "./UiPill.scss";
import { UiIcon } from '../UiIcon/UiIcon';
import { VariantProps } from '../AdapTable/models/IVariant';
import FormControl from '../FormControl/FormControl';


const UiPill = ({ amount, setAmount, variant }: { amount: number, setAmount: (qty: number) => void, variant?: VariantProps }) => {
    const handleAmount = useCallback((e: any) => {
      setAmount(amount + (e.target.id === "plus" ? 1 : -1));
    }, [amount, setAmount]);

    return (
      <>
        <style jsx>{styles}</style>
        <FormControl variant={variant}>
        <div className='ui-pill'>
          <div className='ui-pill__action' id="minus" onClick={handleAmount}>{amount>1?"-":<UiIcon icon="fa-trash-can"/>}</div>
          <div className={`${amount?"ui-pill__amount":""}`} data-value={amount}/>
          <div className='ui-pill__action' id="plus" onClick={handleAmount}>+</div>
        </div>
        </FormControl>
      </>
    );
  }
export default UiPill;