import type { NextComponentType, NextPageContext } from "next";
import styles from "./styles/FormControl.scss";
import elStyles from "./styles/FormControlElement.scss";
import iStyles from "./styles/FormControlIcon.scss";
import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import React, { Children, cloneElement, useEffect, useRef } from "react";
import { IOverlay, useOverlay } from "@webstack/components/Overlay/Overlay";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import UiMarkdown from "../UiMarkDown/UiMarkDown";

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
  [key: string]: any;
} | undefined;

export interface IFormControl {
  label?: string | React.ReactElement;
  variant?: IVariant;
  overlay?: boolean;
  setOverlay?: (e: IOverlay) => void;
  children?: string | React.ReactElement | React.ReactFragment | number;
  traits?: ITraits;
  error?: string | null;
  type?: string;
}

// FormControl component for rendering form controls with label, icons, and overlay support
const FormControl: NextComponentType<NextPageContext, {}, IFormControl> = ({
  label,
  children,
  variant,
  overlay,
  setOverlay,
  traits,
  type,
  error
}: IFormControl) => {
  const ref = useRef<any>(null);
  const [overlayState, setOverlayState] = useOverlay();

  useEffect(() => {
    if (!traits) return;
    let formElement = ref.current.querySelector('.form-control__element');
    // if (variant === 'link') ref.current.style.width = 'max-content';

    // Apply styles from traits
    if (formElement) {
      Object.keys(traits).forEach(key => {
        if (key in formElement.style) {
          formElement.style[key] = traits[key];
        }
      });

      // Apply outline, disabled and responsive styles
      if (typeof traits.outline === "string") formElement.style.outline = traits.outline;
      // formElement.classList.toggle('form-control__element-disabled', traits?.disabled != undefined);
      if (traits?.responsive) formElement.classList.add('form-control__element-responsive');

      // Special handling for USABLE elements
      const hasDataElem:any = Object.values(formElement.children)
      .find((e:any) => e.getAttribute('data-element') && ['button', 'input', 'select', 'textarea'].includes(e.getAttribute('data-element')));
      if(hasDataElem)formElement.classList.add(
        `form-control__element--${hasDataElem.getAttribute('data-element')}${type && type=='color'?'-color':''}`
      );
    }

    // Overlay management
    if (overlay) {
      setOverlayState({
        active: true,
        transparent: true,
        onClick: setOverlay || (() => setOverlayState({ active: false })),
      });
    } else if (overlayState.active) {
      setOverlayState({ active: false });
    }
  }, [overlay, traits, variant, setOverlay, setOverlayState]);

  const varClasses = (className: string) => {
    
    const createElemIconClass = () => {
      if (traits?.beforeIcon && traits?.afterIcon) return ` ${className}--has-icon`;
      else if (traits?.beforeIcon) return ` ${className}--before-icon`;
      else if (traits?.afterIcon) return ` ${className}--after-icon`;
      return ''
    }
    const createVariantClass = () => {
      return variant && variant.split(' ').reduce((acc, val) => {
        const variantClass = `${className}--${val}`;
        return acc.includes(variantClass) ? acc : `${acc} ${variantClass}`.trim();
      }, className);
    }
    const isColor = () =>{
      if(type == 'color' )return ` ${className}-input-color`;
      return '';
    }
    if (!variant) return `${className}${createElemIconClass()}`;
    return `${createVariantClass()}${createElemIconClass()}`
  };

  return (
    <>
      <style jsx>{styles}</style>
      <style jsx>{elStyles}</style>
      <div 
        className={
          `form-control ${variant ? `form-control--${variant}` : ''}${type == 'color'?'form-control--maxY':''}`
        }
        ref={ref}
      >
        {label && (
          <div className='form-control__header'>
            <label>{typeof label === 'string' ? <UiMarkdown text={label} /> : label}</label>
          </div>
        )}
        <div className={varClasses('form-control__element')}>
          {renderIcon(traits?.beforeIcon, 'before')}
          {Children.map(children, (child: any) => cloneElement(child))}
          {traits?.badge && (
            <div className="form-control__badge">
              <div className="form-control__badge-content">{traits.badge}</div>
            </div>
          )}
          {renderIcon(traits?.afterIcon, 'after')}
          {error && (
            <div className='form-control__invalid'>
              <UiMarkdown text={error} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function renderIcon(iconProps: FormIconProps | undefined, position: string) {
  if (!iconProps) return null;
  const icon = typeof iconProps === 'string' ? iconProps : iconProps.icon;
  const onClick = typeof iconProps === 'object' ? iconProps.onClick : undefined;
  const color = typeof iconProps === 'object' ? iconProps.color : undefined;
  const iCls = 'form-control-icon';
  return (<>
    <style jsx>{iStyles}</style>
    <div className={`${iCls} ${iCls}__${position}`}>
      <UiIcon
        icon={icon}
        onClick={onClick}
        color={color}
      />
    </div>
  </>
  );
}
export default FormControl;