import { FORM_VALIDATOR_TYPES } from './const';

export interface FormValidatorExtraValidators {
  min?: number|Date
  max?: number|Date,
  minLength?: number,
  maxLength?: number,
  pattern?: string
}

export interface FormValidatorCustomErrors {
  required?: string
  type?: string
  min?: string
  max?: string
  minLength?: string
  maxLength?: string
  pattern?: string
}

export interface FormValidatorField<T> {
  value: T
  type?: FORM_VALIDATOR_TYPES
  isRequired: boolean
  disable: boolean
  validators?: FormValidatorExtraValidators
  error?: string
  errorMessages?: FormValidatorCustomErrors,
  [key: string]: string | T | FORM_VALIDATOR_TYPES | boolean |
  FormValidatorExtraValidators | undefined | FormValidatorCustomErrors
}

export interface FormValidatorForm {
  [key: string]: FormValidatorField<unknown>
}
