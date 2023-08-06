import { useCallback, useState } from 'react';
import styles from "./UiPill.scss";


const UiPill = ({ amount, setAmount }: { amount: number, setAmount: (qty: number) => void }) => {
    const handleAmount = useCallback((e: any) => {
      setAmount(amount + (e.target.id === "plus" ? 1 : -1));
    }, [amount, setAmount]);

    return (
      <>
        <style jsx>{styles}</style>
        <div className='ui-pill'>
          <div className='ui-pill__action' id="minus" onClick={handleAmount}>-</div>
          <div>{amount}</div>
          <div className='ui-pill__action' id="plus" onClick={handleAmount}>+</div>
        </div>
      </>
    );
  }
export default UiPill;