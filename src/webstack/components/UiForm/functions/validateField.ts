type ValidateOptions = {
  label?: string;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  custom?: (value: string) => string | null;
};


export default function validateField(
  type: string,
  value: string | number | undefined | null,
  options?: ValidateOptions
): string | null {
  const str = String(value || '').trim();
  const label = options?.label || type;

  if (options?.minLength && str.length < options.minLength) {
    return `${label}: * Must be at least ${options.minLength} characters`;
  }

  if (options?.maxLength && str.length > options.maxLength) {
    return `${label}: * Must be less than ${options.maxLength + 1} characters`;
  }

  if (options?.regex && !options.regex.test(str)) {
    return `${label}: * Invalid format`;
  }

  if (options?.custom) {
    const customError = options.custom(str);
    if (customError) {
      return `${label}: * ${customError}`;
    }
  }

  switch (type) {
    case 'required':
      return str ? null : `${label}: * Required field`;

    case 'email':
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str)
        ? null
        : `${label}: * Invalid email address`;

    case 'phone':
      return str.length >= 10
        ? null
        : `${label}: * Phone number not long enough`;

    case 'name':
      if (str.length < 3) return `${label}: * First Name is too short`;
      if (!str.includes(' ')) return `${label}: * Full name must include a space`;
      if (/\d/.test(str)) return `${label}: * Name must not include numbers`;
      const [first, last] = str.split(' ');
      if (!last || last.length < 3) return `${label}: * Last Name is too short`;
      return null;

    case 'postal_code':
      return /^\d{5}(-\d{4})?$/.test(str)
        ? null
        : `${label}: * Invalid postal code`;

    default:
      return null;
  }
}
