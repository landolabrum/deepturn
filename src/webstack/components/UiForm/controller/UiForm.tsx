import React, { useState, useEffect } from 'react';
import UiInput from '../components/UiInput/UiInput';
import UiUpload from '../components/UiUpload/controller/UiUpload';
import styles from './UiForm.scss';
import UiButton from '../views/UiButton/UiButton';
import { IForm, IFormField } from '../models/IFormModel';
import UiSelect from '../components/UiSelect/UiSelect';
import UiLoader from '../../UiLoader/view/UiLoader';
import ToggleSwitch from '../components/UiToggle/UiToggle';
import FormControl from '../components/FormControl/FormControl';
import AddFieldForm from '../views/AddFieldForm/AddFieldForm';
import AutocompleteAddressInput from '@webstack/components/UiForm/components/UiInput/views/AddressInput/controller/AddressInput';
import { fieldType } from '../functions/formFieldFunctions';
import UiMultiSelect from '../components/UiMultiSelect/controller/UiMultiSelect';

const UiForm = ({
  variant,
  fields,
  onSubmit,
  onError: onLocalErrors,
  title,
  submitText,
  submitIcon,
  onChange,
  loading,
  disabled,
  onAddField,
  size
}: IForm): React.JSX.Element => {
  
  const [complete, setComplete] = useState<boolean>(false);
  const [localErrors, setLocalErrors] = useState<any>({});

  const handleComplete = () => {
    if (!fields) return;
    fields.forEach((f: any) => f.required && ![undefined, '', null].includes(f.value) && setComplete(true));
    const noneRequired = fields.filter(f => f.required)?.length == 0;
    if (noneRequired && !complete) setComplete(true);
  };

  const handleInputChange = (e: any, constraints?: IFormField['constraints']) => {
    if (onChange) return onChange(e);
  };

  const handleClick = (e: any, constraints?: IFormField['constraints']) => {
    console.log({ e: e?.onClick })
    // if (e) return onClick(e);
  };

  const handleFileUpload = (fieldName: string, file: File) => {
    const e = { target: { name: fieldName, value: file } };
    handleInputChange(e);
  };

  const handleFileRemove = (fieldName: string, index: number) => {
    const targetField = fields && fields.find(f => f.name === fieldName);
    if (!targetField) return;

    const newValue = Array.isArray(targetField.value)
      ? targetField.value.filter((_: any, i: number) => i !== index)
      : [];

    handleInputChange({ target: { name: fieldName, value: newValue } });
  };

  const handleSubmit = () => {
    if (!fields || !onSubmit) return;

    let newErrors = { ...localErrors };

    fields.forEach((f: any) => {
      if (f.constraints) {
        const min = f.constraints?.min;
        const max = f.constraints?.max;
        const valueLen = String(f.value).replaceAll(' ', '').length;
        if (min != undefined && valueLen) {
          if (localErrors[f.name] !== undefined) { delete newErrors[f.name]; }
          else if (valueLen < min) { newErrors[f.name] = `*${f.name} is not long enough`; }
        }
        if (max != undefined) {
          if (localErrors[f.name] !== undefined) { delete newErrors[f.name]; }
          else if (valueLen > max) { newErrors[f.name] = `*${f.name} is too long`; }
        }
      }
    });
    setLocalErrors(newErrors);

    if (Object.keys(newErrors).length == 0) {
      onSubmit(fields);
    } else if (onLocalErrors) {
      onLocalErrors(newErrors);
    }
  };

  // Update for pill input (fine control for decimal increments)
  const handlePill = (e: any, field: IFormField, direction?: string) => {
    if (direction && onChange) {
      const val = () => {
        let newPillVal = parseFloat(String(field.value)); // Ensure we're dealing with a number, even as a string

        // Fine-tune increment/decrement for decimal values
        const step = field?.step|| 0.1;  // You can adjust this to allow finer control, e.g., 0.01 for more precision.

        if (direction === 'minus') {
          newPillVal = Math.max(field.min ?? newPillVal - step, newPillVal - step);
        } else {
          newPillVal = Math.min(field.max ?? newPillVal + step, newPillVal + step);
        }

        return newPillVal;
      };

      const target = { target: { name: field.name, value: val() } };
      return onChange(target);
    }

    let { name, value } = e.target;
    if (value && String(value).charAt(0) === '0') value = value.slice(1, value.length);
    value = parseFloat(value); // Ensure it's a decimal value, not an integer

    if (field?.min !== undefined && value < field.min) value = field.min;
    if (field?.max !== undefined && value > field.max) value = field.max;

    return handleInputChange({ target: { name, value: String(value) } });
  };

  const fieldsCanPopulate = Array(fields)?.length;

  useEffect(() => {
    handleComplete();
  }, [onChange,]);

  if (!fields) return <div className='error'>No form fields</div>;

  return (
    <>
      <style jsx>{styles}</style>
      {title && <div className="form__title">{title}</div>}
      <div className={`form ${(
        variant && ` form--${variant}`
      ) || ""} ${size ? `form--${size}` : ''}`}>
        {fieldsCanPopulate &&
          fields.map(
            (field, index) =>
              field.name &&
              field.readonly === true && (
                <div
                  key={index}
                  className={`form-field__readonly ${field.error && "error"} ${size && `form-field--${size}`}`}
                  style={field?.width ? { width: `calc(${field.width} - 8px)` } : {}}
                >
                  <div className="form-field__readonly--label">{field?.label}</div>
                  <div className="form-field__readonly--value">
                    {(typeof field.value !== "object" && `${field?.value}`) ||
                      (field.value && (
                        <div className="object-list">
                          {Object.entries(field.value).map(([chK, chV]: any) => (
                            <span className="object-item" key={chK}>
                              <span className="object-item--key">{chK}:</span>
                              <span className="object-item--value">{JSON.stringify(chV).replaceAll('"', "")}</span>
                            </span>
                          ))}
                        </div>
                      ))}
                  </div>
                </div>
              )
          )}

        {fieldsCanPopulate &&
          fields.map(
            (field, index) =>
              field.name &&
              !field.readonly && (
                <div
                  key={index}
                  className={`form-field ${size && `form-field--${size}` || ''}`}
                  style={typeof field?.width == "string" ? { width: `calc(${field.width} - 6px)` } : {}}
                >
                  {fieldType(field) == "button" && (
                    <UiButton

                      variant={Boolean(field?.error) ? "invalid" : variant || field?.variant}

                      name={field?.name} onClick={field?.onClick}>
                      {field?.label || field?.name || "N/A"}
                    </UiButton>
                  )}
                  {fieldType(field) == "multi-select" && (
                    <UiMultiSelect
                      {...field}
                      value={Array.isArray(field.value) ? (field.value as string[]) : []}
                      onChange={(e) => handleInputChange(e)}
                    />
                  )}

                  {fieldType(field) == "file" && (
                    <UiUpload
                      title={field.placeholder || "Upload File"}
                      onFileUpload={(file) => handleFileUpload(field.name, file)}
                      onFileRemove={(index) => handleFileRemove(field.name, Number(index))}
                      multiple={field?.multiple}
                      maxFiles={field?.maxFiles}
                      value={
                        Array.isArray(field?.value)
                          ? field.value.map((file: any) =>
                            file instanceof File
                              ? {
                                src: URL.createObjectURL(file),
                                name: file.name,
                                type: file.type,
                              }
                              : typeof file === "string" || typeof file === "number"
                                ? { src: String(file) }
                                : file
                          )
                          : []
                      } // Pass the existing files (preloaded) here
                    />
                  )}
                  {fieldType(field) == "text" && (
                    <UiInput
                      size={size}
                      autoComplete={field.autoComplete}
                      label={field.label}
                      variant={Boolean(field?.error) ? "invalid" : variant || field?.variant}
                      disabled={field?.disabled}
                      error={field.error}
                      type={field.type}
                      required={field.required}
                      traits={field.traits}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={typeof field.value === "string" ? field.value : ""}
                      onChange={(e) => handleInputChange(e, field.constraints)}
                    />
                  )}
                  {fieldType(field) == "address" && (
                    <div className="s-w-100">
                      <AutocompleteAddressInput
                        variant={Boolean(field?.error) ? "invalid" : variant || field?.variant}
                        label={field.label || "address"}
                        address={field.value}                             // ✅ controlled value
                        error={field?.error}
                        name={field.name}
                        setAddress={(e) => handleInputChange(e, field.constraints)}
                        size={size}
                      />
                    </div>
                  )}

                  {fieldType(field) == "radio" && (
                    <ToggleSwitch
                      label={field.label}
                      name={field.name}
                      disabled={field?.disabled}
                      onChange={(e) => handleInputChange(e, field?.constraints)}
                      value={Boolean(field?.value)}
                    />
                  )}

                  {fieldType(field) == "checkbox" && (
                    <>
                      <ToggleSwitch
                        label={field.label}
                        name={field.name}
                        disabled={field?.disabled}
                        onChange={(e) => handleInputChange(e, field?.constraints)}
                        value={Boolean(field?.value)}
                      />
                      <div className="field-msg">{field?.msg}</div>
                    </>
                  )}
                  {fieldType(field) == "select" && (
                    <UiSelect
                      size={size}
                      variant={field?.variant || variant}
                      traits={field.traits}
                      options={field?.options}
                      label={field.name}
                      value={String(field?.value)}
                      input={field?.input ? Boolean(field.input) : undefined}
                      onSelect={(e) => handleInputChange({ target: { name: field.name, value: e } }, field.constraints)}
                    />
                  )}

                  {fieldType(field) == "pill" && (
                    <FormControl
                      label={field?.error ? `${field.label} *${field.error}*` : field.label}
                      variant={
                        (field.error && "invalid") ||
                        (Boolean((field?.min && field.value == field.min) || (field.max && field.value == field.max)) &&
                          "bump pill") ||
                        "pill"
                      }
                      size={size}
                      traits={{
                        beforeIcon: { icon: "fas-minus", onClick: () => handlePill(undefined, field, "minus") },
                        afterIcon: { icon: "fas-plus", onClick: () => handlePill(undefined, field, "plus") },
                      }}
                    >
                      <input
                        name={field.name}
                        type="number"
                        min={field?.min}
                        max={field?.max}
                        value={isNaN(Number(field.value)) ? "0" : String(field.value)}
                        placeholder={field?.placeholder}
                        step="0.1" // Fine adjustments by 0.1 decimals
                        onChange={(e) => handlePill(e, field, undefined)}
                      />
                    </FormControl>
                  )}
                </div>
              )
          )}

        {!fieldsCanPopulate && <UiLoader position="relative" />}

        {onAddField && <AddFieldForm onAddField={onAddField} />}

        {onSubmit && (
          <div className={`form__submit ${(variant && ` form__submit--${variant}`) || ""}`}>
            <UiButton
              size={size}
              onClick={handleSubmit}
              traits={{ afterIcon: submitIcon }}
              disabled={disabled || !complete}
              variant={!disabled && complete && "glow"}
              type="submit"
              busy={loading == true}
            >
              {submitText ? submitText : "Submit"}
            </UiButton>
          </div>
        )}
      </div>
    </>
  );
};

export default UiForm;
