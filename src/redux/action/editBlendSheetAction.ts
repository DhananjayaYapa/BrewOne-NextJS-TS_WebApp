import { createAsyncThunk } from "@reduxjs/toolkit";
import { approvalManagementService, attachmentService, blendService, dataManagementService, warehouseService } from "@/service";
import { RootState } from "../store";
import { BlendSheetItem, EditBlendSheetBody } from "@/interfaces/blendSheet";
import { ApprovalAPICustomError, BOMItem, OtherBlendItem, PaginationRequest, SelectedOtherItemLotStock, SelectedWarehouseStock, UploadAttachment } from "@/interfaces";
import { API_MESSAGES, FEATURES, WAREHOUSE_TYPES } from "@/constant";
import { itemMasterService } from "@/service/ItemMasterService";
import { CreateApprovalRequest } from "@/interfaces/approval";
import { AxiosError } from "axios";
import { calculateTotalAllocatedQuantity } from "@/utill/blendSheetCalculations";

export const getBlendSheetByDetail = createAsyncThunk(
  "/getBlendSheetByDetail",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet
    } = state.editBlendSheet;
    const response = await blendService.getBlendSheetByDetail(Number(selectedBlendSheet?.blendSheetId));
    return response;
  }
);

export const getWarehousesByItemCodes = createAsyncThunk(
  "/getWarehousesByItemCodes",
  async (itemCodes: string) => {
    if (itemCodes !== "") {
      const response = await dataManagementService.getWarehousesByItemCodes(itemCodes);
      return response;
    }
  }
);

export const getOtherItemLotsByItemCodes = createAsyncThunk(
  "/getOtherItemLotsByItemCodes",
  async (itemCodes: string) => {
    if (itemCodes !== "") {
      const response = await dataManagementService.getOtherItemLotsByItemCodes(itemCodes);
      return response;
    }
  }
);

export const editBlendSheet = createAsyncThunk(
  "/editBlendSheet",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet, editBlendSheetHeaderForm, selectedWarehouses, BOMItems, uploads, selectedBlendBalances, selectedSFGItems, OtherBOMItems, selectedOtherItem
    } = state.editBlendSheet;
    const mapToBOMItems = (stocks: SelectedWarehouseStock[]): BlendSheetItem[] => {
      return stocks?.map((stock) => ({
        code: stock.itemCode,
        description: BOMItems?.bomItems.find((it) => it.code === stock.itemCode)?.description,
        basedQuantity: BOMItems?.bomItems.find((it) => it.code === stock.itemCode)?.basedQuantity,
        lots: stocks.filter(s => s.itemCode === stock.itemCode)?.map((lot) => ({
          fromWarehouseCode: stock.fromWarehouse?.warehouseCode || "",
          batchId: lot.selectedLot?.batchId || "",
          quantity: lot.selectedLot?.requiredQuantity || 0,
          boxNo: lot.selectedLot?.boxNo || null,
          price: lot.selectedLot?.price || null,
          weightPerBag: lot.selectedLot?.weightPerBag || null,
        })),
      }));
    };

    const mapToOtherBOMItems = (stocks: SelectedOtherItemLotStock[]): OtherBlendItem[] => {
      return stocks?.map((stock) => ({
        code: stock.itemCode,
        description: OtherBOMItems?.bomItems.find((it) => it.code === stock.itemCode)?.description || "",
        lots: stocks.filter(s => s.itemCode === stock.itemCode)?.map((lot) => ({
          warehouseCode: lot.selectedLot?.warehouseCode || "",
          batchId: lot.selectedLot?.batchId || "",
          quantity: lot.selectedLot?.requiredQuantity || 0,
          price: lot.selectedLot?.price || null,
          weightPerBag: lot.selectedLot?.weightPerBag || null
        })),
      }))
    }

    const bodyParams: EditBlendSheetBody = {
      orderDate: editBlendSheetHeaderForm.orderDate.value?.toString() || "",
      startDate: editBlendSheetHeaderForm.startDate.value?.toString() || "",
      dueDate: editBlendSheetHeaderForm.dueDate.value?.toString() || "",
      remarks: editBlendSheetHeaderForm?.remarks.value || undefined,
      totalQuantity: calculateTotalAllocatedQuantity(selectedWarehouses, BOMItems, selectedBlendBalances || [],  selectedSFGItems || [], selectedOtherItem || []), // validation should be handled
      attachments: uploads,
      blendSheetItems:  mapToBOMItems(selectedWarehouses).filter((item, index, self) =>
          index === self.findIndex((t) => t.code === item.code)
        ),
      blendBalance: selectedBlendBalances?.map(({ isError, initialQuantity, isNew, ...rest }) => rest).filter((item) => item.quantity !== 0) || undefined,
      //blendItems: selectedSFGItems || undefined, // due to release on hold
      //otherBlendItems: selectedOtherItems || undefined, // // due to release on hold
      blendItems: selectedSFGItems,
      otherBlendItems: mapToOtherBOMItems(selectedOtherItem).filter((item, index, self) =>
          index === self.findIndex((t) => t.code === item.code)),
    }
    const response = await blendService.editBlendSheet(bodyParams, Number(selectedBlendSheet?.blendSheetId),);
    return response;
  }
);


export const releaseBlendSheet = createAsyncThunk(
  "/releaseBlendSheet",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet
    } = state.editBlendSheet;
    const response = await blendService.releaseBlendSheet(Number(selectedBlendSheet?.blendSheetId));
    return response;
  }
);


export const getToWarehousesList = createAsyncThunk(
  "/getToWarehousesList",
  async () => {
    const type = WAREHOUSE_TYPES.TO_WAREHOUSE_BLEND_SHEET
    const response = await warehouseService.getWarehouseList(type);
    return response;
  }
);

export const getItemMasterList = createAsyncThunk(
  "/getItemMasterList",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      itemListRequest
    } = state.editBlendSheet;
    const response = await itemMasterService.getItemList(itemListRequest);
    return response;
  }
);

export const getOtherItemMasterList = createAsyncThunk(
  "/getOtherItemMasterList",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      otherItemsMasterListRequest
    } = state.editBlendSheet;
    const response = await itemMasterService.getItemList(otherItemsMasterListRequest);
    return response;
  }
);

export const getViewPresignedURL = createAsyncThunk(
  "/getViewPresignedURL",
  async (fileKey: string) => {
    const response = await attachmentService.viewPresignedURL(fileKey);
    return response;
  }
);

export const getUploadPresignedURL = createAsyncThunk(
  "/getUploadPresignedURL",
  async (attachment: UploadAttachment, { getState }) => {
    const state: RootState = getState() as RootState;

    const response = await attachmentService.uploadPresignedURL(attachment);
    return response;

  }
);

export const deleteAttachment = createAsyncThunk(
  "/deleteAttachment",
  async (fileKey: string) => {
    const response = await attachmentService.deletePresignedURL(fileKey);
    return response;

  }
);

export const createBlendSheetApprovalRequest = createAsyncThunk(
  "/createBlendSheetApprovalRequest",
  async (_, { getState, rejectWithValue }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet
    } = state.editBlendSheet;
    if (selectedBlendSheet) {
      try {
        const feature: CreateApprovalRequest = {
          featureKey: FEATURES.RELEASE_BLEND_SHEET,
          entityId: selectedBlendSheet?.blendSheetId
        }
        const response = await approvalManagementService.createApprovalRequest(feature);
        return response;
      }catch (error) {
        const axiosErr = error as AxiosError<ApprovalAPICustomError>;
        return rejectWithValue({
          message: axiosErr.response?.data.message || API_MESSAGES.FAILED_GET,
          extraInfo: axiosErr.response?.data?.extraInfo || undefined,
          blendInfo: axiosErr.response?.data?.blendInfo || undefined,
        });
      }
    }
  }
);


export const getBlendBalanceByBlendItem = createAsyncThunk(
  "/getBlendBalanceByBlendItem",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendItem
    } = state.editBlendSheet;
    if (selectedBlendItem) {
      const response = await dataManagementService.getBlendBalanceByBlendItem(selectedBlendItem?.code);
      return response;
    }
  }
);

export const getAllBlendChangeLogs = createAsyncThunk(
  "/getAllBlendChangeLogs",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;

    const queryParams: PaginationRequest = {
      page: state.editBlendSheet.changeLogCurrentPage + 1,
      limit: state.editBlendSheet.changeLogLimit,
    }

    const {
      changeLogBlendId
    } = state.editBlendSheet

    if (changeLogBlendId) {
      const response = await blendService.getAllBlendChangeLogs(changeLogBlendId, queryParams);
      return response;
    }
  },
);

export const getBlendChangeLogById = createAsyncThunk(
  '/getBlendChangeLogById',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendChangeLog, blendChangeLogsResponseByIdRequest
    } = state.editBlendSheet;
    if (!selectedBlendChangeLog) {
      return;
    }

    const response = await blendService.getBlendChangeLogById(selectedBlendChangeLog, blendChangeLogsResponseByIdRequest);
    return response;
  },
);