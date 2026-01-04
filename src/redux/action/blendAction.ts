import { createAsyncThunk } from "@reduxjs/toolkit";
import { blendService, brokerManagementService, dataManagementService, salesOrderService } from "../../service";
import { RootState } from "../store";

export const getAllBlendSheets = createAsyncThunk(
    '/getAllBlendSheets',
    async (_,{getState}) => {
        const state: RootState = getState() as RootState;
        const {
            blendSheetListRequest
        } = state.blendSheet;
      const response = await blendService.getAllBlendSheets(blendSheetListRequest);
      return response;
    },
  );


  export const getBlendSheetStatus = createAsyncThunk(
    '/getBlendSheetStatus',
    async () => {
      const response = await dataManagementService.getBlendSheetStatusList()
      return response;
    },
  );

  export const getSalesOrderList = createAsyncThunk(
    "/getSalesOrderList",
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        salesOrderListRequest
      } = state.blendSheet;
      const response = await salesOrderService.getSalesOrderList(salesOrderListRequest);
      return response;
    }
  );

  // export const closeBlendSheets = createAsyncThunk(
  //   "/closeBlendSheets",
  //   async (_, { getState }) => {
  //     const state: RootState = getState() as RootState;
  //     const {
  //       selectedBlendSheets
  //     } = state.closeBlendSheet;
  //     const response = await blendService.closeBlendSheets({ masterBlendSheetNos: selectedBlendSheets?.map(i => Number(i.masterBlendSheetNo))});
  //     return response;
  //   }
  // );


  export const getPrintBlendSheet = createAsyncThunk(
    "/getPrintBlend",
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        selectedBlendSheet
      } = state.editBlendSheet;

      if(selectedBlendSheet){
        const response = await blendService.getPrintBlendSheet(selectedBlendSheet.blendSheetId);
        return response;
      }
    }
  );

  export const getAllSFGItemsByMasterBlendNo = createAsyncThunk(
    "getAllSFGItemsByMasterBlendNo",
    async (masterBlendSheetNo: string) => {
      const queryParams = {
        masterBlendSheetNo
      }
      const response = await blendService.getAllSFGItemsByMasterBlendNo(queryParams);
      return response;
    }
  )