import { validateSync } from 'class-validator';

export const configValidationUtility = {
  validateConfig: (config: any) => {
    const errors = validateSync(config);
    if (errors.length > 0) {
      const sortedErrors = errors
        .map((error) => {
          return Object.values(error.constraints || {}).join(', '); // Исправлено
        })
        .join('; ');
      throw new Error('Validation failed: ' + sortedErrors);
    }
  },
  convertToBoolean: (value: any) => {
    if (typeof value === 'string') {
      value = value.trim().toLowerCase();
      if (value === 'true') return true;
      if (value === 'false' || value === '') return false;
    }
    return Boolean(value);
  },
};
