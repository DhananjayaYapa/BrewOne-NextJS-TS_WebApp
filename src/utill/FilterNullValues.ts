import { updateTeaLotDetails } from "@/interfaces/teaLotById";

export const filterNullValues = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
};

export const isAnyFieldValueNotNull = (fieldValues: updateTeaLotDetails) => {
    return Object.values(fieldValues).some(value => value !== null);
};