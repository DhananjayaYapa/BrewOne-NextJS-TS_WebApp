import { AxiosError } from 'axios';
import {
  APIErrorMessage,
  APIGetResponse,
  APISuccessMessage,
  CreatePurchaseOrderRequest,
  GetTeaLotDetailsRequest,
} from '@/interfaces';
import { API_MESSAGES } from '@/constant';
import { privateApiInstance } from '.';
import { GetPurchaseOrderListRequest, PurchaseOrder } from '@/interfaces/purchaseOrder';
import { ApproveRequest, CreateApprovalRequest, RejectRequest } from '@/interfaces/approval';

async function createApprovalRequest(bodyParams: CreateApprovalRequest) {
  const response = await privateApiInstance.post<APISuccessMessage>
    (`/api/v1/blend/${bodyParams.entityId}/create-approval-request`);
  return response.data;
}

async function approveRequest(id:string, bodyParams: ApproveRequest) {
  try {
    const response = await privateApiInstance.patch<APISuccessMessage>(
      `/api/v1/approval/${id}/approve`,bodyParams
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function rejectRequest(id:string, bodyParams: RejectRequest) {
  try {
    const response = await privateApiInstance.patch<APISuccessMessage>(
      `/api/v1/approval/${id}/reject`, bodyParams
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

export const approvalManagementService = {
    createApprovalRequest,
    approveRequest,
    rejectRequest
};