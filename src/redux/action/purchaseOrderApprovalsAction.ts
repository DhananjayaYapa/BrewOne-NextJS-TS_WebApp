import { createAsyncThunk } from "@reduxjs/toolkit";
import { approvalManagementService, brokerManagementService, purchaseOrderService, teaLotManagementService } from "../../service";
import { RootState } from "../store";
import { ApproveRequest, RejectRequest } from "@/interfaces/approval";
import { FEATURES } from "@/constant";

export const getPurchaseOrderApprovalList = createAsyncThunk(
  '/getPurchaseOrderApprovalList',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      purchaseOrderListRequest
    } = state.purchaseOrderApprovals;
    const response = await purchaseOrderService.getPurchaseOrderList(purchaseOrderListRequest);
    return response;
  },
);


export const getTeaLotDetails = createAsyncThunk(
  '/getTeaLotDetails',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedLot, teaLotDetailRequest
    } = state.purchaseOrderApprovals;
    if (selectedLot) {
      const response = await teaLotManagementService.getTeaLotDetailsById(selectedLot?.lotId, teaLotDetailRequest);
      return response;
    }
  },
);


export const approvePO = createAsyncThunk(
  '/approvePO',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedPurchaseOrder
    } = state.purchaseOrderApprovals;
    if (selectedPurchaseOrder?.approval?.requestId) {
      const featureKey: ApproveRequest = {
       featureKey: FEATURES.RELEASE_PURCHASE_ORDER
    }
      const response = await approvalManagementService
      .approveRequest(selectedPurchaseOrder?.approval?.requestId?.toString(), featureKey)
      // .approveAndReleasePO(selectedPurchaseOrder?.purchaseOrderId);
      return response;
    }
  },
);


export const rejectPO = createAsyncThunk(
  '/rejectPO',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedPurchaseOrder, rejectReason
    } = state.purchaseOrderApprovals;
    if (selectedPurchaseOrder?.approval && rejectReason) {
      const feature: RejectRequest = {
        featureKey: FEATURES.RELEASE_PURCHASE_ORDER,
        rejectReason: rejectReason
      }
      const response = await approvalManagementService.rejectRequest(selectedPurchaseOrder?.approval?.requestId?.toString(), feature);
      return response;
    }
  },
);

export const getMasterData = createAsyncThunk(
  '/getMasterData',
  async (_,) => {
    const response = await teaLotManagementService.getMasterData();
    return response;
  },
);

export const getBrokerList = createAsyncThunk(
  '/getBrokerList',
  async (_,) => {
    const response = await brokerManagementService.getBrokers();
    return response;
  },
);