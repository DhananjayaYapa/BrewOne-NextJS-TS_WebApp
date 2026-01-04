import { FORM_VALIDATOR_TYPES } from "./const";
import {  validateNumber, validateText, validateFile, validateDate, validateObject, validateBoolean } from "./helpers";
import { FormValidatorField, FormValidatorForm } from "./interfaces";
import { isFormChanged } from "./util";

const validateFormField = <T>(
  data: FormValidatorField<any>
): [FormValidatorField<T>, boolean] => {
let isInvalid = false;
let validatedFieldData : FormValidatorField<T>
switch (data.type) {
    case FORM_VALIDATOR_TYPES.TEXT: {
      const [isError, error] = validateText(data);
      if (isError) isInvalid = true;
      validatedFieldData = {
        ...data,
        error,
      };
      break;
    }
    case FORM_VALIDATOR_TYPES.NUMBER: {
      const [isError, error] = validateNumber(data);
      if (isError) isInvalid = true;

      validatedFieldData = {
        ...data,
        error,
      };
      break;
    }
    case FORM_VALIDATOR_TYPES.FILE:{
      const [isFileError, fileErrorMessage] = validateFile(data);
      if (isFileError) isInvalid = true;

      validatedFieldData = {
        ...data,
        error: fileErrorMessage,
      };
      break;
    }
    case FORM_VALIDATOR_TYPES.BOOLEAN: {
      const [isError, error] = validateBoolean(data);
      if (isError) isInvalid = true;

      validatedFieldData = {
        ...data,
        error,
      };
      break;
    }
    case FORM_VALIDATOR_TYPES.DATE: {
      const [isError, error] = validateDate(data);
      if (isError) isInvalid = true;

      validatedFieldData = {
        ...data,
        error,
      };
      break;
    }
    case FORM_VALIDATOR_TYPES.OBJECT: {
      const [isError, error] = validateObject(data);
      if (isError) isInvalid = true;

      validatedFieldData = {
        ...data,
        error,
      };
      break;
    }

    default:
      validatedFieldData = {
        ...data,
      };
  }

  return [validatedFieldData, !isInvalid];
};

const validateForm = async <T>(
  data: FormValidatorForm
): Promise<[T, boolean]> => {
  let isInvalid = false;
  let validatedData = { ...data };

  await Promise.all(
    Object.entries(data)?.map(async ([field, fieldData]) => {
      const [validatedFieldData, isValid] = validateFormField(fieldData);
      if (!isValid) isInvalid = true;
      validatedData = {
        ...validatedData,
        [field]: {
          ...validatedFieldData,
        },
      };
    })
  );

  return [validatedData as T, !isInvalid];
};

export { validateFormField as formFieldValidator };
export { validateForm as formValidator };
export { isFormChanged as formValidatorFormChanged };
export { FORM_VALIDATOR_TYPES };
export * from "./interfaces";
