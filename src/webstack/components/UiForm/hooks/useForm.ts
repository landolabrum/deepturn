import { useState, useCallback } from "react";

export interface FormField {
  name: string;
  label?: string;
  value?: string|number|boolean;
  error?: string;
  placeholder?: string;
  type?: string;
  width?: string;
  required?: boolean;
}

export const useFormFields = (initialFields: FormField[]) => {
  const [fields, setFields] = useState<FormField[]>(initialFields);

  const changeField = useCallback((name: string, key: keyof FormField, value: any) => {
    setFields((prev) =>
      prev.map((field) =>
        field.name === name ? { ...field, error: undefined, [key]: value } : field
      )
    );
  }, []);

  const findField = useCallback(
    (name: string) => fields.find((f) => f.name === name),
    [fields]
  );

  const setCustomFields = useCallback((newFields: FormField[]) => {
    setFields(newFields);
  }, []);

  return {
    fields,
    setFields: setCustomFields,
    changeField,
    findField
  };
};
