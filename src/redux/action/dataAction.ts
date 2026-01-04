import { createAsyncThunk } from "@reduxjs/toolkit";
import { dataManagementService } from "../../service";
import { RootState } from "../store";

export const getCatalogueStatusList = createAsyncThunk(
  "/getCatalogueStatusList",
  async () => {
    const response = await dataManagementService.getCatalogueStatusList();
    return response;
  }
);

export const getDeliveryOrderStatusList = createAsyncThunk(
  "/getDeliveryOrderStatusList",
  async () => {
    const response = await dataManagementService.getDeliveryOrderStatusList();
    return response;
  }
);

export const getDeliveryOrderMasterData = createAsyncThunk(
  "/getDeliveryOrderMasterData",
  async () => {
    const response = await dataManagementService.getDeliveryOrderMasterData();
    return response;
  }
);

export const syncMasterData = createAsyncThunk(
  "/updateMasterData",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const params = state.masterDataSync.selectedMasterDataType;
    const response = await dataManagementService.updateMasterData(params);
    return response;
  }
)

export const getSyncMasterDataDetails = createAsyncThunk(
  "/getSyncMasterDataDetails",
  async () => {
    const response = await dataManagementService.getMasterDataSyncDetails();
    return response;
  }
)

export const getDeliverySalesOrderMasterData = createAsyncThunk(
  "/getDeliverySalesOrderMasterData",
  async () => {
    const response = await dataManagementService.getSalesCodeMasterData();
    return response;
  }
);