// Relative Path: ./UiButtonGroup.tsx
import React, { useEffect, useState } from 'react';
import styles from './UiButtonGroup.scss';
import AdaptGrid, { iAdaptGrid } from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UiButton, { IButton } from '../../UiButton/UiButton';
import { IFormControlSize } from '../../FormControl/FormControl';


export interface IUiButtonGroup {
  label?: string;
  variant?: string;
  size?: iAdaptGrid | IFormControlSize | string;
  btnSize?: IFormControlSize;
  btns?: IButton[];
  onSelect?: (e: any) => void;
}
const UiButtonGroup = ({ label, btns, size, btnSize, onSelect, variant }: IUiButtonGroup) => {
  // const { width } = useWindow();
  // if(!options)return;
  const defaultOptions = [
    { label: 'loading' },
    { label: 'loading' },
    { label: 'loading' },
  ];
  const [_btns, setBtns] = useState<any[]>(defaultOptions);
  const handleSelect = (e: any) => {
    const { name, value } = e.target;
    let current: any = btns?.find(btn => btn.name == name);
    const currentChecked: any = btns?.find(btn => btn.name == name);
    // console.log({ currentChecked })
    if (typeof current?.checked == 'boolean') current.checked = !current.checked;
    e.target = current;
    // console.log({ current, e: e?.target })
    onSelect && onSelect(e)
  };
  useEffect(() => {
    if (btns) setBtns(btns);
  }, [btns]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='btn-group'>
          {/* {JSON.stringify({LBL:typeof label})} */}
          {label && <div className='btn-group--header'>
        <div className='btn-group--header__title'>
            {label}
        </div>
          </div>||''}
        <div className='btn-group--content'>
          <AdaptGrid
            {...(typeof size === 'object' ? size : { xs: 1 })}
            gap={20}
          >
            {Object.entries(_btns).map(([key, butt], index) => (
              <div key={index + 1} className={`btn-group__item ${
                butt?.checked!==undefined?butt?.checked?" active":' inactive':''}`}>
                {/* {JSON.stringify({checked:butt?.disabled})} */}
                <UiButton
                  name={butt.name}
                  size={btnSize}
                  key={key}
                  onClick={handleSelect}
                  traits={butt?.traits && butt.traits || butt?.checked && { afterIcon: "fa-check" }}
                  value={butt.value}
                  type={butt?.type}
                  disabled={butt?.disabled}
                  variant={variant || butt?.checked && 'inherit' || 'flat'}
                  busy={JSON.stringify(_btns) == JSON.stringify(defaultOptions)}
                >
                  {
                    typeof butt.label === 'string' ? butt.label : (typeof butt.label === 'object' && 'text' in butt.label ? butt.label.text : '')
                  }</UiButton>
              </div>
            ))}
          </AdaptGrid>
        </div>
      </div>
    </>
  );
};

export default UiButtonGroup;