import { AxiosError } from 'axios';
import {
  APIErrorMessage,
  Broker,
  GetBrokerParams,
  TextFile,
  TextFileCodes,
} from '@/interfaces';
import { API_MESSAGES } from '@/constant';
import { privateApiInstance } from '.';

async function getBrokers(queryParams?: GetBrokerParams) {
  try {
    const response = await privateApiInstance.get<Broker[]>
    ('/api/v1/broker', { params: queryParams});
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getTextFileFormatByBrokerCode(brokerCode: string) {
  try {
    const response = await privateApiInstance.get<TextFile[]>
    (`/api/v1/broker/${brokerCode}/text-file-format`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}


async function getTextFileCodesByBrokerCode(brokerCode: string) {
  try {
    const response = await privateApiInstance.get<TextFileCodes[]>
    (`/api/v1/broker/${brokerCode}/text-file-item-code`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

export const brokerManagementService = {
  getBrokers,
  getTextFileFormatByBrokerCode,
  getTextFileCodesByBrokerCode
};