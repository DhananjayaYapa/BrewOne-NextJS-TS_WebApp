import { CreatePurchaseOrderRequest, GetTeaLotDetailsRequest } from "@/interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CUSTOMER_ID, FEATURES } from "@/constant";
import { approvalManagementService, purchaseOrderService } from "@/service";
import { ApproveRequest } from "@/interfaces/approval";

export const createPurchaseOrder = createAsyncThunk(
  "/createPurchaseOrder",
  async (createPurchaseOrderRequest: CreatePurchaseOrderRequest) => {
    const response = await purchaseOrderService.createPurchaseOrder(
      createPurchaseOrderRequest
    );
    return response;
  }
);

export const addBuyingPlan = createAsyncThunk(
    '/addBuyingPlan',
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        selectedLot
      } = state.lotDetails;
      const queryParams: GetTeaLotDetailsRequest = {
          customerId: 1,
      };
      const response = await purchaseOrderService.addBuyingPlan(selectedLot, queryParams);
      return response;
    },
);

export const cancelBuyingPlan = createAsyncThunk(
    '/cancelBuyingPlan',
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        selectedLot
      } = state.lotDetails;
      const queryParams: GetTeaLotDetailsRequest = {
          customerId: CUSTOMER_ID,
      };
      const response = await purchaseOrderService.cancelBuyingPlan(selectedLot, queryParams);
      return response;
    },
);

export const releasePO = createAsyncThunk(
  "/releasePO",
  async (entityId: number) => {
    const response = await purchaseOrderService.releasePO(entityId)
    return response;
  }
);