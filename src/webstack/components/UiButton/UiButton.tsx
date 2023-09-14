import React, { useEffect } from "react";
import styles from "./UiButton.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import type { NextComponentType, NextPageContext } from "next";
import FormControl, { IFormControl as IFormControl } from "../FormControl/FormControl";
import Link from "next/link";
import type { FC } from "react";

interface ILinkProvider {
  href?: string;
  target?: string;
  children?: React.ReactElement | React.ReactFragment;
  rel?: string;
  formControl?: boolean;
}

export const LinkProvider: FC<ILinkProvider> = ({ href, target, children, rel, formControl = true }) => {
  if (!href) return <>NO HREF</>;
  if (formControl)
    return (<>
      <style jsx>{styles}</style>
      <FormControl variant="inherit" >
        <Link className="ui-button__link-provider" href={href} target={target} rel={rel ? rel : "noopener noreferrer"}>
          {children}
        </Link>
      </FormControl>
    </>
    );
  return (
    <>
      <style jsx>{styles}</style>
      <Link href={href} target={target} rel={rel ? rel : "noopener noreferrer"} style={{ width: "100%" }}>
        {children}
      </Link>
    </>
  );
};
interface IButton extends IFormControl {
  onClick?: (e: any) => void;
  disabled?: boolean;
  busy?: boolean;
  href?: string;
  target?: string;
  type?: "button" | "submit" | "reset";
}

interface IButtonContext extends IButton {
  context: IButton;
}

const ButtonContext = ({ context }: IButtonContext) => {
  let traits = context.traits ? context.traits : {};
  if (context.disabled == true) traits['disabled'] = true;
  
  useEffect(() => {}, []);
  return (
    <>
      <style jsx>{styles}</style>
      <FormControl label={context.label} variant={context.variant} traits={traits}>
        <button
          type={context?.type && context?.type}
          className={context?.variant ? context?.variant : ""}
          onClick={context?.onClick}
          disabled={context?.disabled || context?.variant === "disabled"}
        >
          {context?.busy && (
            <div className="busy-spinner">
              <UiIcon icon="spinner" />
            </div>
          )}
          {!context?.busy && context?.children}
        </button>
      </FormControl>
    </>
  );
};

const UiButton: NextComponentType<NextPageContext, {}, IButton> = ({
  href,
  target,
  onClick,
  children,
  variant,
  disabled,
  busy,
  traits,
  label,
  type
}: IButton) => {
  if (href)
    return (
      <>
        <style jsx>{styles}</style>
        <LinkProvider href={href} target={target} formControl={false}>
          <ButtonContext context={{ onClick, children, variant, disabled, busy, traits, label }} />
        </LinkProvider>
      </>
    );

  return <ButtonContext context={{ onClick, children, variant, disabled, busy, traits, label }} />;
};

export default UiButton;
