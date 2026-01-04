import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { blendService } from "@/service/blendService";
import { salesOrderService } from "@/service/salesOrderService";
import { BOMItem, CreateBlendSheet, OtherBlendItem, SelectedOtherItemLotStock, SelectedWarehouseStock } from "@/interfaces";
import { calculateTotalAllocatedQuantity } from "@/utill/blendSheetCalculations";
import { itemMasterService } from "@/service/ItemMasterService";
import { dataManagementService } from "@/service";

export const getDuplicatedBlendSheetDetail = createAsyncThunk(
    "getDuplicatedBlendSheetDetail",
    async (id: number) => {
      const response = await blendService.getDuplicatedBlendSheetDetail(id);
      return response;
    }
)

export const getBlendBalanceByBlendItem = createAsyncThunk(
  "/getBlendBalanceByBlendItem",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendItem
    } = state.duplicateBlendSheet
    if (selectedBlendItem) {
      const response = await dataManagementService.getBlendBalanceByBlendItem(selectedBlendItem?.code);
      return response;
    }
  }
)


export const getBlendDetailBySalesOrderId = createAsyncThunk(
  "/getBlendDetailBySalesOrderId",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedSalesOrder, selectedProduct
    } = state.duplicateBlendSheet
    if (selectedProduct && selectedSalesOrder) {
      const response = await salesOrderService.getBlendDetailsBySalesOrderId(selectedSalesOrder?.salesOrderId, selectedProduct?.productItemCode);
      return response;
    }
  }
)

export const getItemMasterList = createAsyncThunk(
  "/getItemMasterList",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      itemListRequest
    } = state.duplicateBlendSheet;
    const response = await itemMasterService.getItemList(itemListRequest);
    return response;
  }
)

export const getOtherItemMasterList = createAsyncThunk(
  "/getOtherItemMasterList",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      otherItemsMasterListRequest
    } = state.duplicateBlendSheet;
    const response = await itemMasterService.getItemList(otherItemsMasterListRequest);
    return response;
  }
)


//TODO: ADD SFG
export const createBlendSheet = createAsyncThunk(
  "/createBlendSheet",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      uploads,
      selectedWarehouses, selectedSalesOrder,
      BOMItems, selectedBlendItem, selectedProduct, createBlendSheetHeaderForm,
      selectedBlendBalances, selectedOtherItem, OtherBOMItems, selectedSFGItems
    } = state.duplicateBlendSheet;
    const mapToBOMItems = (stocks: SelectedWarehouseStock[]): BOMItem[] => {
      return stocks?.map((stock) => ({
        code: stock.itemCode,
        description: BOMItems?.bomItems.find(s => s.code === stock.itemCode)?.description || '',
        basedQuantity: BOMItems?.bomItems.find(s => s.code === stock.itemCode)?.basedQuantity || 0,
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
        blendSheetItems: mapToBOMItems(selectedWarehouses).filter((item, index, self) =>
          index === self.findIndex((t) => t.code === item.code)
        ),
        attachments: uploads,
        blendBalance: selectedBlendBalances?.map(({ isError, initialQuantity, ...rest }) => rest) || undefined,
        totalQuantity: calculateTotalAllocatedQuantity(selectedWarehouses, BOMItems, selectedBlendBalances || [], selectedSFGItems, selectedOtherItem || []),
        quantity: selectedBlendItem?.quantity || 0, //cannot be undefined
        otherBlendItems: mapToOtherBOMItems(selectedOtherItem).filter((item, index, self) =>
          index === self.findIndex((t) => t.code === item.code)),
        blendItems: selectedSFGItems.length > 0 ? selectedSFGItems : undefined,
      }
      console.log(bodyParams,'bodyParams')
      const response = await blendService.createBlendSheet(bodyParams);
      return response;
    }
  }
)