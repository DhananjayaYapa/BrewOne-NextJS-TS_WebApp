import axios, { AxiosError } from "axios";
import {
  APIErrorMessage,
  GetTeaLotDetailsRequest,
  GetTeaLotDetailsResponse,
  BulkForm,
  GetCatalogueRequest,
  PurchasedSummary,
  APISuccessMessage,
} from "@/interfaces";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  MasterData,
  TeaLotById,
  updateTeaLotDetails,
} from "@/interfaces/teaLotById";

async function getTeaLotDetails(queryParams: GetTeaLotDetailsRequest) {
  let finalParams: GetTeaLotDetailsRequest;

  if (!queryParams.customerId) {
    // If customerId is missing, add default
    finalParams = {
      ...queryParams,
      customerId: 1,
    };
  } else {
    finalParams = { ...queryParams };
  }

  const queryString = Object.entries(finalParams)
    .filter(
      ([key, value]) => value !== undefined && value !== "" && value !== null
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  // Ensure base URL does not have trailing '?' or '/'
  const baseUrl = process.env.NEXT_PUBLIC_GET_LOT_DETAILS_LAMBDA_URL?.replace(
    /\?+$/,
    ""
  ).replace(/\/+$/, "");

  const url = `${baseUrl}?${queryString}`;

  try {
    const response = await axios.get<GetTeaLotDetailsResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function updateBulkTeaLotDetails(
  requestBody: BulkForm[],
  customerId: number
) {
  try {
    const response = await privateApiInstance.put<BulkForm>(
      `/api/v1/tea-lot?customerId=${customerId}`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error("Error occurred while updating bulk tea lot details:");
    console.error(error);

    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getTeaLotDetailsById(
  id: number,
  queryParams: GetTeaLotDetailsRequest
) {
  const queryString = Object.entries(queryParams)
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  try {
    const response = await privateApiInstance.get<TeaLotById>(
      `/api/v1/tea-lot/${id}?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function updateTeaLotDetailsById(
  requestBody: updateTeaLotDetails,
  customerId: number,
  lotId: number
) {
  try {
    const response = await privateApiInstance.put<APISuccessMessage>(
      `/api/v1/tea-lot/${lotId}?customerId=${customerId}`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error("Error occurred while updating bulk tea lot details:");
    console.error(error);

    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getMasterData() {
  try {
    const response = await privateApiInstance.get<MasterData>(
      `/api/v1/data/tea-lot/master`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getPurchasedTeaLotSummary(queryParams: GetTeaLotDetailsRequest) {
  const queryString = Object.entries(queryParams)
    .filter(([key, value]) => value !== undefined)
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  try {
    const response = await privateApiInstance.get<PurchasedSummary>(
      `/api/v1/dashboard/tea-lot/purchased-summary?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

export const teaLotManagementService = {
  getTeaLotDetails,
  updateBulkTeaLotDetails,
  getTeaLotDetailsById,
  updateTeaLotDetailsById,
  getMasterData,
  getPurchasedTeaLotSummary,
};
