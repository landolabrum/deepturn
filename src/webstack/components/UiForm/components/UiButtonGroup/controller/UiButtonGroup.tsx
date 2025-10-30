// src/webstack/components/UiForm/components/UiButtonGroup/controller/UiButtonGroup.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './UiButtonGroup.scss';
import AdaptGrid, { iAdaptGrid } from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UiButton, { IButton } from '../../UiButton/UiButton';
import { IFormControlSize } from '../../FormControl/FormControl';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';

export interface IUiButtonGroup {
  label?: string | boolean;
  /** Group-level default variant; per-button `variant` overrides this */
  variant?: string; // e.g. "primary", "secondary", "bundle" (layout-only)
  size?: iAdaptGrid | IFormControlSize | string;
  btnSize?: IFormControlSize;
  btns?: IButton[];
  onSelect?: (e: any) => void;
}

/** Layout-only variants that should NOT cascade to items as theme variants */
const LAYOUT_ONLY_VARIANTS = new Set(['bundle']);

/** Deep-ish equality used just to avoid unnecessary setState thrash */
const shallowEqualArray = (a?: any[], b?: any[]) => {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i], y = b[i];
    if (x === y) continue;
    if (
      x?.name !== y?.name ||
      x?.label !== y?.label ||
      x?.checked !== y?.checked ||
      x?.variant !== y?.variant ||
      x?.disabled !== y?.disabled ||
      x?.traits?.variant !== y?.traits?.variant
    ) {
      return false;
    }
  }
  return true;
};

/** Resolve the visual variant for one button with sensible precedence */
const resolveItemVariant = (
  butt: IButton | undefined,
  groupVariant?: string
): string | undefined => {
  if (!butt) return LAYOUT_ONLY_VARIANTS.has(groupVariant || '') ? undefined : groupVariant;
  // precedence: button.variant -> button.traits.variant -> group.variant* -> (checked? primary : flat) -> undefined
  // *group.variant is ignored if it's layout-only (e.g. "bundle")
  const groupTheme = LAYOUT_ONLY_VARIANTS.has(groupVariant || '') ? undefined : groupVariant;
  return (
    (butt as any).variant ??
    (butt as any)?.traits?.variant ??
    groupTheme ??
    (typeof butt.checked === 'boolean' ? (butt.checked ? 'link' : 'flat') : undefined)
  );
};

const UiButtonGroup: React.FC<IUiButtonGroup> = ({ label, btns, size, btnSize, onSelect, variant }) => {
  const defaultOptions = useMemo(() => [{ label: 'loading' }, { label: 'loading' }, { label: 'loading' }], []);
  const [localBtns, setLocalBtns] = useState<IButton[]>(
    () => (Array.isArray(btns) && btns.length ? btns : (defaultOptions as any))
  );

  // Sync local list with props
  useEffect(() => {
    if (!Array.isArray(btns)) return;
    setLocalBtns((prev) => (shallowEqualArray(prev, btns) ? prev : btns));
  }, [btns]);

  // Re-resolve variants on group variant change (covers "bundle" + themes)
  useEffect(() => {
    setLocalBtns((prev) => [...prev]);
  }, [variant]);

  const handleSelect = useCallback(
    (e: any) => {
      const name: string | undefined =
        e?.target?.name ?? e?.currentTarget?.name ?? e?.target?.dataset?.name;
      if (!name) return;

      setLocalBtns((prev) => {
        const idx = prev.findIndex((b) => b?.name === name);
        if (idx < 0) return prev;

        const next = prev.slice();
        const curr = { ...next[idx] };

        // Toggle only when it's explicitly boolean
        if (typeof curr.checked === 'boolean') {
          curr.checked = !curr.checked;
        }

        next[idx] = curr;

        // Emit a synthetic event with the updated button as target/currentTarget
        const synthetic = {
          ...e,
          target: curr,
          currentTarget: curr,
          detail: { name: curr.name, checked: curr.checked, value: curr.value, variant: curr.variant },
        };
        onSelect?.(synthetic);

        return next;
      });
    },
    [onSelect]
  );

  const groupVariantClass = variant ? `btn-group--${variant}` : '';
  const isBundle = variant === 'bundle';

  return (<>
      <style jsx>{styles}</style>
      <div className={`btn-group ${groupVariantClass}`}>
        {label && (
          <div className="btn-group--header">
            <div className="btn-group--header__title">
              {typeof label === 'string' ? label : <UiHeader title="" />}
            </div>
          </div>
        )}

        <div className="btn-group--content">
          {isBundle ? (
            // BYPASS AdaptGrid in "bundle": simple wrapping row, buttons size to text
            <div className="btn-group__bundle-row">
              {localBtns.map((butt, index) => {
                const key = (butt?.name as string) ?? String(index);
                const isActive = butt?.checked === true;
                const isInactive = butt?.checked === false;
                const itemVariant = resolveItemVariant(butt, variant);
                
                return (
                  <div
                  key={index + key}
                  className={[
                    'btn-group__item',
                    itemVariant ? `btn-group__item--${itemVariant}` : '',
                    isActive ? 'active' : '',
                    isInactive ? 'inactive' : '',
                  ]
                  .filter(Boolean)
                  .join(' ')}
                  onMouseEnter={(ev) => {
                    if (isInactive) ev.currentTarget.classList.add('sunglass-text', 'sunglass-wipe');
                  }}
                  onMouseLeave={(ev) => {
                    if (isInactive) ev.currentTarget.classList.remove('sunglass-text', 'sunglass-wipe');
                  }}
                  >
                    <UiButton
                      name={butt?.name}
                      size={btnSize}
                      key={key}
                      onClick={handleSelect}
                      traits={butt?.traits || (butt?.checked ? { afterIcon: 'fa-check' } : undefined)}
                      value={butt?.value}
                      type={butt?.type}
                      disabled={butt?.disabled}
                      variant={itemVariant}
                      busy={localBtns === (defaultOptions as any)}
                      >
                      {typeof butt?.label === 'string'
                        ? butt.label
                        : (typeof butt?.label === 'object' && (butt.label as any)?.text) || ''}
                    </UiButton>
                  </div>
                );
              })}
            </div>
          ) : (
            // Default: keep using AdaptGrid
            <AdaptGrid {...(typeof size === 'object' ? size : { xs: 1 })} gap={10}>
              {localBtns.map((butt, index) => {
                const key = (butt?.name as string) ?? String(index);
                const isActive = butt?.checked === true;
                const isInactive = butt?.checked === false;
                const itemVariant = resolveItemVariant(butt, variant);
                
                return (
                  <div
                  key={index + key}
                  className={[
                    'btn-group__item',
                    itemVariant ? `btn-group__item--${itemVariant}` : '',
                    isActive ? 'active' : '',
                    isInactive ? 'inactive' : '',
                  ]
                  .filter(Boolean)
                  .join(' ')}
                  onMouseEnter={(ev) => {
                    if (isInactive) ev.currentTarget.classList.add('sunglass-text', 'sunglass-wipe');
                  }}
                    onMouseLeave={(ev) => {
                      if (isInactive) ev.currentTarget.classList.remove('sunglass-text', 'sunglass-wipe');
                    }}
                  >
                    <UiButton
                      name={butt?.name}
                      size={btnSize}
                      key={key}
                      onClick={handleSelect}
                      traits={butt?.traits || (butt?.checked ? { afterIcon: 'fa-check' } : undefined)}
                      value={butt?.value}
                      type={butt?.type}
                      disabled={butt?.disabled}
                      variant={itemVariant}
                      busy={localBtns === (defaultOptions as any)}
                    >
                      {typeof butt?.label === 'string'
                        ? butt.label
                        : (typeof butt?.label === 'object' && (butt.label as any)?.text) || ''}
                    </UiButton>
                  </div>
                );
              })}
            </AdaptGrid>
          )}
        </div>
      </div>
              </>

  );
};

export default UiButtonGroup;
