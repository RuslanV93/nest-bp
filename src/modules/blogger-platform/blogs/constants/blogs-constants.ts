export const blogNameConstraints = {
  minLength: 3,
  maxLength: 15,
};

export const blogDescriptionConstraints = {
  minLength: 1,
  maxLength: 500,
};

export const blogWebsiteUrlConstraints = {
  minLength: 4,
  maxLength: 100,
  pattern:
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};
