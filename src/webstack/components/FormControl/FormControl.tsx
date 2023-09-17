import type { NextComponentType, NextPageContext } from "next";
import styles from "./FormControl.scss";
import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import React, { Children, cloneElement, useEffect, useRef, useState } from "react";
import { OverlayProps, useOverlay } from "@webstack/components/Overlay/Overlay";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import createTestId from "@webstack/helpers/createTestId";

type FormIconProps = {
  icon: string;
  onClick?: (e: any) => void;
  color?: string;
} | string;

export type ITraits = {
  beforeIcon?: FormIconProps;
  afterIcon?: FormIconProps;
  width?: number | string;
  height?: number | string;
  badge?: any;
  responsive?: boolean;
  backgroundColor?: string;
  outline?: string;
  disabled?: boolean;
  errorMessage?: string | React.ReactElement;
  [key: string]: any;
} | undefined;

export interface IFormControl {
  label?: string | React.ReactElement;
  variant?: IVariant;
  overlay?: boolean;
  setOverlay?: (e: OverlayProps) => void;
  children?: string | React.ReactElement | React.ReactFragment | number;
  traits?: ITraits;
}

// FormControl component for rendering form controls with label, icons, and overlay support
const FormControl: NextComponentType<NextPageContext, {}, IFormControl> = ({
  label,
  children,
  variant,
  overlay,
  setOverlay,
  traits,
}: IFormControl) => {
  const cyprus_test_key = "data-testid";

  const [overlay_, setOverlay_] = useOverlay();
  const ref = useRef<any>(null);
  const childRef = useRef<any>(null);
  const [testId, setTestId] = useState<string>("");

  useEffect(() => {
    if (!traits || traits == undefined) return;
    let elemenet_ref = ref.current.querySelector('.form-control__element');
    // Set width if provided
    if (elemenet_ref) {
      for (let key in traits) {
          if (key in elemenet_ref.style && traits[key]) {
              elemenet_ref.style[key] = traits[key];
          }
      }
    }
  


    if (elemenet_ref) {
      if (typeof traits.outline === "string") elemenet_ref.style.outline = traits.outline;
      traits?.disabled && elemenet_ref.classList.add('form-control__element-disabled');
      traits?.responsive && elemenet_ref.classList.add('form-control__element-responsive');
      
      const isInput = elemenet_ref.querySelector('input:not([type="button"])');
      if (isInput?.tagName === 'INPUT') {
        elemenet_ref.classList += " form-control__element__lite" 
      }
    }
    // Manage overlay
    if (overlay === true && !overlay_.active) {
      setOverlay_({
        active: true,
        transparent: true,
        onClick: setOverlay ? setOverlay : () => setOverlay_({ active: false }),
      });
    }

    if (overlay === false && overlay_.active) {
      setOverlay_({ active: false });
    }
  }, [overlay, setOverlay_, traits]);
  const varClasses = (clzz: string) => {
    if (variant) {
      const varArr: any = variant?.split(' ');
      let initialValue = clzz;
      return varArr.reduce(
        (accumulator: string, currentValue: string) => 
        accumulator + (` ${clzz}-${currentValue}`), initialValue
      );
    }
    return clzz;
  }
  useEffect(() => {
    if(focus != undefined && childRef?.current){
      // childRef.current.hide()
    }
  }, [traits]);
  useEffect(() => {
    setTestId(createTestId(ref.current.parentNode, childRef.current));
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      var:{variant}
      <div className={`form-control ${variant === "inherit" ? " form-control-inherit" : ""}`} ref={ref}>
        <div className='form-control__header'>
        {label && <label>{label}</label>}
        {variant && variant == 'invalid' || variant &&  variant?.split(' ').includes('invalid') && <div className='form-control__header-invalid'>
          {traits?.errorMessage}
        </div>}
        </div>
        <div
          className={`${varClasses('form-control__element')}`}
        >
          <div id='before_icon' className={
            `${traits?.beforeIcon ? `${varClasses('form-control__icon')}` : 'form-control__icon-placeholder'}`
          }>
            {traits?.beforeIcon && (
              <UiIcon
                color={typeof traits?.beforeIcon !== "string" ? traits.beforeIcon?.color : undefined}
                onClick={(typeof traits?.beforeIcon !== "string" && traits?.beforeIcon?.onClick) || (() => null)}
                icon={typeof traits?.beforeIcon === "string" ? traits?.beforeIcon : traits?.beforeIcon?.icon}
              />
            )}
          </div>
          {Children.map(children, (child: any) => {
            return cloneElement(child, { ref: childRef, [cyprus_test_key]: testId });
          })}
          {traits?.badge && <div className="form-control__badge">
            <div className="form-control__badge-content">
              {traits.badge}
            </div>
          </div>
          }
          <div id='after_icon' className={`${traits?.afterIcon ? `${varClasses('form-control__icon')}` : 'form-control__icon-placeholder'}`}>
            {traits?.afterIcon && (
              <UiIcon
                color={typeof traits?.afterIcon !== "string" ? traits.afterIcon?.color : undefined}
                onClick={(typeof traits?.afterIcon !== "string" && traits?.afterIcon?.onClick) || (() => null)}
                icon={typeof traits?.afterIcon === "string" ? traits?.afterIcon : traits?.afterIcon?.icon}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormControl;
