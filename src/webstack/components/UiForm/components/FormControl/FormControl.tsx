import type { NextComponentType, NextPageContext } from "next";
import styles from "./styles/FormControl.scss";
import elStyles from "./styles/FormControlElement.scss";
import iStyles from "./styles/FormControlIcon.scss";
import { IFormControlVariant } from "@webstack/components/AdapTable/models/IVariant";
import React, { Children, cloneElement, useEffect, useRef, ReactElement as RE } from "react";
import { IAppOverlay, useAppOverlay } from "@webstack/components/AppOverlay/AppOverlay";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import UiMarkdown from "@webstack/components/UiMarkDown/UiMarkDown";

type FormIconProps = {
  icon?: string;
  onClick?: (e: any) => void;
  color?: string;
  badge?:string;
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
  checked?: boolean | string;
  label?: string | RE | { text?: string; color?: string };
  variant?: IFormControlVariant;
  size?: IFormControlSize;
  overlay?: boolean;
  setOverlay?: (e: IAppOverlay) => void;
  children?: string | RE | React.ReactFragment | number;
  traits?: ITraits;
  error?: string | null;
  type?: string;
}

function isReactElement(element: any): element is RE {
  return React.isValidElement(element);
}

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
  const [overlayState, setOverlayState] = useAppOverlay();

  useEffect(() => {
    if (!traits) return;
    let formElement = ref.current.querySelector('.form-control__element');
    if (formElement) {
      Object.keys(traits).forEach(key => {
        if (key in formElement.style) {
          // @ts-ignore - dynamic style keys from traits
          formElement.style[key] = (traits as any)[key];
        }
      });
      if (typeof traits.outline === "string") formElement.style.outline = traits.outline;

      if (traits.disabled) formElement.classList.add('form-control__element--disabled');
      if (traits.responsive) formElement.classList.add('form-control__element-responsive');
      if (error) formElement.classList.add('form-control__element--error');

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

    if (overlay) {
      setOverlayState({
        active: true,
        transparent: true,
        onClick: setOverlay || (() => setOverlayState({ active: false })),
      });
    } else if (overlayState.active) {
      setOverlayState({ active: false });
    }
  }, [overlay, traits, variant, setOverlay, setOverlayState, error, type, overlayState.active]);

  const propClasses = (className: string) => {
    const iconClass = traits?.beforeIcon ? ` ${className}--before-icon` : traits?.afterIcon ? ` ${className}--after-icon` : '';
    const sizeClass = size ? ` ${className}-${size}` : '';
    const colorClass = type === 'color' ? (className === 'form-control' ? ' form-control--maxY' : ` ${className}-input-color`) : '';
    const variantClass = variant ? variant.split(' ').map(v => `${className}--${v}`).join(' ') : '';
    const typeClass = type ? ` ${className}--${type}` : '';

    return `${className}${iconClass}${sizeClass}${colorClass} ${variantClass}${typeClass}`.trim();
  };

  // --- Label normalization + "required" detection (leading '*') ---
  const getRawLabelText = (lbl: IFormControl['label']): string | undefined => {
    if (typeof lbl === 'string') return lbl;
    if (lbl && typeof lbl === 'object' && !isReactElement(lbl) && 'text' in lbl && typeof (lbl as any).text === 'string') {
      return (lbl as any).text as string;
    }
    return undefined;
  };

  const rawLabelText = getRawLabelText(label);
  const isRequired = !!rawLabelText?.trim().startsWith('*');

  const getLabel = (lbl: any) => {
    let context: any;
    if (lbl?.text) {
      context = lbl.text;
    } else if (typeof lbl === 'string') {
      context = lbl;
    }
    if (context?.[0] === '*') {
      context = context.slice(1);
    }
    if (context && lbl && typeof lbl === 'object' && 'text' in lbl) {
      return { ...lbl, text: context };
    }
    return context;
  };

  const labelContext = getLabel(label);
  const formControlLabel: any = typeof labelContext === 'string'
    ? <UiMarkdown text={labelContext} />
    : !isReactElement(labelContext) && labelContext?.text
      ? <UiMarkdown text={labelContext.text} color={labelContext.color} />
      : label;

  return (
    <>
      <style jsx>{styles}</style>
      <style jsx>{elStyles}</style>
      {/* tiny spacing rule for the end-of-label icon */}
      <style jsx>{`
        .form-control__label-icon {
          display: inline-flex;
          margin-left: .4rem;
          vertical-align: middle;
        }
      `}</style>

      <div className={propClasses('form-control')} ref={ref}>
        {label && (
          <div className='form-control__header'>
            <label>
              {formControlLabel}
              {/* Append icon at the END of the label when required/flagged */}
              {isRequired && (
                <span className="form-control__label-icon">
                  <UiIcon icon="fa-exclamation-star" />
                </span>
              )}
            </label>
          </div>
        )}

        <div className={propClasses('form-control__element')}>
          {renderIcon(traits?.beforeIcon, 'before', size, variant, typeof traits?.beforeIcon !=='string'&&traits?.beforeIcon?.badge?String(traits?.beforeIcon?.badge):undefined)}
          {Children.map(children as any, (child: any) => cloneElement(child))}
          {traits?.badge && (
            <div className="form-control__badge">
              <div className="form-control__badge-content">{traits.badge}</div>
            </div>
          )}
          {renderIcon(traits?.afterIcon, 'after', size, variant, typeof traits?.afterIcon !=='string'&&traits?.afterIcon?.badge?String(traits?.afterIcon?.badge):undefined)}
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

function renderIcon(iconProps: FormIconProps | undefined, position: string, size?: string, variant?: IFormControlVariant, badge?:string) {
  if (!iconProps) return null;
  const icon = typeof iconProps === 'string' ? iconProps : iconProps.icon;
  const onClick = typeof iconProps === 'object' ? iconProps.onClick : undefined;
  const color = typeof iconProps === 'object' ? iconProps.color : undefined;
  const iCls = 'form-control-icon';

  return (
    <>
      <style jsx>{iStyles}</style>
      <div className={`${iCls} ${iCls}__${position} ${variant ? ` ${iCls}-${variant}` : ""} ${size ? ` ${iCls}-${size}` : ""} ${onClick ? ' icon-click' : ''}`}>
        <UiIcon icon={icon} onClick={onClick} color={color} badge={badge}/>
      </div>
    </>
  );
}

export default FormControl;
