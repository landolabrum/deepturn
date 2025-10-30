// servers/frontend/Deepturn/app/src/webstack/components/UiForm/functions/formFieldFunctions.ts

import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { IFormField } from "../models/IFormModel";
import { dateFormat, numberToUsd } from "@webstack/helpers/userExperienceFormats";

// UPDATE FIELD IN FORM
export const updateField = (fields: IFormField[], name: string, updatedValues: Partial<IFormField>): IFormField[] =>
    fields.map((field) =>
        field.name === name ? { ...field, ...updatedValues } : field
    );

// GET FIELD IN FORM
export const findField = (fields: IFormField[], name: string): IFormField | undefined =>
    fields?.find((field) => field.name === name);

// GET FIELD TYPE

// src/webstack/components/UiForm/functions/formFieldFunctions.ts
export const fieldType = (field: any) => {
  const t = String(field?.type ?? '').toLowerCase();

  // 1) Explicit types take precedence
  if (t === 'button')       return 'button';
  if (t === 'address')      return 'address';     // ← ensures AddressInput renders (works with data.address too)
  if (t === 'multi-select') return 'multi-select';
  if (t === 'select' && field?.options) return 'select';
  if (t === 'radio'  && field?.options) return 'radio';
  if (t === 'checkbox')     return 'checkbox';
  if (t === 'file')         return 'file';
  if (t === 'pill')         return 'pill';

  // 2) Implicit fallback (only when no explicit type specified)
  const v = field?.value;
  if (typeof v === 'boolean') return 'checkbox';
  if (typeof v === 'number')  return 'pill';      // your numeric stepper UX
  if (typeof v === 'string' && (v === 'true' || v === 'false')) return 'checkbox';

  // 3) Default
  return 'text';
};


// CREATE FIELD
export const createField = (newField: any): IFormField | undefined => {
    const currencyFields = ['balance', 'unit_amount'];
    const { name, value }: any = newField;

    if (!name) return; // Prevent creating fields without a name.

    const field: IFormField = {
        ...newField,
        label: keyStringConverter(name),
    };

    const valueType = (field: IFormField) =>
        typeof value || field.type || (value == null ? 'null' : 'text');

    switch (valueType(field)) {
        case 'string':
            field.type = name === 'password' ? 'password' : 'text';
            break;
        case 'boolean':
            field.type = 'checkbox';
            break;
        case null:
            field.error = "can't be blank";
            break;
        case 'number':
            if (field.name === 'created' && field.value) {
                field.value = dateFormat(field.value, { isTimestamp: true });
            }
            if (currencyFields.includes(field.name) && field.value != null) {
                field.value = numberToUsd(Number(field.value));
            }
            field.type = 'tel';
            break;
        default:
            console.error("[ UNHANDLED OBJ ]", { field, vt: valueType(field) });
            break;
    } 
 
    return field;
};
export function formFieldsToDict(
  fields: IFormField[],
  keyName: string,
  valueName: string
): Record<string, string | number | boolean | null> {
    let context: Record<string, string | number | boolean | null> = {};
    Object.entries(fields).map(([f,k]) => {
        const rKey:any= k.name == keyName&&String(k.value);
        const rVal= findField(fields, valueName)?.value;
        if(rKey && rVal) {
            context = {
                ...context,
                [rKey]: rVal
            };
        }
    }).filter(Boolean);
 return context;
};
