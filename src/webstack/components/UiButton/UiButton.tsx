import React from "react";
import styles from "./UiButton.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import type { NextComponentType, NextPageContext } from "next";
import FormControl, { FormControlProps } from "../FormControl/FormControl";
import Link from "next/link";
import type { FC } from "react";

interface LinkProviderProps {
  href?: string;
  target?: string;
  children?: React.ReactElement | React.ReactFragment;
  rel?: string;
  formControl?: boolean;
}

export const LinkProvider: FC<LinkProviderProps> = ({ href, target, children, rel, formControl = true }) => {
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
    <Link href={href} target={target} rel={rel ? rel : "noopener noreferrer"} style={{width:"100%"}}>
      {children}
    </Link>
    </>
  );
};
interface ButtonProps extends FormControlProps {
  onClick?: (e: any) => void;
  disabled?: boolean;
  busy?: boolean;
  href?: string;
  target?: string;
}

interface ButtonContextProps extends ButtonProps {
  context: ButtonProps;
}

const ButtonContext = ({ context }: ButtonContextProps) => {
  return (
    <>
      <style jsx>{styles}</style>
      <FormControl label={context.label} variant={context.variant} traits={context.traits}>
        <button
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

const UiButton: NextComponentType<NextPageContext, {}, ButtonProps> = ({
  href,
  target,
  onClick,
  children,
  variant,
  disabled,
  busy,
  traits,
  label,
}: ButtonProps) => {
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
