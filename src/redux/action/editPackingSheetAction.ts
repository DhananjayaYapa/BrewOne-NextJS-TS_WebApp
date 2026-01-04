import { createAsyncThunk } from "@reduxjs/toolkit";
import { dataManagementService, packingService, warehouseService } from "@/service";
import { RootState } from "../store";
import { BOMItem, SelectedWarehouseStock } from "@/interfaces";
import { WAREHOUSE_TYPES } from "@/constant";

export const getPackingSheetByDetail = createAsyncThunk(
  "/getPackingSheetByDetail",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedPackingSheet
    } = state.editPackingSheet;
    const response = await packingService.getPackingSheetByDetail(Number(selectedPackingSheet?.packingSheetId));
    return response;
  }
);


export const editPackingSheet = createAsyncThunk(
  "/editPackingSheet",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedPackingSheet, editPackingSheetHeaderForm, selectedWarehouses
    } = state.editPackingSheet;
    const mapToBOMItems = (stocks: SelectedWarehouseStock[]): any[] => {
      return stocks?.map((stock) => ({
        code: stock.itemCode,
        lots: stocks.filter(s=> s.itemCode === stock.itemCode)?.map((lot) => ({
          fromWarehouseCode: stock.fromWarehouse?.warehouseCode || "",
          batchId: lot.selectedLot?.batchId || "",
          quantity: lot.selectedLot?.requiredQuantity || 0,
        })),
      }));
    };
    const bodyParams: any = {
          orderDate: editPackingSheetHeaderForm.orderDate.value?.toString() || "",
          startDate: editPackingSheetHeaderForm.startDate.value?.toString() || "",
          dueDate: editPackingSheetHeaderForm.dueDate.value?.toString() || "",
          packingSheetItems: mapToBOMItems(selectedWarehouses).filter((item, index, self) =>
            index === self.findIndex((t) => t.code === item.code)
          )
    }
    const response = await packingService.editPackingSheet(bodyParams,Number(selectedPackingSheet?.packingSheetId),);
    return response;
  }
);


export const releasePackingSheet = createAsyncThunk(
  "/releasePackingSheet",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedPackingSheet
    } = state.editPackingSheet;
    const response = await packingService.releasePackingSheet(Number(selectedPackingSheet?.packingSheetId));
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

export const getWarehousesByItemCodes = createAsyncThunk(
  "/getWarehousesByItemCodes",
  async (itemCodes: string) => {
    const response = await dataManagementService.getWarehousesByItemCodes(itemCodes);
    return response;
  }
);