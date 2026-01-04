import axios, { AxiosError } from "axios";
import { API_MESSAGES } from "@/constant";
import { privateApiInstance } from ".";
import { APIErrorMessage, APISuccessMessage } from "@/interfaces";
import {
  EditTeaBoardBody,
  GetTeaBoardDetail,
  GetTeaBoardReportDetail,
} from "@/interfaces/teaBoard";

async function getTeaBoardDetails(blendId: number) {
  try {
    const response = await privateApiInstance.get<GetTeaBoardDetail>(
      `/api/v1/blend/${blendId}/tea-board-sheet`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function saveTeaBoard(bodyParams: EditTeaBoardBody, blendId: number) {
  try {
    console.log("saveTeaBoard request:", { bodyParams, blendId });
    const response = await privateApiInstance.post<APISuccessMessage>(
      `/api/v1/blend/${blendId}/tea-board-sheet`,
      bodyParams,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    return response.data;
    // console.log('saveTeaBoard details', { bodyParams, blendId });

    // await new Promise(resolve => setTimeout(resolve, 1000));
    // const mockResponse: APISuccessMessage = {
    //   message: "Tea board saved successfully (MOCK)"
    // };
    // console.log('response:', mockResponse);
    // return mockResponse;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

async function getTeaBoardReportDetails(blendId: number) {
  try {
    const response = await privateApiInstance.get<GetTeaBoardReportDetail>(
      `/api/v1/blend/${blendId}/tea-board-report`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message ||
        API_MESSAGES.FAILED_GET
    );
  }
}

export const teaBoardService = {
  getTeaBoardDetails,
  saveTeaBoard,
  getTeaBoardReportDetails,
};
