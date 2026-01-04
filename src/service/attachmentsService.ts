import { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import {
  APIErrorMessage,
  APISuccessMessage,
  PreSignedURL,
  UploadAttachment,
} from "@/interfaces";


async function uploadPresignedURL(queryParams: UploadAttachment) {
    const queryString = Object.entries(queryParams)
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  try {
    const response = await privateApiInstance.get<{data: PreSignedURL}>(
      `/api/v1/attachment/blend/upload?${queryString}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}


async function viewPresignedURL(queryParams: string) {
  //from api level has to solve this file view issue for files like words and excels, for images works
try {
  const response = await privateApiInstance.get<{data: PreSignedURL}>(
    `/api/v1/attachment/blend/view?fileKey=${queryParams}`
  );
  return response.data;
} catch (error) {
  throw new Error(
    (error as AxiosError<APIErrorMessage>).response?.data.message ||
      API_MESSAGES.FAILED_GET
  );
}
}

async function deletePresignedURL(queryParams: string) {
  try {
    const response = await privateApiInstance.delete<APISuccessMessage>(
      `/api/v1/attachment/blend/delete?fileKey=${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
  }


export const attachmentService = {
    uploadPresignedURL,
    viewPresignedURL,
    deletePresignedURL
};
