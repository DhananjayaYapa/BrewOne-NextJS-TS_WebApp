import { createAsyncThunk } from "@reduxjs/toolkit";
import { approvalManagementService, blendService, dataManagementService, salesOrderService } from "../../service";
import { RootState } from "../store";
import { ApproveRequest, RejectRequest } from "@/interfaces/approval";
import { FEATURES } from "@/constant";
import { features } from "process";

export const getAllBlendSheets = createAsyncThunk(
  '/getAllBlendSheets',
  async (_,{getState}) => {
      const state: RootState = getState() as RootState;
      const {
          blendSheetListRequest
      } = state.blendSheetApprovals;
    const response = await blendService.getAllBlendSheets(blendSheetListRequest);
    return response;
  },
);

export const approveBlendSheet = createAsyncThunk(
  '/approveBlendShet',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet
    } = state.blendSheetApprovals;
    if (selectedBlendSheet?.approval?.requestId) {
      const feature:ApproveRequest ={
        featureKey: FEATURES.RELEASE_BLEND_SHEET
      }
      const response = await approvalManagementService.approveRequest(selectedBlendSheet?.approval?.requestId?.toString(), feature);
      return response;
    }
  },
);


export const rejectBlendSheet = createAsyncThunk(
  '/rejectBlendSheet',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet, rejectReason
    } = state.blendSheetApprovals;
    if (selectedBlendSheet?.approval && rejectReason) {
      const feature: RejectRequest = {
        featureKey: FEATURES.RELEASE_BLEND_SHEET,
        rejectReason: rejectReason
      }
      const response = await approvalManagementService.rejectRequest(selectedBlendSheet?.approval?.requestId?.toString(), feature);
      return response;
    }
  },
);

export const getBlendSheetByDetail = createAsyncThunk(
  "/getBlendSheetByDetail",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet
    } = state.blendSheetApprovals;
    const response = await blendService.getBlendSheetByDetail(Number(selectedBlendSheet?.blendSheetId));
    return response;
  }
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
      } = state.blendSheetApprovals;
      const response = await salesOrderService.getSalesOrderList(salesOrderListRequest);
      return response;
    }
  );

  export const getBlendBalanceByBlendItem = createAsyncThunk(
    "/getBlendBalanceByBlendItem",
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        selectedBlendItem
      } = state.blendSheetApprovals;
      if (selectedBlendItem) {
        const response = await dataManagementService.getBlendBalanceByBlendItem(selectedBlendItem?.code);
        return response;
      }
    }
  );