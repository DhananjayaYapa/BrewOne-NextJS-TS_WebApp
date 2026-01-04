import { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  APIGetResponse,
  APISuccessMessage,
  BOMItemDetail,
  GetAllPackingSheetsRequest,
  PackingSheet,
} from "@/interfaces";
import { CreateBlendSheet, CreatePackingSheet, EditBlendSheetBody, EditBlendSheetSuccess, GetBlendSheetDetail } from "@/interfaces/blendSheet";
import { createPackingSheet } from "@/redux/action/packingSheetAction";


async function getAllPackingSheets(queryParams: GetAllPackingSheetsRequest) {
    const queryString = Object.entries(queryParams)
    .filter(([key, value]) => key !== "status")
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  try {
    const response = await privateApiInstance.get<APIGetResponse<PackingSheet>>(
      `/api/v1/packing?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}


async function getBOMDetailsByPackingItem(packingItemCode: string) {
  
  try {
    const response = await privateApiInstance.get<BOMItemDetail>(
      `/api/v1/item/${packingItemCode}/packing-bom`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function createPackingSheets(bodyParams: CreatePackingSheet) {
  try {
    const response = await privateApiInstance.post<APISuccessMessage>
    (`/api/v1/packing`, bodyParams);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getPackingSheetByDetail(packingId: number) {
  try {
    const response = await privateApiInstance.get<GetBlendSheetDetail>
    (`/api/v1/packing/${packingId}`);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function editPackingSheet(bodyParams: EditBlendSheetBody, packingId: number) {
  try {
    const response = await privateApiInstance.put<APISuccessMessage>
    (`/api/v1/packing/${packingId}`, bodyParams);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function releasePackingSheet(packingId: number) {
  try {
    const response = await privateApiInstance.put<EditBlendSheetSuccess>
    (`/api/v1/packing/${packingId}/release`);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}


export const packingService = {
    getAllPackingSheets,
    getBOMDetailsByPackingItem,
    createPackingSheets,
    getPackingSheetByDetail,
    editPackingSheet,
    releasePackingSheet
};
