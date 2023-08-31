import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import { ITraits } from "@webstack/components/FormControl/FormControl";

export type IFormMinMax = {
    value?: number;
    message?: string;
};
export type IFormField = {
    name?: string;
    width?: string;
    value?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    traits?: ITraits;
    variant?: IVariant;
    constraints?: {
        min?: IFormMinMax | number;
        max?: IFormMinMax | number;
        required?: boolean | {
            message?: string
        };
    }
}

export interface IForm {
    fields?: IFormField[];
    title?: string | React.ReactElement;
    btnText?: string | React.ReactElement;
    onChange?: (e: any) => void;
    onSubmit?: (e: any) => void;
    onError?: (e: any) => void;
    collapse?: boolean;
}