import { useEffect, useState } from "react";
import { IFormField } from "../models/IFormModel";



type OFormState = [
    fields: IFormField[],
    setField: (e: any) => void
]
export const useFormState = (
    startFields : IFormField[]): OFormState => {
    const [fields, setFieldState] = useState(startFields);

    const [disabled, setDisabledState] = useState<boolean>(true);
    const setDisabled = (state: boolean) => {
        state !== undefined && setDisabledState(state);
    }
    const setFields = (fields: IFormField[]) => {
        fields !== undefined && setFieldState(fields);
    }
    const setField = (e: any) => {
        const { name, value } = e.target;
        const updateFields = fields.map((field: IFormField) => {
            let f = field;
            if (field.name == name) {
                if (field.name == 'value' && String(field.value).length >= 3) f.error = 'too long';
                else if (field.error) delete f.error;
                f.value = value;
            }
            return f;
        });
        setDisabled(Boolean(updateFields.find((field: IFormField) => { return field.value == undefined || field.value == 0 })));
        setFields(updateFields);
    };
    useEffect(()=>{
        
    },[setField]);
    return [fields, setField];
};
