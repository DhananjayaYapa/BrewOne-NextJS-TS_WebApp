import axios, { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  BOMItemDetail,
} from "@/interfaces";


async function getBOMdetailsByBlendItemId(blendItemCode: string) {
  
  try {
    const response = await privateApiInstance.get<BOMItemDetail>(
      `/api/v1/item/${blendItemCode}/bom`
      // `/bomItems.json`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}



export const blendItemService = {
  getBOMdetailsByBlendItemId
};
