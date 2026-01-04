export enum FORM_VALIDATOR_TYPES {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  FILE = "file",
  OBJECT='object',
  BOOLEAN='boolean',

}

export const FORM_VALIDATOR_ERRORS = {
  REQUIRED_FIELD: "This field is required.",
  INVALID_DATA_TYPE: "Invalid data type.",
  LESS_THAN_MIN: "Value should not be less than",
  GREATER_THAN_MAX: "Value should not be greater than",
  LESS_THAN_MIN_LENGTH: "Length should not be less than",
  GREATER_THAN_MAX_LENGTH: "Length should not be greater than",
  INVALID_PATTERN: "Value does not match the required format",
  INVALID_FILE_TYPE: "Only JPG, PNG, and PDF files are allowed.",
  FILE_SIZE_EXCEEDED: "File size should not exceed 500MB.",
};

