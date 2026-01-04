import axios, { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  APIGetResponse,
  Blend,
  PaginationRequest,
  SalesOrder,
} from "@/interfaces";

async function getSalesOrderList(queryParams:PaginationRequest) {
  const queryString = Object.entries(queryParams)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '') 
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");


  try {
    const response =
      await privateApiInstance.get<APIGetResponse<SalesOrder>>(
        `api/v1/sales-order?${queryString}`
        // `/salesOrderList.json`
      );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getBlendDetailsBySalesOrderId(salesOrderId: number,productItemCode:string) {
  try {
    const response =
      await privateApiInstance.get<Blend>(
        `/api/v1/sales-order/${salesOrderId}/product-item/${productItemCode}/blend`
        // `/blendDeatilsBySalesOrder.json`
      );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getPackingDetailBySalesOrderId(salesOrderId: number,packingCode:string) {
  try {
    const response =
      await privateApiInstance.get<Blend>(
        `/api/v1/sales-order/${salesOrderId}/packing/${packingCode}/`
      );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

export const salesOrderService = {
  getSalesOrderList,
  getBlendDetailsBySalesOrderId,
  getPackingDetailBySalesOrderId,
};
