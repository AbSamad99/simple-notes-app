export const errorsObject = {
  requiredError: "Cannot be empty.",
  specialCharactersError: "Special characters not allowed.",
  numericError: "Numbers not allowed.",
  passwordConfirmationError: "Passwords do not match.",
  maxLengthError: ({ maxLength }) =>
    `Cannot be greater than ${maxLength} characters.`,
  minLengthError: ({ minLength }) =>
    `Cannot be less than ${minLength} characters.`,
  maxValueError: ({ maxValue }) => `Cannot be greater than ${maxValue}.`,
  minValueError: ({ minValue }) => `Cannot be less than ${minValue}.`,
};

export const initialControl = () => ({
  value: "",
  isValid: true,
  errors: [],
  touched: false,
});
