// servers/frontend/Deepturn/app/src/webstack/components/UiForm/functions/formFieldFunctions.ts

import { IFormField } from "../models/IFormModel";



// UPDATE FIELD IN FORM
export const updateField = (fields: IFormField[], name: string, updatedValues: Partial<IFormField>): IFormField[] => {
    return fields.map((field) => {
        if (field.name === name) {
            return {
                ...field,
                ...updatedValues,
            };
        }
        return field;
    });
};

// GET FIELD IN FORM
export const findField = (fields: IFormField[], name: string): IFormField | undefined => {
    return fields?.find(field => field.name === name);
  };
// GET FIELD TYPE
export const getFieldType = (value: any): string => {
    let fieldType = 'text';
    switch (typeof value) {
        case 'number':
            fieldType = 'tel';
            break;
        case 'boolean':
            fieldType = 'checkbox';
            break;
        default:
            break;
    }
    return fieldType;
};