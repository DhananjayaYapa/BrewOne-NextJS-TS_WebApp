import { AxiosError } from 'axios';
import {
  APIErrorMessage,
  CatalogFileList,
  DashboardHistoryRequest, LotHistoryDetails,
  TabDetailsRequest,TeaLotDetailsSummeryRequest,
  TeaLotDetailsSummeryResponse,
  LotSummeryAPIRequest,
  LotSummeryAPIResponse
} from '@/interfaces';
import { API_MESSAGES } from '@/constant';
import { privateApiInstance } from '.';

async function getTeaLotHistoryById(queryParams: DashboardHistoryRequest) {
  // Filter out undefined values
  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, value]) => value !== undefined)
  );  
  const queryString = Object.entries(filteredQueryParams)
      ?.map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    try {
      const response = await privateApiInstance.get<LotHistoryDetails>(
        `api/v1/dashboard/tea-lot/history?${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }
async function getCatalogueFileList(queryParams: TabDetailsRequest) {
    const queryString = Object.entries(queryParams)
      ?.map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    try {
      const response = await privateApiInstance.get<CatalogFileList[]>(
        `api/v1/dashboard/catalog/file-list?${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }
async function getTeaLotsDetailsSummary(queryParams: TeaLotDetailsSummeryRequest) {
   // Filter out undefined values
   
   const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, value]) => value !== undefined)
  );  
  const queryString = Object.entries(filteredQueryParams)
      ?.map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    try {
      const response = await privateApiInstance.get<TeaLotDetailsSummeryResponse>(
        `api/v1/dashboard/tea-lot/summary?${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }
async function getTeaLotSummaryAPI(queryParams: LotSummeryAPIRequest) {
  // Filter out undefined values
  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, value]) => value !== undefined)
  );  
  const queryString = Object.entries(filteredQueryParams)
  ?.map(
    ([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  )
  .join("&");
  
    try {
      const response = await privateApiInstance.get<LotSummeryAPIResponse[]>(
        `api/v1/dashboard/tea-lot/list?${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as AxiosError<APIErrorMessage>).response?.data.message ||
          API_MESSAGES.FAILED_GET
      );
    }
  }
  export const dashBoardService = {
    getTeaLotHistoryById,
    getCatalogueFileList,
    getTeaLotsDetailsSummary,
    getTeaLotSummaryAPI,
  };