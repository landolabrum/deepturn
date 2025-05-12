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

export const fieldType = (field: any) => {
    const fieldTypeFromValue = (value: any): string => {
        if (typeof value === 'boolean') return 'checkbox';
        if (typeof value === 'number') return 'tel';
        if (typeof value === 'string' && (value === 'true' || value === 'false')) return 'checkbox';
        return 'text';
    };
    const isText = fieldTypeFromValue(field?.value) == 'text';
    if (field.type == 'radio' && field?.options) return 'radio';
    if (field.type == 'checkbox') return 'checkbox';
    else if (isText && field.type !== 'select' && field.name !== 'address') return 'text';
    else if (field.name == 'address') return 'address';
    else if (field?.type == 'select' && field?.options !== undefined) return 'select';
    else if (field.type == 'pill' || typeof field.value == 'number') return 'pill';
    return false;
}
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
