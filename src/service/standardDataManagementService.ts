import { AxiosError } from 'axios';
import {
  APIErrorMessage,
  StandardData,
} from '@/interfaces';
import { API_MESSAGES } from '@/constant';
import { privateApiInstance } from '.';
 
async function getStandardDataDetails() {
 
  try {
    const response = await privateApiInstance.get<StandardData[]>
    ('/api/v1/standard');
   
    return response.data;
    
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}
 
export const standardDataManagementService = {
    getStandardDataDetails,
};