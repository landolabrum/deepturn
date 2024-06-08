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
export const findField = (fields: IFormField[], fieldName:string) => {
    const _field = fields && Object(fields).filter((field: IFormField)=>field.name == fieldName);
    return _field[0];
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