import {
  Warehouse,
} from '@/interfaces';
import { API_MESSAGES } from '@/constant';
import { privateApiInstance } from '.';
 
async function getWarehouseList(type: number) {
  try {
    const response = await privateApiInstance.get<Warehouse[]>
    (`/api/v1/warehouse?type=${type}`);
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}


 
export const warehouseService = {
  getWarehouseList
};