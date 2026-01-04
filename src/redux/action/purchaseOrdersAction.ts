
import { createAsyncThunk } from "@reduxjs/toolkit";
import { brokerManagementService, purchaseOrderService, teaLotManagementService } from "../../service";
import { RootState } from "../store";
import { updateTeaLotDetails } from "@/interfaces/teaLotById";
import dayjs from "dayjs";

export const getPurchaseOrderList = createAsyncThunk(
  '/getPurchaseOrderList',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      purchaseOrderListRequest
    } = state.purchaseOrderList;
    console.log(purchaseOrderListRequest,'0our')
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
    } = state.purchaseOrderList;
    if (selectedLot) {
      const response = await teaLotManagementService.getTeaLotDetailsById(selectedLot?.lotId, teaLotDetailRequest);
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


export const updateTeaLotDetailsById = createAsyncThunk(
  'UpdateTeaLotDetailsById',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedLot, lotDetailForm, selectedLotDetail } = state.purchaseOrderList;
  
      if(selectedLot){
        const bodyParams: updateTeaLotDetails = {
          itemCode: selectedLotDetail.data?.itemCode !== lotDetailForm.itemCode.value ? lotDetailForm?.itemCode?.value || "" : "",
          allowance: selectedLotDetail.data?.allowance !== Number(lotDetailForm.allowance.value) ? Number(lotDetailForm.allowance.value) : undefined,
          price: selectedLotDetail.data?.price !== Number(lotDetailForm.price.value) ? Number(lotDetailForm.price.value) || 0 : 0,
          standardId: selectedLotDetail.data?.standardId !== Number(lotDetailForm.standardId.value) ? Number(lotDetailForm.standardId.value) : undefined,
          buyer: selectedLotDetail.data?.buyer !== lotDetailForm.buyer.value ? lotDetailForm.buyer.value : undefined,
          sampleCount: selectedLotDetail.data?.sampleCount !== Number(lotDetailForm.sampleCount.value) ? Number(lotDetailForm.sampleCount.value) : undefined,
          breakId: selectedLotDetail.data?.breakId !== Number(lotDetailForm.breakId.value) ? Number(lotDetailForm.breakId.value) : undefined,
          elevationId: selectedLotDetail.data?.elevationId !== Number(lotDetailForm.elevationId.value) ? Number(lotDetailForm.elevationId.value) : undefined,
          chestTypeId: selectedLotDetail.data?.chestTypeId !== Number(lotDetailForm.chestTypeId.value) ? Number(lotDetailForm.chestTypeId.value) : undefined,
          sackTypeId: selectedLotDetail.data?.sackTypeId !== Number(lotDetailForm.sackTypeId.value) ? Number(lotDetailForm.sackTypeId.value) : undefined,
          remarks: selectedLotDetail.data?.remarks !== lotDetailForm.remarks.value ? lotDetailForm.remarks.value : undefined,
          storeAddress: selectedLotDetail.data?.storeAddress !== lotDetailForm.storeAddress.value ? lotDetailForm.storeAddress.value : undefined,
          postingDate: dayjs(selectedLotDetail.data?.postingDate).add(5.5, 'h').toDate(),
          weightPerBag: selectedLotDetail.data?.weightPerBag !== Number(lotDetailForm.weightPerBag.value) ? Number(lotDetailForm.weightPerBag.value) : 0,
          bagCount: selectedLotDetail.data?.bagCount !== Number(lotDetailForm.bagCount.value) ? Number(lotDetailForm.bagCount.value) : 0,
          estateCode: Number(selectedLotDetail.data?.estateCode) != Number(lotDetailForm.estateId.value) ? lotDetailForm.estateId.value?.toString() : null, // Number BE
          gradeId: selectedLotDetail.data?.gradeId !== Number(lotDetailForm.gradeId.value) ? lotDetailForm.gradeId.value?.toString() : null,
          invoiceNo: selectedLotDetail.data?.invoiceNo !== lotDetailForm.invoiceNo.value ? lotDetailForm.invoiceNo.value : undefined,
          paymentTypeId: 0
        }
      const response = await teaLotManagementService.updateTeaLotDetailsById(bodyParams, 1, selectedLot?.lotId);
      return response;
      }
  },
);

export const getBrokerList = createAsyncThunk(
  '/getBrokerList',
  async (_,) => {
    const response = await brokerManagementService.getBrokers();
    return response;
  },
);

export const cancelPO = createAsyncThunk(
  '/cancelPO',
  async (_,{ getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedPurchaseOrder } = state.purchaseOrderList;
  if(selectedPurchaseOrder){
    const response = await purchaseOrderService.cancelPO(selectedPurchaseOrder.purchaseOrderId)
    return response;
  }
  },
);

export const getPurchaseOrderByID = createAsyncThunk(
  '/getPurchaseOrderByID',
  async (_,{ getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedPurchaseOrder } = state.purchaseOrderList;
  if(selectedPurchaseOrder){
    const response = await purchaseOrderService.getPurchaseOrderByID(selectedPurchaseOrder.purchaseOrderId)
    return response;
  }
  },
);