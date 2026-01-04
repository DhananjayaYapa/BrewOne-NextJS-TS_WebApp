import { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  APISuccessMessage,
  CreateDeliveryOrderRequest,
  DeliveryOrder,
  DeliveryOrderAckReport,
  DeliveryOrderDetailsById,
  DeliverySalesOrderMasterData,
  GetDeliveryOrderDetailsByIdRequest,
  GetDeliveryOrderDetailsByIdResponse,
  GetDeliveryOrderDetailsRequest,
  GetDeliveryOrderDetailsResponse,
  UpdateDeliveryOrderActionRequest,
} from "@/interfaces";

async function getDeliveryOrderDetails(
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
      await privateApiInstance.get<GetDeliveryOrderDetailsResponse>(
        `/api/v1/delivery-order?${queryString}`
      );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function createDeliveryOrder(bodyParams: CreateDeliveryOrderRequest) {
  try {
    const response = await privateApiInstance.post<APISuccessMessage>
    (`/api/v1/delivery-order`, bodyParams);
    return response.data;
  
    
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getDeliveryOrderDetailsById(id: number,queryParams: GetDeliveryOrderDetailsByIdRequest) {
  const queryString = Object.entries(queryParams)
  .filter(([key, value]) => value !== undefined)
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  try {
    const response = await privateApiInstance.get<DeliveryOrderDetailsById>(
      `/api/v1/delivery-order/${id}?${queryString}`
    );
    return response;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function updateDeliveryOrderAction(id: number, bodyParams: UpdateDeliveryOrderActionRequest) {
  try {
    const response = await privateApiInstance.patch<APISuccessMessage>
    (`api/v1/delivery-order/${id}/action`, bodyParams);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getDeliveryOrderAckReport(id: number) {
  try {
    const response = await privateApiInstance.get<DeliveryOrderAckReport>(
      `/api/v1/delivery-order/${id}/ack-report`
    );
    return response;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

export const deliveryOrderService = {
  getDeliveryOrderDetails,
  createDeliveryOrder,
  getDeliveryOrderDetailsById,
  updateDeliveryOrderAction,
  getDeliveryOrderAckReport,
};
