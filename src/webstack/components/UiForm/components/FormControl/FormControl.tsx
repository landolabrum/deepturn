import type { NextComponentType, NextPageContext } from "next";
import styles from "./styles/FormControl.scss";
import elStyles from "./styles/FormControlElement.scss";
import iStyles from "./styles/FormControlIcon.scss";
import { IFormControlVariant } from "@webstack/components/AdapTable/models/IVariant";
import React, { Children, cloneElement, useEffect, useRef, ReactElement as RE } from "react";
import { IOverlay, useOverlay } from "@webstack/components/Overlay/Overlay";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import UiMarkdown from "@webstack/components/UiMarkDown/UiMarkDown";

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

export type IFormControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface IFormControl {
  label?: string | RE | { text?: string; color?: string };
  variant?: IFormControlVariant;
  size?: IFormControlSize;
  overlay?: boolean;
  setOverlay?: (e: IOverlay) => void;
  children?: string | RE | React.ReactFragment | number;
  traits?: ITraits;
  error?: string | null;
  type?: string;
}

// Type guard to check if an object is a ReactElement
function isReactElement(element: any): element is RE {
  return React.isValidElement(element);
}

// FormControl component for rendering form controls with label, icons, and overlay support
const FormControl: NextComponentType<NextPageContext, {}, IFormControl> = ({
  label,
  children,
  variant,
  overlay,
  size,
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
    if (formElement) {
      Object.keys(traits).forEach(key => {
        if (key in formElement.style) {
          formElement.style[key] = traits[key];
        }
      });
      // Apply outline, disabled and responsive styles
      if (typeof traits.outline === "string") formElement.style.outline = traits.outline;

      if (traits.disabled) formElement.classList.add('form-control__element--disabled');
      if (traits.responsive) formElement.classList.add('form-control__element-responsive');
      if (error) formElement.classList.add('form-control__element--error');
      // Special handling for USABLE elements
      const hasDataElem: any = Object.values(formElement.children)
        .find((e: any) => e.getAttribute('data-element') && ['button', 'input', 'select', 'textarea'].includes(e.getAttribute('data-element')));
      if (hasDataElem) {
        const dataElemStr = hasDataElem.getAttribute('data-element');
        ref.current.classList.add(`form-control--${dataElemStr}`);
        formElement.classList.add(
          `form-control__element--${dataElemStr}${type && type === 'color' ? '-color' : ''}`
        );
      }
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

  const propClasses = (className: string) => {
    const createIconClass = () => {
      if (traits?.beforeIcon) return ` ${className}--before-icon`;
      else if (traits?.afterIcon) return ` ${className}--after-icon`;
      return '';
    };

    const createVariantClass = () => {
      return variant && variant.split(' ').reduce((acc, val) => {
        const variantClass = `${className}--${val}`;
        return acc.includes(variantClass) ? acc : `${acc} ${variantClass}`.trim();
      }, className);
    };

    const createSizeClass = () => {
      if (!size) return '';
      return ` ${className}-${size}`;
    };

    const isColor = () => {
      if (type !== 'color') return '';
      return className === 'form-control' ? ' form-control--maxY' : ` ${className}-input-color`;
    };

    if (!variant) return `${className}${createIconClass()}${createSizeClass()}${isColor()}`;
    return `${createVariantClass()}${createIconClass()}${createSizeClass()}${isColor()}`;
  };
  const formControlLabel: any = typeof label === 'string' ? (
    <UiMarkdown text={label} />
  ) : !isReactElement(label) && label?.text ? (
    <UiMarkdown text={label.text} color={label.color} />
  ) : label;

  return (
    <>
      <style jsx>{styles}</style>
      <style jsx>{elStyles}</style>
      <div 
        className={propClasses('form-control')}
        ref={ref}
      >
        {label && (
          <div className='form-control__header'>
            <label>{formControlLabel}</label>
          </div>
        )}
        <div className={propClasses('form-control__element')}>
          {renderIcon(traits?.beforeIcon, 'before', size, variant)}
          {Children.map(children, (child: any) => cloneElement(child))}
          {traits?.badge && (
            <div className="form-control__badge">
              <div className="form-control__badge-content">{traits.badge}</div>
            </div>
          )}
          {renderIcon(traits?.afterIcon, 'after', size, variant)}
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

function renderIcon(iconProps: FormIconProps | undefined, position: string, size?: string, variant?: IFormControlVariant) {
  if (!iconProps) return null;
  const icon = typeof iconProps === 'string' ? iconProps : iconProps.icon;
  const onClick = typeof iconProps === 'object' ? iconProps.onClick : undefined;
  const color = typeof iconProps === 'object' ? iconProps.color : undefined;
  const iCls = 'form-control-icon';
  
  return (
    <>
      <style jsx>{iStyles}</style>
      <div className={`${iCls} ${iCls}__${position} ${variant ? ` ${iCls}-${variant}` : ""} ${size ? ` ${iCls}-${size}` : ""}`}>
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
