export const userLoginConstraints = {
  minLength: 3,
  maxLength: 10,
  pattern: /^[a-zA-Z0-9_-]*$/,
};

export const userPasswordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const userEmailConstraints = {
  pattern: /^[\w-]+(?:\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/,
};
