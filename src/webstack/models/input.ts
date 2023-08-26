import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import { FormControlProps } from "@webstack/components/FormControl/FormControl";

export type ValueType = string | number;

export interface InputProps extends FormControlProps {
  name?: string;
  type?: string;
  disabled?: boolean;
  value?: ValueType;
  defaultValue?: string | number | readonly string[] | undefined;
  onPaste?: (e: any) => void;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  placeholder?: string;
  variant?: IVariant;
  min?: number;
  max?: number;
  autoComplete?: string;
}