// normalize.ts
export function normalizeFormEvent(eOrValue: any, name?: string) {
  // UiForm controls sometimes send: DOM event, boolean, option object, etc.
  if (eOrValue?.target?.name) return eOrValue; // already DOM-like

  // ToggleSwitch often passes a boolean; UiSelect may pass {value, label}
  let value =
    typeof eOrValue === "object" && eOrValue && "value" in eOrValue
      ? (eOrValue as any).value
      : eOrValue;

  return {
    target: {
      name: name!,                 // parent knows which field this was for
      value,
      type: typeof value === "boolean" ? "checkbox" : undefined,
      checked: typeof value === "boolean" ? value : undefined,
    },
  };
}
