import { createAsyncThunk } from "@reduxjs/toolkit";
import { packingService, dataManagementService, salesOrderService } from "../../service";
import { RootState } from "../store";
import { BOMItem, SelectedWarehouseStock } from "@/interfaces";
import { CreateBlendSheet, CreatePackingSheet } from "@/interfaces/blendSheet";

export const getAllPackingSheets = createAsyncThunk(
    '/getAllPackingSheets',
    async (_,{getState}) => {
        const state: RootState = getState() as RootState;
        const {
            packingSheetListRequest
        } = state.packingSheet;
      const response = await packingService.getAllPackingSheets(packingSheetListRequest);
      return response;
    },
  );
  
  
  export const getPackingSheetStatus = createAsyncThunk(
    '/getPackingSheetStatus',
    async () => {
      const response = await dataManagementService.getPackingSheetStatusList()
      return response;
    },
  );


  export const createPackingSheet = createAsyncThunk(
    "/createPackingSheet",
    async (_, {getState}) => {
      const state: RootState = getState() as RootState;
      const {
        selectedWarehouses, selectedSalesOrder, BOMItemsResponse, selectedPackingItem, selectedProduct, packingDetailResponse, createPackingSheetHeaderForm
      } = state.createPackingSheet;
      const mapToBOMItems = (stocks: SelectedWarehouseStock[]): BOMItem[] => {
        return stocks?.map((stock) => ({
          code: stock.itemCode,
          description: BOMItemsResponse.data?.bomItems.find(s => s.code === stock.itemCode)?.description || '',
          basedQuantity: BOMItemsResponse.data?.bomItems.find(s => s.code === stock.itemCode)?.basedQuantity || 0,
          lots: stocks.filter(s=> s.itemCode === stock.itemCode)?.map((lot) => ({
            fromWarehouseCode: stock.fromWarehouse?.warehouseCode || "",
            batchId: lot.selectedLot?.batchId || "",
            quantity: lot.selectedLot?.requiredQuantity || 0,
          })),
        }));
      };
      if(selectedSalesOrder?.salesOrderId){
      const bodyParams: any = {
        salesOrderId: selectedSalesOrder?.salesOrderId,
        orderDate: createPackingSheetHeaderForm.orderDate.value?.toString() ||"",
        startDate: createPackingSheetHeaderForm.startDate.value?.toString() || "",
        dueDate: createPackingSheetHeaderForm.dueDate.value?.toString() || "",
        customerCode: selectedSalesOrder?.customerCode || "",
        packingItemCode: packingDetailResponse?.data.packingItemCode || "",
        packingItemType:  packingDetailResponse?.data.packingItemType|| "",
        packingItemDescription: packingDetailResponse?.data.packingItemDescription || "" ,
        plannedQuantity: packingDetailResponse?.data?.plannedQuantity || 0,
        warehouseCode: packingDetailResponse?.data.warehouseCode || "",
        packingSheetItems:mapToBOMItems(selectedWarehouses).filter((item, index, self) =>
          index === self.findIndex((t) => t.code === item.code)
        )
      }
      const response = await packingService.createPackingSheets(bodyParams);
      return response;
    }}
  );

  export const getPackingDetailBySalesOrderId = createAsyncThunk(
    "/getPackingDetailBySalesOrderId",
    async (_, {getState}) => {
      const state: RootState = getState() as RootState;
      const {
        selectedSalesOrder, selectedProduct
      } = state.createPackingSheet;
      if(selectedProduct && selectedSalesOrder){
        const response = await salesOrderService.getPackingDetailBySalesOrderId(selectedSalesOrder?.salesOrderId,selectedProduct?.productItemCode);
        return response;
      }
    }
  );
  
  
  export const getBOMDetailsByPackingItem = createAsyncThunk(
    "/getBOMDetailsByPackingItem",
    async (itemCodeId: string) => {
      const response = await packingService.getBOMDetailsByPackingItem(itemCodeId);
      return response;
    }
  );

  export const getSalesOrderList = createAsyncThunk(
    "/getSalesOrderList",
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        salesOrderListRequest
      } = state.createPackingSheet;
      const response = await salesOrderService.getSalesOrderList(salesOrderListRequest);
      return response;
    }
  );
