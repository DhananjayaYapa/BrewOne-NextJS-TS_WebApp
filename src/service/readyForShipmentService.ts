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

export interface BlendShipmentReportResponse {
  blendSheetNo: string;
  blendDate: string;
  productDescription: string;
  salesContractNo: number;
  customer: string;
  quantity: number;
  averagePrice: number;
  value: number;
}

export interface BlendShipmentReportRequest {
  startDate: string;
  endDate: string;
}

async function getBlendShipmentReport(
  queryParams: BlendShipmentReportRequest,
) {
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const response = await privateApiInstance.get<BlendShipmentReportResponse>(
      `api/v1/report/blend/shipment?${queryString}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data?.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

export const reportService = {
  getBlendShipmentReport,
};
