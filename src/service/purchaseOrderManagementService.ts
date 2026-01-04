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

async function createPurchaseOrder(bodyParams: CreatePurchaseOrderRequest) {
  try {
    const response = await privateApiInstance.post<APISuccessMessage>
    (`/api/v1/purchase-order`, bodyParams);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function addBuyingPlan(id: number,queryParams: GetTeaLotDetailsRequest) {
  const queryString = Object.entries(queryParams)
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  try {
    const response = await privateApiInstance.patch<APISuccessMessage>(
      `/api/v1/tea-lot/${id}/add-buying-plan?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function cancelBuyingPlan(id: number,queryParams: GetTeaLotDetailsRequest) {
  const queryString = Object.entries(queryParams)
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  try {
    const response = await privateApiInstance.patch<APISuccessMessage>(
      `/api/v1/tea-lot/${id}/cancel-buying-plan?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getPurchaseOrderList(queryParams: GetPurchaseOrderListRequest) {
    const queryString = Object.entries(queryParams)
      ?.map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    try {
      const response = await privateApiInstance.get<APIGetResponse<PurchaseOrder>>(
        `/api/v1/purchase-order?${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }

  async function approveAndReleasePO(id: number) {
    try {
      const response = await privateApiInstance.patch<APISuccessMessage>(
        `api/v1/purchase-order/${id}/approve-release`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }

    async function releasePO(id: number) {
    try {
      const response = await privateApiInstance.patch<APISuccessMessage>(
        `api/v1/purchase-order/${id}/release`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }

   async function cancelPO(id: number) {
    try {
      const response = await privateApiInstance.patch<APISuccessMessage>(
        `api/v1/purchase-order/${id}/cancel`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }

  async function getPurchaseOrderByID(purchaseOrderId: number) {

    try {
      const response = await privateApiInstance.get<PurchaseOrder>(
        `/api/v1/purchase-order/${purchaseOrderId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }
export const purchaseOrderService = {
    createPurchaseOrder,
    addBuyingPlan,
    cancelBuyingPlan,
    getPurchaseOrderList,
    approveAndReleasePO,
    releasePO,
    cancelPO,
    getPurchaseOrderByID
};