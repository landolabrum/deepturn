import { IFormField } from "../models/IFormModel";
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


export const findField = (fields: IFormField[], fieldName:string) => {
    const _field = fields && Object(fields).filter((field: IFormField)=>field.name == fieldName);
    return _field[0];
};
