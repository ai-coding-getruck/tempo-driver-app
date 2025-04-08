export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return !!value;
};

export const isEmail = (value: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
};

export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

export const isPhoneNumber = (value: string): boolean => {
  // Basic phone validation - adjust as needed for your requirements
  return /^\d{10,15}$/.test(value.replace(/[\s()-]/g, ""));
};

export const minLength = (value: string, length: number): boolean => {
  return value.length >= length;
};

export const maxLength = (value: string, length: number): boolean => {
  return value.length <= length;
};

export const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateForm = (
  values: Record<string, any>,
  rules: Record<string, any>,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.requiredMessage || "This field is required";
      return;
    }

    if (value) {
      if (fieldRules.email && !isEmail(value)) {
        errors[field] = fieldRules.emailMessage || "Invalid email address";
      } else if (fieldRules.numeric && !isNumeric(value)) {
        errors[field] = fieldRules.numericMessage || "Must be a number";
      } else if (fieldRules.phone && !isPhoneNumber(value)) {
        errors[field] = fieldRules.phoneMessage || "Invalid phone number";
      } else if (
        fieldRules.minLength &&
        !minLength(value, fieldRules.minLength)
      ) {
        errors[field] =
          fieldRules.minLengthMessage ||
          `Must be at least ${fieldRules.minLength} characters`;
      } else if (
        fieldRules.maxLength &&
        !maxLength(value, fieldRules.maxLength)
      ) {
        errors[field] =
          fieldRules.maxLengthMessage ||
          `Must be no more than ${fieldRules.maxLength} characters`;
      } else if (fieldRules.url && !isValidUrl(value)) {
        errors[field] = fieldRules.urlMessage || "Invalid URL";
      }
    }
  });

  return errors;
};
