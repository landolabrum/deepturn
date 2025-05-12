import { IFormControlVariant } from "@webstack/components/AdapTable/models/IVariant";
import { ITraits } from "@webstack/components/UiForm/components/FormControl/FormControl";
import { UserAddress } from "~/src/models/ICustomer";

export type IFormMinMax = {
    value?: number;
    message?: string;
};
export type OForm = {
    fields?: {[key: string]: any;}
} | boolean | string;

export type IFormField = {
    name: string;
    id?: string;
    error?: string;
    options?:any;
    // options?: (string | IFormField | IRoute | number)[] | React.ReactElement[];
    width?: string;
    value?: string | boolean | UserAddress | number;
    label?: any;
    autoComplete?: 'on' | 'off';
    min?: number;
    max?: number;
    placeholder?: string;
    type?: string;
    // type?: 'button' | 'textarea' | 'color' |'text' | 'email' | 'datetime-local' | 'tel' | 'email' | 'checkbox' | 'radio' | 'month' | 'address' | 'file' | 'range' | 'date' | 'pill' | 'select';
    traits?: ITraits;
    variant?: IFormControlVariant;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    constraints?: {
        min?: IFormMinMax | number;
        max?: IFormMinMax | number;
        required?: boolean | {
            message?: string
        };
    }
    // OPTIONALS
    checked?: boolean;
    path?: string | string[];       
}

export interface IForm {
    onAddField?: (e:any)=>void;
    traits?: ITraits;
    variant?: IFormControlVariant;
    disabled?: boolean;
    loading?: OForm;
    submitIcon?: string;
    fields?: IFormField[];
    title?: string | React.ReactElement;
    submitText?: string | React.ReactElement;
    onChange?: (e: any) => void;
    onSubmit?: (e: any) => void;
    onError?: (e: any) => void;
    collapse?: boolean;
}