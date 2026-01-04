import { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  APISuccessMessage,
  CreateSendingDeliveryOrderRequest,
  DeliveryOrder,
  DeliveryOrderDetailsById,
  GetDeliveryOrderDetailsByIdRequest,
  GetDeliveryOrderDetailsByIdResponse,
  GetDeliveryOrderDetailsRequest,
  GetDeliveryOrderDetailsResponse,
  GetSendingDeliveryOrderDetailsResponse,
  SendingDeliveryOrderDetailsById,
  UpdateDeliveryOrderActionRequest,
} from "@/interfaces";

async function getSendingDeliveryOrderDetails(
  queryParams: GetDeliveryOrderDetailsRequest
) {
  const queryString = Object.entries(queryParams)
    .filter(([key, value]) => value !== undefined)
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  try {
    const response =
      await privateApiInstance.get<GetSendingDeliveryOrderDetailsResponse>(
        `/api/v1/sending-delivery-order?${queryString}`
      );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getDeliveryItemsById(id: number) {
  try {
    const response = await privateApiInstance.get<any>(
      `/api/v1/sales-order/${id}/sending-delivery-order`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function createSendingDeliveryOrder(bodyParams: CreateSendingDeliveryOrderRequest) {
  try {
    const response = await privateApiInstance.post<APISuccessMessage>
    (`/api/v1/sending-delivery-order`, bodyParams);
    return response.data;
  
    
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getSendingDeliveryOrderDetailsById(id: number,queryParams: GetDeliveryOrderDetailsByIdRequest) {
  const queryString = Object.entries(queryParams)
  .filter(([key, value]) => value !== undefined)
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  try {
    const response = await privateApiInstance.get<SendingDeliveryOrderDetailsById>(
      `/api/v1/sending-delivery-order/${id}?${queryString}`
    );
    return response;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function updateSendingDeliveryOrderAction(id: number, bodyParams: UpdateDeliveryOrderActionRequest) {
  try {
    const response = await privateApiInstance.patch<APISuccessMessage>
    (`api/v1/sending-delivery-order/${id}/action`, bodyParams);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

export const sendingDeliveryOrderService = {
  getSendingDeliveryOrderDetails,
  createSendingDeliveryOrder,
  getSendingDeliveryOrderDetailsById,
  updateSendingDeliveryOrderAction,
  getDeliveryItemsById,
};
