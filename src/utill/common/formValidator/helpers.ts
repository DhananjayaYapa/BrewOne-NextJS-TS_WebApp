
import {
  gt,
  isBoolean,
  isEmpty,
  isNull,
  isNumber,
  isObjectLike,
  isString,
  isUndefined,
  lt,
  size,
  toString,
} from 'lodash';
import { FORM_VALIDATOR_ERRORS } from "./const";
import {
  FormValidatorCustomErrors,
  FormValidatorExtraValidators,
  FormValidatorField,
} from "./interfaces";
import moment, { Moment } from 'moment';

export const isRequiredValidationMapper = (
  isRequired: boolean,
  isMissing: boolean,
  errorMessages?: FormValidatorCustomErrors
) : [boolean, string | undefined] => {
  if (isRequired && isMissing) {
    const error =
      errorMessages?.required ?? FORM_VALIDATOR_ERRORS.REQUIRED_FIELD;
    return [true, error];
  }
  return [false, undefined];
};

export const isInValidDataTypeValidationMapper = (
  isInvalid: boolean,
  errorMessages?: FormValidatorCustomErrors
): [boolean, string | undefined]  => {
  if (isInvalid) {
    const error =
      errorMessages?.type ?? FORM_VALIDATOR_ERRORS.INVALID_DATA_TYPE;
    return [true, error];
  }
  return [false, undefined];
};


export const minExtraValidatorMapper = (
  value: number | Date | Moment,
  validations?: FormValidatorExtraValidators,
  errorMessages?: FormValidatorCustomErrors
):  [boolean, string | undefined] => {
  if (validations && validations.min && lt(value, validations.min)) {
    const error =
      errorMessages?.min ??
      `${FORM_VALIDATOR_ERRORS.LESS_THAN_MIN} ${validations.min}`;
    return [true, error];
  }
  return [false, undefined];
};

export const maxExtraValidatorMapper = (
  value: number | Date | Moment,
  validations?: FormValidatorExtraValidators,
  errorMessages?: FormValidatorCustomErrors
):  [boolean, string | undefined] => {
  if (validations && validations.max && gt(value, validations.max)) {
    const error =
      errorMessages?.max ??
      `${FORM_VALIDATOR_ERRORS.GREATER_THAN_MAX} ${validations.max}`;
    return [true, error];
  }
  return [false, undefined];
};

export const minLengthExtraValidationMapper = (
  value: number | string | Array<unknown>,
  validations?: FormValidatorExtraValidators,
  errorMessages?: FormValidatorCustomErrors
) : [boolean, string | undefined] => {
  const formattedValue: string | Array<unknown> = isNumber(value)
    ? toString(value)
    : value;
  if (
    validations &&
    validations.minLength &&
    lt(size(formattedValue), validations.minLength)
  ) {
    const error =
      errorMessages?.minLength ??
      `${FORM_VALIDATOR_ERRORS.LESS_THAN_MIN_LENGTH} ${validations.minLength}`;
    return [true, error];
  }
  return [false, undefined];
};

export const maxLengthExtraValidationMapper = (
  value: number | string | Array<unknown>,
  validations?: FormValidatorExtraValidators,
  errorMessages?: FormValidatorCustomErrors
): [boolean, string | undefined]  => {
  const formattedValue: string | Array<unknown> = isNumber(value)
    ? toString(value)
    : value;
  if (
    validations &&
    validations.maxLength &&
    gt(size(formattedValue), validations.maxLength)
  ) {
    const error =
      errorMessages?.maxLength ??
      `${FORM_VALIDATOR_ERRORS.GREATER_THAN_MAX_LENGTH} ${validations.maxLength}`;
    return [true, error];
  }
  return [false, undefined];
};

// Type validation methos

export const validateText = (data: FormValidatorField<string>) : [boolean, string | undefined] => {
  const [isRequiredError, requiredErrorMessage] = isRequiredValidationMapper(
    data.isRequired,
    isEmpty(data.value),
    data?.errorMessages
  );
  if (isRequiredError) return [true, requiredErrorMessage];

  if (!isEmpty(data.value)) {
    const [isInvalidError, invalidErrorMessage] =
      isInValidDataTypeValidationMapper(
        !isString(data.value),
        data?.errorMessages
      );
    if (isInvalidError) return [true, invalidErrorMessage];

    const [isMinLengthError, minLengthErrorMessage] =
      minLengthExtraValidationMapper(
        data.value,
        data?.validators,
        data?.errorMessages
      );
    if (isMinLengthError) return [true, minLengthErrorMessage];

    const [isMaxLengthError, maxLengthErrorMessage] =
      maxLengthExtraValidationMapper(
        data.value,
        data?.validators,
        data?.errorMessages
      );
    if (isMaxLengthError) return [true, maxLengthErrorMessage];
  }
  return [false, undefined];
};

export const validateNumber = (data: FormValidatorField<number>): [boolean, string | undefined] => {
  const [isRequiredError, requiredErrorMessage] = isRequiredValidationMapper(
    data.isRequired,
    isNull(data.value) || isUndefined(data.value),
    data.errorMessages
  );
  
  if (isRequiredError) return [true, requiredErrorMessage];
  
  if (data.value) {

    const [isInvalidError, invalidErrorMessage] =
      isInValidDataTypeValidationMapper(
        !isNumber(Number(data.value)),
        data?.errorMessages
      );
    if (isInvalidError) return [true, invalidErrorMessage];

    const [isMinError, minErrorMessage] = minExtraValidatorMapper(
      data.value,
      data?.validators,
      data?.errorMessages
    );
    if (isMinError) return [true, minErrorMessage];
    const [isMaxError, maxErrorMessages] = maxExtraValidatorMapper(data.value, data?.validators, data?.errorMessages)
    if(isMaxError) return [true,maxErrorMessages]
  }
  return [false, undefined];

}
export const validateObject = (
  data: FormValidatorField<object>,
): [boolean, string | undefined] => {
  const [isRequiredError, requiredErrorMessage] = isRequiredValidationMapper(
    data.isRequired,
    (
      isNull(data.value)
      || isUndefined(data.value)
      || Object.keys(data.value).length === 0
    ),
    data?.errorMessages,
  );
  if (isRequiredError) return ([true, requiredErrorMessage]);

  const [isInvalidError, invalidErrorMessage] = isInValidDataTypeValidationMapper(
    (!isEmpty(data.value) && (!isObjectLike(data.value) || data.value.constructor !== Object)),
    data?.errorMessages,
  );
  if (isInvalidError) return ([true, invalidErrorMessage]);

  return ([false, undefined]);
};

export const validateFile = (data: FormValidatorField<File>) : [boolean, string | undefined] => {
  const [isRequiredError, requiredErrorMessage] = isRequiredValidationMapper(
    data.isRequired,
    isNull(data.value) || isUndefined(data.value),
    data.errorMessages
  );

  if (isRequiredError) return [true, requiredErrorMessage];

  if (data.value) {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedFileTypes.includes(data.value.type)) {
      return [true, FORM_VALIDATOR_ERRORS.INVALID_FILE_TYPE];
    }

    const maxSize = 500 * 1024 * 1024;
    if (data.value.size > maxSize) {
      return [true, FORM_VALIDATOR_ERRORS.FILE_SIZE_EXCEEDED];
    }
  }

  return [false, undefined];
};

export const validateBoolean = (
  data:FormValidatorField<boolean>,
): [boolean, string | undefined] => {
  const [isRequiredError, requiredErrorMessage] = isRequiredValidationMapper(
    data.isRequired,
    (isNull(data.value) || isUndefined(data.value)),
    data?.errorMessages,
  );
  if (isRequiredError) return ([true, requiredErrorMessage]);

  const [isInvalidError, invalidErrorMessage] = isInValidDataTypeValidationMapper(
    !isBoolean(data.value),
    data?.errorMessages,
  );
  if (isInvalidError) return ([true, invalidErrorMessage]);

  return ([false, undefined]);
};
export const validateDate = (
  data: FormValidatorField<Date | null>,
): [boolean, string | undefined] => {
  const [isRequiredError, requiredErrorMessage] = isRequiredValidationMapper(
    data.isRequired,
    (isNull(data.value) || isUndefined(data.value)),
    data?.errorMessages,
  );
  if (isRequiredError) return ([true, requiredErrorMessage]);

  if (!isEmpty(data.value)) {
    const [isInvalidError, invalidErrorMessage] = isInValidDataTypeValidationMapper(
      !moment(data.value).isValid(),
      data?.errorMessages,
    );
    if (isInvalidError) return ([true, invalidErrorMessage]);

    const [isMinError, minErrorMessage] = minExtraValidatorMapper(
      data.value,
      data?.validators,
      data?.errorMessages,
    );
    if (isMinError) return ([true, minErrorMessage]);

    const [isMaxError, maxErrorMessage] = maxExtraValidatorMapper(
      data.value,
      data?.validators,
      data?.errorMessages,
    );
    if (isMaxError) return ([true, maxErrorMessage]);
  }

  return ([false, undefined]);
};