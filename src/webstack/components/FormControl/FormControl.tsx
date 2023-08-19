import type { NextComponentType, NextPageContext } from "next";
import styles from "./FormControl.scss";
import { VariantProps } from "@webstack/components/AdapTable/models/IVariant";
import { Children, cloneElement, useEffect, useRef, useState } from "react";
import { OverlayProps, useOverlay } from "@webstack/components/Overlay/Overlay";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import createTestId from "@webstack/helpers/createTestId";

type FormIconProps =
  | {
      icon: string;
      onClick: (e: any) => void;
    }
  | string;
export type ITraits =  {
  beforeIcon?: FormIconProps;
  width?: number | string;
  height?: number | string;
  afterIcon?: FormIconProps;
  badge?: any;
  responsive?:boolean;
};

export interface FormControlProps {
  label?: string | React.ReactElement;
  variant?: VariantProps;
  overlay?: boolean;
  setOverlay?: (e: OverlayProps) => void;
  children?: string | React.ReactElement | React.ReactFragment | number;
  traits?: ITraits;
}

// FormControl component for rendering form controls with label, icons, and overlay support
const FormControl: NextComponentType<NextPageContext, {}, FormControlProps> = ({
  label,
  children,
  variant,
  overlay,
  setOverlay,
  traits,
}: FormControlProps) => {
  const cyprus_test_key = "data-testid";

  const [overlay_, setOverlay_] = useOverlay();
  const ref = useRef<any>(null);
  const childRef = useRef<any>(null);
  const [testId, setTestId] = useState<string>("");

  useEffect(() => {

    // Set width if provided
    if (traits?.width && ref.current) {
      if (typeof traits.width === "number") ref.current.style.width = `${traits.width}px`;
      if (typeof traits.width === "string") ref.current.style.width = traits.width;
    }
    if (traits?.height && ref.current) {
      if (typeof traits.height === "number") ref.current.style.height = `${traits.height}px`;
      if (typeof traits.height === "string") ref.current.style.height = traits.height;
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
  }, [overlay, setOverlay_, traits?.width, traits?.height]);

  useEffect(() => {
    setTestId(createTestId(ref.current.parentNode, childRef.current));
  }, []);
  // }, [ref]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`form-control ${variant === "inherit" ? " form-control-inherit" : ""}`} ref={ref}>
        {label && <label>{label}</label>}
        <div
          className={`form-control__element${traits?.responsive?" form-control__element-responsive":""}${typeof variant === "string" ? ` form-control__element-${variant}` : ""}`}
        >
          {traits?.beforeIcon && (
            <div className="form-control_before-icon">
              <UiIcon
                onClick={(typeof traits?.beforeIcon !== "string" && traits?.beforeIcon?.onClick) || (() => null)}
                icon={typeof traits?.beforeIcon === "string" ? traits?.beforeIcon : traits?.beforeIcon?.icon}
              />
            </div>
          )}
          {Children.map(children, (child: any) => {
            return cloneElement(child, { ref: childRef, [cyprus_test_key]: testId });
          })}
          {traits?.badge && <div className="form-control__badge">
          <div className="form-control__badge-content">
            {traits.badge}
            </div>
            </div>
            }
          {traits?.afterIcon && (
            <div className="form-control_after-icon">
              <UiIcon
                onClick={(typeof traits?.afterIcon !== "string" && traits?.afterIcon?.onClick) || (() => null)}
                icon={typeof traits?.afterIcon === "string" ? traits?.afterIcon : traits?.afterIcon?.icon}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormControl;
