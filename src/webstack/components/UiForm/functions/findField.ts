import { IForm, IFormField } from '../models/IFormModel';

const findField = (fields: IFormField[], fieldName:string) => {
    const _field = fields && Object(fields).filter((field: IFormField)=>field.name == fieldName);
    return _field[0];
};

export default findField;