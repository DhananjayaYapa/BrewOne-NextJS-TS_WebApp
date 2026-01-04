export interface APIErrorMessage {
  message: string;
}

export interface APISuccessMessage {
  message: string;
  purchaseOrderNumber?: number;
  deliveryOrderNumber?: number;
  deliveryOrderId?: number;
}

export interface APIGetResponse<T> {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  data: T[];
}

export interface PaginationRequest {
  limit?: number;
  page?: number;
  search?: string;
}

export interface FieldValue<T> {
  value: T;
  error: string | null
}

export interface ResponseState<T> {
  isLoading: boolean;
  hasError: boolean;
  isSuccess: boolean;
  data: T;
  message?: string
}

export interface FormIdentifier<T> {
  name: string;
  value: T;
}

export interface FormIdentifier1<T> {
  name: string;
  value: T
}

export interface DropdownSelectedItem<T> {
  id: T;
  name?: string;
}

export interface DropDownOptionDto {
  label: string | undefined;
  value: string | number | undefined;
}

export interface UploadAttachment {
  filename: string;
  filetype: string;
}

export interface PreSignedURL {
  url: string;
  fileKey: string;
  contentType: string;
  expireTime: number
}

export interface FileData { 
  file: File | null, 
  url: string 
  fileKey?: string
}

export interface Approval{
  requestId: number,
  status: string,
  createdBy: string,
  createdAt: string,
  updatedBy: string | null,
  updatedAt: string | null,
  rejectReason: string | null
}