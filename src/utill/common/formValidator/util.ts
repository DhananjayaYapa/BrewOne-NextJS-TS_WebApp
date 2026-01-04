import { isEqual } from 'lodash';
import { FormValidatorForm } from './interfaces';
import { BLEND_SHEET_STATUS } from '@/constant';


export function isFormChanged(
  oldFormData: FormValidatorForm,
  newFormData: FormValidatorForm,
): boolean {
  const isNotChanged = isEqual(
    Object.keys(oldFormData)?.map((key: keyof typeof oldFormData) => oldFormData[key].value),
    Object.keys(newFormData)?.map(
      (key: keyof typeof newFormData) => newFormData[key].value,
    ),
  );

  return !isNotChanged;
}

export function mapBlendStatusCode(id: number | undefined): string {
  let statusName = ''

  if (id === undefined) {
    return statusName
  }

  Object.entries(BLEND_SHEET_STATUS).forEach(([key, value]) => {
    if (id === value) {
      statusName = key
      return
    }
  });
  return statusName
}
