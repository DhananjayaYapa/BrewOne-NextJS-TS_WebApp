import axios, { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  APIGetResponse,
  APISuccessMessage,
  Blend,
  BlendChangeLogByIdRequest,
  BlendChangeLogs,
  BlendItem,
  BOMItemDetail,
  PaginationRequest,
} from "@/interfaces";
import { BlendSheet, BlendSheetTemplate, CloseBlendSheetRequest, CreateBlendSheet, EditBlendSheetBody, EditBlendSheetSuccess, GetAllBlendSheetsRequest, GetBlendSheetDetail } from "@/interfaces/blendSheet";


async function getAllBlendSheets(queryParams: GetAllBlendSheetsRequest) {
    const queryString = Object.entries(queryParams)
    .filter(([key, value]) => key !== "status" && key !== "salesOrder" && value !== undefined)
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  try {
    const response = await privateApiInstance.get<APIGetResponse<BlendSheetTemplate>>(
      `/api/v1/blend?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function createBlendSheet(bodyParams: CreateBlendSheet) {
  try {
    const response = await privateApiInstance.post<APISuccessMessage>
    (`/api/v1/blend`, bodyParams);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getBlendSheetByDetail(blendId: number) {
  try {
    const response = await privateApiInstance.get<GetBlendSheetDetail>
    (`/api/v1/blend/${blendId}`);
    return response.data;
    // const response = await axios.get<GetBlendSheetDetail>('/getBlendSheetById.json')
    // return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function editBlendSheet(bodyParams: EditBlendSheetBody, blendId: number) {
  try {
    const response = await privateApiInstance.put<APISuccessMessage>
    (`/api/v1/blend/${blendId}`, bodyParams);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function releaseBlendSheet(blendId: number) {
  try {
    const response = await privateApiInstance.put<EditBlendSheetSuccess>
    (`/api/v1/blend/${blendId}/release`);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function closeBlendSheets(closeBlendSheetRequest: CloseBlendSheetRequest) {
  try {
    const response = await privateApiInstance.patch<APISuccessMessage>
    (`/api/v1/blend/close`,closeBlendSheetRequest);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function approveAndReleaseBlendSheet(blendId: number) {
  try {
    const response = await privateApiInstance.put<APISuccessMessage>
    (`/api/v1/blend/${blendId}/approve-release`);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getBlendBalances(queryParams: string) { // blend balances
  const queryString = Object.entries(queryParams)
  ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&');
try {
  const response = await privateApiInstance.get<APIGetResponse<BlendSheet>>(
    `/api/v1/blend?${queryString}`
  );
  return response.data;
} catch (error) {
  throw new Error(
    (error as AxiosError<APIErrorMessage>).response?.data.message ||
      API_MESSAGES.FAILED_GET
  );
}
}

async function getPrintBlendSheet(blendId: number) {
  try {
    const response = await privateApiInstance.get(`/api/v1/blend/${blendId}/print-detail`);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

//CHANGE LOT LIST
async function getAllBlendChangeLogs(blendId: number ,queryParams: PaginationRequest){
  try {
    const response = await privateApiInstance.get<APIGetResponse<BlendChangeLogs>>(
        `/api/v1/blend/${blendId}/version`, {params: queryParams}
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

//change log version changes
async function getBlendChangeLogById(blendChangeLogId: number, queryParams: BlendChangeLogByIdRequest){
  try {
    const response = await privateApiInstance.get(
      `/api/v1/blend/${blendChangeLogId}/version-compare` , {params: queryParams}
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getDuplicatedBlendSheetDetail(blendSheetId: number){
  try{
    const response = await privateApiInstance.get(
      `/api/v1/blend/${blendSheetId}/duplicate-blend-sheet`
    );
    return response.data;
  }catch(error){
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getAllSFGItemsByMasterBlendNo(queryParams: { masterBlendSheetNo: string }) {
  try {
    const response = await privateApiInstance.get(
      '/api/v1/data/blend-item', { params: queryParams }
    );
    return response.data;
    // const response = await axios.get('/getBlendSFGItems.json')
    // return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
      API_MESSAGES.FAILED_GET
    );
  }
}


export const blendService = {
    getAllBlendSheets,
    createBlendSheet,
    getBlendSheetByDetail,
    editBlendSheet,
    releaseBlendSheet,
    closeBlendSheets,
    approveAndReleaseBlendSheet,
    getBlendBalances,
    getPrintBlendSheet,
    getAllBlendChangeLogs,
    getBlendChangeLogById,
    getDuplicatedBlendSheetDetail,
    getAllSFGItemsByMasterBlendNo
};