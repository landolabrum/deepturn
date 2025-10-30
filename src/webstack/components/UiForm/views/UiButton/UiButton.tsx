import React, { FC } from "react";
import styles from "./UiButton.scss";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import FormControl, {
  IFormControl,
  IFormControlSize,
} from "@webstack/components/UiForm/components/FormControl/FormControl";
import Link from "next/link";
import { IFormControlVariant } from "../../../AdapTable/models/IVariant";
import { useRouter } from "next/router";

/* -------------------------------- types -------------------------------- */

type FCBase = Omit<IFormControl, "children"> & {
  children?: IFormControl["children"];
};

export interface IButton extends FCBase {
  onClick?: (e: any) => void;
  onEnter?: (e: any) => void;
  onLeave?: (e: any) => void;
  disabled?: boolean;
  busy?: boolean;
  href?: string;
  name?: string;
  target?: string;
  rel?: string;
  size?: IFormControlSize;
  type?: "button" | "submit" | "reset";
  variant?: IFormControlVariant | "disabled" | "link";
  traits?: Record<string, any>;
}

/* ------------------------------ utils/helpers ------------------------------ */

const ensureSafeRel = (target?: string, rel?: string) => {
  const base = (rel || "").trim();
  if (target === "_blank") {
    const parts = new Set(
      base.split(/\s+/).filter(Boolean).map((s) => s.toLowerCase())
    );
    parts.add("noopener");
    parts.add("noreferrer");
    return Array.from(parts).join(" ");
  }
  return base || undefined;
};

/* ------------------------------ render pieces ------------------------------ */

const Spinner: FC = () => (
  <div className="busy-spinner" aria-hidden="true">
    <UiIcon icon="spinner" />
  </div>
);

/** Native <button> (used when NO href) */
const ButtonInner: FC<IButton> = (context) => {
  const traits = { ...(context.traits ?? {}), disabled: context.disabled };
  const isDisabled = context.disabled || context.variant === "disabled";

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    context.onClick?.(e);
  };

  const handleEnter = (e: any) => context.onEnter?.(e);
  const handleLeave = (e: any) => context.onLeave?.(e);

  return (
    <>
      <style jsx>{styles}</style>
      <FormControl
        label={context.label}
        size={context.size}
        variant={context.variant}
        traits={traits}
      >
        <button
          data-element="button"
          type={context.type || "button"}
          className={typeof context.variant === "string" ? context.variant : ""}
          onClick={handleClick}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onTouchStart={handleEnter}
          onTouchEnd={handleLeave}
          disabled={isDisabled}
        >
          {context.busy ? <Spinner /> : context.children}
        </button>
      </FormControl>
    </>
  );
};

/** Anchor styled as a button (used when href IS present) */
const AnchorButton: FC<IButton> = (context) => {
  const {
    href = "#",
    target,
    rel,
    variant,
    size,
    label,
    traits,
    busy,
    disabled,
    onEnter,
    onLeave,
    children,
  } = context;

  const safeRel = ensureSafeRel(target, rel);
  const isDisabled = disabled || variant === "disabled";

  if (isDisabled) {
    return (
      <>
        <style jsx>{styles}</style>
        <FormControl
          label={label}
          size={size}
          variant="disabled"
          traits={{ ...(traits ?? {}), disabled: true }}
        >
          <span
            data-element="button"
            aria-disabled="true"
            className={`disabled ${typeof variant === "string" ? variant : ""}`}
            onMouseEnter={onEnter as any}
            onMouseLeave={onLeave as any}
            onTouchStart={onEnter as any}
            onTouchEnd={onLeave as any}
          >
            {busy ? <Spinner /> : children}
          </span>
        </FormControl>
      </>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>
      <FormControl label={label} size={size} variant={variant} traits={traits}>
        <Link
          href={href}
          target={target}
          rel={safeRel}
          className={`ui-button__anchor ${typeof variant === "string" ? variant : ""}`}
          onMouseEnter={onEnter as any}
          onMouseLeave={onLeave as any}
          onTouchStart={onEnter as any}
          onTouchEnd={onLeave as any}
        >
          {busy ? <Spinner /> : children}
        </Link>
      </FormControl>
    </>
  );
};

/* --------------------------------- export --------------------------------- */

const UiButton: FC<IButton> = (props) => {
  const {
    href,
    target,
    rel,
    onClick,
    children,
    variant,
    disabled,
    busy,
    traits,
    label,
    type,
    size,
  } = props;

  const router = useRouter();
  const selfLink = href && href !== "/" && router.asPath === href;

  if (href && !selfLink) {
    return (
      <AnchorButton
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        variant={variant}
        size={size}
        disabled={disabled}
        busy={busy}
        traits={traits}
        label={label}
      >
        {children}
      </AnchorButton>
    );
  }

  return (
    <ButtonInner
      type={type}
      onClick={onClick}
      variant={selfLink ? "disabled" : variant}
      size={size}
      disabled={disabled || !!selfLink}
      busy={busy}
      traits={traits}
      label={label}
    >
      {children}
    </ButtonInner>
  );
};

export default UiButton;
