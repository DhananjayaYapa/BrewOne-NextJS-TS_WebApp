import axios, { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  APIGetResponse,
  BOMItemDetail,
} from "@/interfaces";
import { GetItemRequest } from "@/interfaces/item";
import { ItemDetail } from "@/interfaces/teaLotById";


async function getItemList(queryParams: GetItemRequest) {
  const queryString = Object.entries(queryParams)
  .filter(([key, value]) => value !== undefined && value !== "")
  ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&');
  try {
    const response = await privateApiInstance.get<APIGetResponse<ItemDetail>>(
      `/api/v1/item?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}



export const itemMasterService = {
  getItemList
};
