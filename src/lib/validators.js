export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const getValidationErrors = (fields) => {
  const errors = {};
  
  Object.entries(fields).forEach(([key, config]) => {
    const { value, rules } = config;
    
    if (rules.required && !validateRequired(value)) {
      errors[key] = `${key} is required`;
    }
    
    if (rules.email && value && !validateEmail(value)) {
      errors[key] = 'Invalid email address';
    }
    
    if (rules.password && value && !validatePassword(value)) {
      errors[key] = 'Password must be at least 6 characters';
    }
    
    if (rules.minLength && value && value.length < rules.minLength) {
      errors[key] = `Must be at least ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[key] = `Must be no more than ${rules.maxLength} characters`;
    }
  });
  
  return errors;
};
