import { createAsyncThunk } from "@reduxjs/toolkit";
import { blendService, brokerManagementService, dataManagementService, salesOrderService } from "../../service";
import { RootState } from "../store";

export const getAllBlendSheets = createAsyncThunk(
    '/getAllBlendSheets',
    async (_,{getState}) => {
        const state: RootState = getState() as RootState;
        const {
            blendSheetListRequest
        } = state.closeBlendSheet;
      const response = await blendService.getAllBlendSheets(blendSheetListRequest);
      return response;
    },
  );
  

  export const closeBlendSheets = createAsyncThunk(
    "/closeBlendSheets",
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        selectedBlendSheets
      } = state.closeBlendSheet;
      console.log('here come close',  selectedBlendSheets?.map(i => i.masterBlendSheetNo))
      if(selectedBlendSheets?.length > 0){
        const response = await blendService.closeBlendSheets({ masterBlendSheetNos: selectedBlendSheets?.map(i => i.masterBlendSheetNo)});
        return response;
      }
    }
  );


  export const getMasterBlendSheetDetails = createAsyncThunk(
    "/getMasterBlendSheetDetails",
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        selectedBlendSheets
      } = state.closeBlendSheet;
      const response = await dataManagementService.getMasterBlendSheetDetails(selectedBlendSheets.map(o => o.masterBlendSheetNo).toString());
      return response;
    }
  );