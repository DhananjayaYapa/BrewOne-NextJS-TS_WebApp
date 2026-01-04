import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { attachmentService, dataManagementService, teaBoardService, warehouseService } from "@/service";
import { BlendSheetItem, OtherBlendItem, SelectedOtherItemLotStock, SelectedWarehouseStock, UploadAttachment } from "@/interfaces";
import { calculateTotalAllocatedQuantity } from "@/utill/blendSheetCalculations";
import { EditTeaBoardBody } from "@/interfaces/teaBoard";
import { itemMasterService } from "@/service/ItemMasterService";
import { WAREHOUSE_TYPES } from "@/constant";

export const getTeaBoardByDetails = createAsyncThunk(
  "/getTeaBoardByDetails",
  async (blendSheetId: number | undefined, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedBlendSheet } = state.teaBoard;
    // Use provided ID or fall back to selected blend sheet ID
    const id = blendSheetId || Number(selectedBlendSheet?.blendSheetId);
    const response = await teaBoardService.getTeaBoardDetails(id);
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

export const getItemMasterList = createAsyncThunk(
  "/getItemMasterList",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      itemListRequest
    } = state.teaBoard;
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
    } = state.teaBoard;
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

export const getToWarehousesList = createAsyncThunk(
  "/getToWarehousesList",
  async () => {
    const type = WAREHOUSE_TYPES.TO_WAREHOUSE_BLEND_SHEET
    const response = await warehouseService.getWarehouseList(type);
    return response;
  }
);

export const getBlendBalanceByBlendItem = createAsyncThunk(
  "/getBlendBalanceByBlendItem",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendItem
    } = state.teaBoard;
    if (selectedBlendItem) {
      const response = await dataManagementService.getBlendBalanceByBlendItem(selectedBlendItem?.code);
      return response;
    }
  }
);

export const saveTeaBoard = createAsyncThunk(
  "/saveTeaBoard",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBlendSheet,
      editBlendSheetHeaderForm,
      selectedWarehouses,
      BOMItems,
      uploads,
      selectedBlendBalances,
      getTeaBoardDetailResponse,
      selectedSFGItems,
      selectedOtherItem,
      OtherBOMItems,
    } = state.teaBoard;

    const teaBoardData = getTeaBoardDetailResponse.data;

    const mapToBOMItems = (
      stocks: SelectedWarehouseStock[]
    ): BlendSheetItem[] => {
      return stocks?.map((stock) => ({
        code: stock.itemCode,
        description: BOMItems?.bomItems.find((it) => it.code === stock.itemCode)
          ?.description,
        basedQuantity: BOMItems?.bomItems.find(
          (it) => it.code === stock.itemCode
        )?.basedQuantity,
        lots: stocks
          .filter((s) => s.itemCode === stock.itemCode)
          ?.map((lot) => ({
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

    const bodyParams: EditTeaBoardBody = {
      // Required fields from interface
      blendId:
        teaBoardData?.blendId || Number(selectedBlendSheet?.blendSheetId) || 0,
      blendSheetNo: teaBoardData?.blendSheetNo || "",
      salesOrderId: teaBoardData?.salesOrderId || 0,
      productItemCode: teaBoardData?.productItemCode || "",
      customerCode: teaBoardData?.customerCode || "",
      blendItemCode: teaBoardData?.blendItemCode || "",
      blendItemType: teaBoardData?.blendItemType || "",
      blendItemDescription: teaBoardData?.blendItemDescription || "",
      quantity: teaBoardData?.quantity || 0,
      plannedQuantity:
        editBlendSheetHeaderForm.actualPlannedQuantity.value ||
        teaBoardData?.plannedQuantity ||
        0,
      warehouseCode: teaBoardData?.warehouseCode || "",
      masterBlendSheetNo: teaBoardData?.masterBlendSheetNo || "",
      salesContractQuantity: teaBoardData?.salesContractQuantity || 0,
      statusId: teaBoardData?.statusId || 0,

      // Form data that can be edited
      orderDate:
        editBlendSheetHeaderForm.orderDate.value?.toString() ||
        teaBoardData?.orderDate ||
        "",
      startDate:
        editBlendSheetHeaderForm.startDate.value?.toString() ||
        teaBoardData?.startDate ||
        "",
      dueDate:
        editBlendSheetHeaderForm.dueDate.value?.toString() ||
        teaBoardData?.dueDate ||
        "",
      totalQuantity: calculateTotalAllocatedQuantity(
        selectedWarehouses,
        BOMItems,
        selectedBlendBalances || [],
        [],
        []
      ),
      attachments: uploads || [],

      // Items and balances
      blendSheetItems:
        editBlendSheetHeaderForm.plannedQuantity.value <= 0
          ? []
          : mapToBOMItems(selectedWarehouses).filter(
              (item, index, self) =>
                index === self.findIndex((t) => t.code === item.code)
            ),
      blendBalance: selectedBlendBalances?.map(({ isError, initialQuantity, isNew, ...rest }) => rest).filter((item) => item.quantity !== 0) || undefined,
      //blendItems: selectedSFGItems || undefined, // due to release on hold
      //otherBlendItems: selectedOtherItems || undefined, // // due to release on hold
      blendItems: selectedSFGItems,
      otherBlendItems: mapToOtherBOMItems(selectedOtherItem).filter((item, index, self) =>
          index === self.findIndex((t) => t.code === item.code)),
    };

    const response = await teaBoardService.saveTeaBoard(
      bodyParams,
      Number(selectedBlendSheet?.blendSheetId)
    );
    return response;
  }
);

export const getTeaBoardReportByDetails = createAsyncThunk(
  "/getTeaBoardReportByDetails",
  async (blendSheetId: number | undefined, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedBlendSheet } = state.teaBoard;
    const id = blendSheetId || Number(selectedBlendSheet?.blendSheetId);
    const response = await teaBoardService.getTeaBoardReportDetails(id);
    return response;
  }
);
