// webapp/src/webstack/components/UiForm/functions/useFormState.ts

import { useEffect, useState } from "react";
import { IFormField } from "../models/IFormModel";

type OFormState = [
  fields: IFormField[],
  // flexible setter: event | functional-updater | full array
  setField: (
    e:
      | { target: { name: string; value: any } }
      | ((prev: IFormField[]) => IFormField[])
      | IFormField[]
  ) => void
];

export const useFormState = (startFields: IFormField[]): OFormState => {
  const [fields, setFieldState] = useState<IFormField[]>(startFields);
  const [disabled, setDisabledState] = useState<boolean>(true);

  const calcDisabled = (arr: IFormField[]) =>
    Boolean(arr.find((field) => field.value === undefined || field.value === 0));

  const setDisabled = (state: boolean) => {
    if (state !== undefined) setDisabledState(state);
  };

  const setFields = (arr: IFormField[]) => {
    if (arr !== undefined) setFieldState(arr);
  };

  const setField = (
    arg:
      | { target: { name: string; value: any } }
      | ((prev: IFormField[]) => IFormField[])
      | IFormField[]
  ) => {
    // 1) functional updater form
    if (typeof arg === "function") {
      setFieldState((prev) => {
        const next = (arg as (p: IFormField[]) => IFormField[])(prev);
        setDisabled(calcDisabled(next));
        return next;
      });
      return;
    }

    // 2) full array form
    if (Array.isArray(arg)) {
      const next = arg as IFormField[];
      setDisabled(calcDisabled(next));
      setFields(next);
      return;
    }

    // 3) event form
    const name = arg?.target?.name as string | undefined;
    const value = arg?.target?.value;

    if (!name) {
      // nothing to update; ignore quietly
      return;
    }

    setFieldState((prev) => {
      const next = prev.map((field) => {
        if (field.name !== name) return field;
        const f: IFormField = { ...field };
        if (f.name === "value" && String(f.value ?? "").length >= 3) {
          f.error = "too long";
        } else if (f.error) {
          delete f.error;
        }
        f.value = value;
        return f;
      });
      setDisabled(calcDisabled(next));
      return next;
    });
  };

  useEffect(() => {
    // keep API stable; nothing needed here now
  }, [setField]);

  return [fields, setField];
};
