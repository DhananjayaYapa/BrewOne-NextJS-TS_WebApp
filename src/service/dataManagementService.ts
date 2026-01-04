import {
  APIErrorMessage,
  CatalogueStatus,
  DeliveryOrderMasterData,
  DeliveryOrderStatus,
  GetMasterBlendBalance,
  PackingSheetStatus,
  WarehouseStock,
  BlendBalanceItem,
  BlendSheetStatus,
  OtherItemLotStock,
  DeliverySalesOrderMasterData
} from '@/interfaces';
import { API_MESSAGES } from '@/constant';
import { privateApiInstance } from '.';
import axios, { AxiosError } from 'axios';
import { Feature, UserRoleFeature } from '@/interfaces/feature';

async function getCatalogueStatusList() {
  try {
    const response = await privateApiInstance.get<CatalogueStatus[]>
      ('/api/v1/data/catalog/status');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function getDeliveryOrderStatusList() {
  try {
    const response = await privateApiInstance.get<DeliveryOrderStatus[]>
      ('/api/v1/data/delivery-order/status');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function getDeliveryOrderMasterData() {
  try {
    const response = await privateApiInstance.get<DeliveryOrderMasterData>
      ('/api/v1/data/delivery-order/master');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function getWarehousesByItemCodes(itemCodes: string) {
  try {
    const response = await privateApiInstance.get<WarehouseStock[]>
      (`/api/v1/data/items/lots?itemCodes=${itemCodes}`);
    // const response = await axios.get<WarehouseStock[]>
    // ('warehouse.json');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function getOtherItemLotsByItemCodes(itemCodes: string) {
  try {
    const response = await privateApiInstance.get<OtherItemLotStock[]>
      (`/api/v1/data/other-blend-item/lot?itemCodes=${itemCodes}`);
    return response.data;
    // const response = await axios.get<OtherItemLotStock[]>('/otherBlendItems.json');
    // return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function getBlendSheetStatusList() {
  try {
    const response = await privateApiInstance.get<BlendSheetStatus[]>
      ('/api/v1/data/blend-sheet/status');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function getPackingSheetStatusList() {
  try {
    const response = await privateApiInstance.get<PackingSheetStatus[]>
      ('/api/v1/data/packing-sheet/status');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function getFeatureList() {
  try {
    const response = await privateApiInstance.get<Feature[]>
      ('/api/v1/data/features');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}

async function updateMasterData(masterItem: string) {
  try {
    const response = await privateApiInstance.post(`/api/v1/master-data/sync-${masterItem}-master-data-request`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getMasterDataSyncDetails() {
  try {
    const response = await privateApiInstance.get('/api/v1/master-data/sync-detail');
    return response.data;
  } catch (error) {
    throw new Error(
       (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getBlendBalanceByBlendItem(blendItemCode: string) {
  try {
    const response = await privateApiInstance.get<BlendBalanceItem[]>(
      // const response = await axios.get<BlendBalanceItem>(
      `/api/v1/data/blend-balance?blendItemCode=${blendItemCode}`
      // `/getBlendBalanceByBlendItem.json`
    );
    return response.data;
  } catch (error) {
    throw new Error(
       (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getRoleWiseFeatures() {
  try {
    const response = await privateApiInstance.get<UserRoleFeature[]>(
      `/api/v1/data/role-features`
      // `/featureByUserRoles.json`
    );
    return response.data;
  } catch (error) {
    throw new Error(
       (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getMasterBlendSheetDetails(masterBlendSheetNos: string) {
  try {
    const response = await privateApiInstance.get<GetMasterBlendBalance[]>(
      // const response = await axios.get<BlendBalanceItem>(
      `/api/v1/data/master-blend-sheet?masterBlendSheetNos=${masterBlendSheetNos}`
      // `/getBlendBalanceByBlendItem.json`
    );
    return response.data;
  } catch (error) {
    throw new Error(
       (error as AxiosError<APIErrorMessage>).response?.data.message || API_MESSAGES.FAILED_GET,
    );
  }
}

async function getSalesCodeMasterData() {
  try {
    const response = await privateApiInstance.get<DeliverySalesOrderMasterData>
      ('/api/v1/data/sales-codes');
    return response.data;
  } catch (error) {
    throw new Error(
      API_MESSAGES.FAILED_GET,
    );
  }
}


export const dataManagementService = {
  getCatalogueStatusList,
  getDeliveryOrderStatusList,
  getDeliveryOrderMasterData,
  getWarehousesByItemCodes,
  getBlendSheetStatusList,
  getPackingSheetStatusList,
  getFeatureList,
  updateMasterData,
  getMasterDataSyncDetails,
  getBlendBalanceByBlendItem,
  getRoleWiseFeatures,
  getMasterBlendSheetDetails,
  getOtherItemLotsByItemCodes,
  getSalesCodeMasterData
};