import { createAsyncThunk } from "@reduxjs/toolkit";
import { attachmentService, blendItemService, blendService, dataManagementService, salesOrderService, warehouseService } from "@/service";
import { BOMItem, OtherBlendItem, PaginationRequest, SelectedOtherItemLotStock, SelectedWarehouseStock, UploadAttachment } from "@/interfaces";
import { RootState } from "../store";
import { CreateBlendSheet } from "@/interfaces/blendSheet";
import { WAREHOUSE_TYPES } from "@/constant";
import { itemMasterService } from "@/service/ItemMasterService";
import { calculateTotalAllocatedQuantity } from "@/utill/blendSheetCalculations";

export const getSalesOrderList = createAsyncThunk(
  "/getSalesOrderList",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      salesOrderListRequest
    } = state.createBlendSheet;
    const response = await salesOrderService.getSalesOrderList(salesOrderListRequest);
    return response;
  }
);


export const getBlendDetailBySalesOrderId = createAsyncThunk(
  "/getBlendDetailBySalesOrderId",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedSalesOrder, selectedProduct
    } = state.createBlendSheet;
    if (selectedProduct && selectedSalesOrder) {
      const response = await salesOrderService.getBlendDetailsBySalesOrderId(selectedSalesOrder?.salesOrderId, selectedProduct?.productItemCode);
      return response;
    }
  }
);

export const getBOMDetailsByBlendItem = createAsyncThunk(
  "/getBOMDetailsByBlendItem",
  async (itemCodeId: string) => {
    const response = await blendItemService.getBOMdetailsByBlendItemId(itemCodeId);
    return response;
  }
);

export const getWarehousesByItemCodes = createAsyncThunk(
  "/getWarehousesByItemCodes",
  async (itemCodes: string) => {
    const response = await dataManagementService.getWarehousesByItemCodes(itemCodes);
    return response;
  }
);

export const createBlendSheet = createAsyncThunk(
  "/createBlendSheet",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      uploads,
      selectedWarehouses, selectedSalesOrder,
      BOMItemsResponse, selectedBlendItem, selectedProduct, createBlendSheetHeaderForm,
      selectedBlendBalances, selectedOtherItem, OtherBOMItems
    } = state.createBlendSheet;
    const mapToBOMItems = (stocks: SelectedWarehouseStock[]): BOMItem[] => {
      return stocks?.map((stock) => ({
        code: stock.itemCode,
        description: BOMItemsResponse.data?.bomItems.find(s => s.code === stock.itemCode)?.description || '',
        basedQuantity: BOMItemsResponse.data?.bomItems.find(s => s.code === stock.itemCode)?.basedQuantity || 0,
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
    if (selectedSalesOrder?.salesOrderId) {
      const bodyParams: CreateBlendSheet = {
        salesOrderId: selectedSalesOrder?.salesOrderId,
        productItemCode: selectedProduct?.productItemCode || "",
        orderDate: createBlendSheetHeaderForm.orderDate.value?.toString() || "",
        startDate: createBlendSheetHeaderForm.startDate.value?.toString() || "",
        dueDate: createBlendSheetHeaderForm.dueDate.value?.toString() || "",
        customerCode: selectedSalesOrder?.customerCode || "",
        blendItemCode: selectedBlendItem?.code || "",
        blendItemType: selectedBlendItem?.type || "",
        blendItemDescription: selectedBlendItem?.description || "",
        plannedQuantity: createBlendSheetHeaderForm.actualPlannedQuantity.value,
        warehouseCode: selectedBlendItem?.warehouseCode || "",
        remarks: createBlendSheetHeaderForm?.remarks.value || undefined,
        blendSheetItems: mapToBOMItems(selectedWarehouses).filter((item, index, self) => index === self.findIndex((t) => t.code === item.code)),
        attachments: uploads,
        blendBalance: selectedBlendBalances?.map(({ isError, initialQuantity, ...rest }) => rest) || undefined,
        totalQuantity: calculateTotalAllocatedQuantity(selectedWarehouses, BOMItemsResponse.data, selectedBlendBalances || [], [], selectedOtherItem || []),
        quantity: selectedBlendItem?.quantity || 0, //cannot be undefined
        otherBlendItems: mapToOtherBOMItems(selectedOtherItem).filter((item, index, self) =>
          index === self.findIndex((t) => t.code === item.code))
      }
      const response = await blendService.createBlendSheet(bodyParams);
      return response;
    }
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
    } = state.createBlendSheet;
    const response = await itemMasterService.getItemList(itemListRequest);
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

export const getBlendSheetBalances = createAsyncThunk(
  "/getBlendBalances",
  async () => {
    const response = await blendService.getBlendBalances('fileKey');
    return response;

  }
);

export const getBlendSheetByDetail = createAsyncThunk(
  "/getBlendSheetByDetail",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      duplicatedBlendSheet
    } = state.createBlendSheet;
    const response = await blendService.getBlendSheetByDetail(Number(duplicatedBlendSheet?.blendSheetId));
    return response;
  }
);

export const getBlendBalanceByBlendItem = createAsyncThunk(
  "/getBlendBalanceByBlendItem",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendItem
    } = state.createBlendSheet;
    if (selectedBlendItem) {
      const response = await dataManagementService.getBlendBalanceByBlendItem(selectedBlendItem?.code);
      return response;
    }
  }
);

export const getOtherItemMasterList = createAsyncThunk(
  "/getOtherItemMasterListCreate",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      otherItemsMasterListRequest
    } = state.createBlendSheet;
    const response = await itemMasterService.getItemList(otherItemsMasterListRequest);
    return response;
  }
)