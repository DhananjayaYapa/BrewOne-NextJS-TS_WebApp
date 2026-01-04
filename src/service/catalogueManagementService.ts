import { AxiosError } from 'axios';
import {
  APIErrorMessage,
  APISuccessMessage,
  GetCatalogueRequest,
  GetCatalogueResponse,
  TabDetailsRequest,
  UploadCatalogRequest,
  Catalogue,
  CataloguesSummary,
  CreateCatalogRequest,
  CatalogueTypeList,
  PaginationRequest,
  APIGetResponse,
  CatalogueChangeLogs,
  CatalogueLogsVersionRequest,
} from '@/interfaces';
import { API_MESSAGES } from '@/constant';
import { privateApiInstance } from '.';


async function getCatalogues(queryParams: GetCatalogueRequest) {
  const queryString = Object.entries(queryParams)
    .filter(([key, value]) => value !== undefined)
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  try {
    const response = await privateApiInstance.get<GetCatalogueResponse>
      (`/api/v1/catalog?${queryString}`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function uploadCatalogue(bodyParams: UploadCatalogRequest) {
  try {
    const response = await privateApiInstance.post<APISuccessMessage>
      (`/api/v1/catalog/upload`, bodyParams);
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

//get Catalog Details By Id
async function getTabDetails(id: number, queryParams: TabDetailsRequest) {
  const queryString = Object.entries(queryParams)
    .filter(([key, value]) => value !== undefined)
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  try {
    const response = await privateApiInstance.get<Catalogue>
      (`/api/v1/catalog/${id}/?${queryString}`);
    return response;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

//delete Catalog
async function deleteCatalog(id: number, queryParams: TabDetailsRequest) {
  const queryString = Object.entries(queryParams)
    // .filter(([key, value]) => value !== undefined)
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  try {

    const response = await privateApiInstance.delete<APISuccessMessage>
      (`/api/v1/catalog/${id}?${queryString}`);

    return response;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getCataloguesSummary(queryParams: GetCatalogueRequest) {
  const queryString = Object.entries(queryParams)
    .filter(([key, value]) => value !== undefined)
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  try {
    const response = await privateApiInstance.get<CataloguesSummary>
      (`/api/v1/dashboard/catalog/summary?${queryString}`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getCatalogueTypeList() {
  try {
    const response = await privateApiInstance.get<CatalogueTypeList[]>
    ('/api/v1/data/catalog/type');
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function createCatalogue(bodyParams: CreateCatalogRequest) {
  try {
    const response = await privateApiInstance.post<APISuccessMessage>
      (`/api/v1/catalog`, bodyParams, {
        headers:{
          "customer-id": 1
        }
      });
    return response.data;

  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

// all catalog changes
async function getAllCatalogueLogs(catalogueId: number ,queryParams: PaginationRequest){
  try {
    const response = await privateApiInstance.get<APIGetResponse<CatalogueChangeLogs>>(
        `/api/v1/catalog/${catalogueId}/lot-version`, {params: queryParams}
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

// catalog changes by lotID
async function getCatalogueLogsById(lotId: number, queryParams: CatalogueLogsVersionRequest){
  try {
    const response = await privateApiInstance.get(
      `/api/v1/tea-lot/${lotId}/version-compare`, {params: queryParams}
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}


export const catalogueManagementService = {
  getCatalogues,
  uploadCatalogue,
  getTabDetails,
  deleteCatalog,
  getCataloguesSummary,
  getCatalogueTypeList,
  createCatalogue,
  getAllCatalogueLogs,
  getCatalogueLogsById
};