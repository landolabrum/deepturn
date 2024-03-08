import { IFormControlVariant } from "@webstack/components/AdapTable/models/IVariant";
import { IFormControl, IFormControlSize } from "@webstack/components/FormControl/FormControl";


export type ValueType = any;
// export type ValueType = string | number | UserAddress | boolean;

export interface IInput extends IFormControl {
  name?: string;
  size?: IFormControlSize | 'sm';
  error?: string | null;
  label?: string;
  type?: string;
  id?: string;
  disabled?: boolean;
  autoFill?: boolean;
  value?: ValueType;
  defaultValue?: string | number | readonly string[] | undefined;
  onClick?: (e:any)=>void;
  onPaste?: (e: any) => void;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onDelete?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  placeholder?: string;
  variant?: IFormControlVariant;
  min?: number;
  max?: number;
  autoComplete?: 'on' | 'off';
  message?: string;
  focus?: boolean;
  required?: boolean;
  'data-element'?: string;
} 