import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  APIGetResponse,
  Blend,
  BlendChangeLogByIdRequest,
  BlendChangeLogByIdResponse,
  BlendChangeLogs,
  BlendItem,
  BlendSFGItem,
  BlendSFGItemOptions,
  BlendSheetHeaderForm,
  BOMItemDetail,
  FormIdentifier,
  GetPrintBlendSheetDetail,
  OtherBlendItem,
  OtherBOMItemDetail,
  OtherItemLotStock,
  PreSignedURL,
  ResponseState,
  SalesOrder,
  SelectedOtherItemLotStock,
  Warehouse,
  WarehouseStock,
} from "@/interfaces";
import { FORM_VALIDATOR_TYPES } from "@/utill/common/formValidator/const";
import { formFieldValidator } from "@/utill/common/formValidator/main";
import {
  ProductItem,
  SelectedWarehouseStock,
  BOMItem,
} from "@/interfaces/salesOrder";
import {
  BlendBalance,
  BlendBalanceItem,
  BlendSheet,
  EditBlendSheetSuccess,
} from "@/interfaces";
import {
  deleteAttachment,
  getAllBlendChangeLogs,
  getBlendChangeLogById,
  releaseBlendSheet,
} from "../action/editBlendSheetAction";
import { ITEM_TYPES } from "@/constant";
import { ItemDetail } from "@/interfaces/teaLotById";
import { GetItemRequest } from "@/interfaces/item";
import {
  getTeaBoardByDetails,
  getTeaBoardReportByDetails,
  saveTeaBoard,
  getBlendBalanceByBlendItem,
  getItemMasterList,
  getOtherItemLotsByItemCodes,
  getOtherItemMasterList,
  getUploadPresignedURL,
  getViewPresignedURL,
  getWarehousesByItemCodes,
} from "../action/teaBoardAction";
import {
  GetTeaBoardDetail,
  GetTeaBoardReportDetail,
} from "@/interfaces/teaBoard";
import { initialBlendSheetHeaderForm } from "./createBlendSheetSlice";
import { getAllSFGItemsByMasterBlendNo } from "../action/blendAction";

export interface TeaBoardSliceState {
  selectedBlendSheet: BlendSheet | null;
  getTeaBoardDetailResponse: ResponseState<GetTeaBoardDetail | null>;
  getTeaBoardReportDetailResponse: ResponseState<GetTeaBoardReportDetail | null>;
  selectedSalesOrder: SalesOrder | null;
  selectedProduct: ProductItem | null;
  selectedBlendItem: BlendItem | null;
  selectedBlendDetail: Blend | null;
  editBlendSheetHeaderForm: BlendSheetHeaderForm;
  saveTeaBoardResponse: ResponseState<string | undefined>;
  releaseBlendSheetResponse: ResponseState<EditBlendSheetSuccess | null>;
  // requestBlendSheetApprovalResponse: ResponseState<APISuccessMessage | undefined>
  isEdit: boolean;
  isRelease: boolean;
  isView: boolean;
  blendDetails: Blend | null;
  viewPreSignedURLResponse: ResponseState<PreSignedURL | null>;
  uplaodPresignedURL: ResponseState<PreSignedURL | null>;
  uploads: { fileKey: string }[];
  deleteAttachmentResponse: ResponseState<string | null>;
  deletedAttachments: { fileKey: string }[];
  blendBalanceDetails: ResponseState<BlendSheet[]>; //TODO API DTO
  selectedBlendBalances: BlendBalance[] | null; //TODO API DTO
  getBlendBalanceByBlendItemResponse: ResponseState<BlendBalanceItem[]>;
  getPrintBlendSheetResponse: ResponseState<GetPrintBlendSheetDetail | null>;
  blendChangeLogsResponse: ResponseState<APIGetResponse<BlendChangeLogs>>;
  selectedBlendChangeLog: number | null;
  blendChangeLogsResponseById: ResponseState<BlendChangeLogByIdResponse | null>;
  blendChangeLogsResponseByIdRequest: BlendChangeLogByIdRequest;
  changeLogTotalCount: number;
  changeLogLimit: number;
  changeLogTotalPages: number;
  changeLogCurrentPage: number;
  changeLogBlendId: number | null;
  selectableBlendSheets: string[];
  masterTotalQuantity: number;

  warehouseListResponse: ResponseState<WarehouseStock[]>;
  selectedWarehouses: SelectedWarehouseStock[];
  itemListRequest: GetItemRequest;
  itemListResponse: ResponseState<APIGetResponse<ItemDetail>>;
  initialBlendItems: BOMItem[];
  BOMDetails: BOMItemDetail | null;
  BOMItems: BOMItemDetail | null;

  otherItemsLotsListResponse: ResponseState<OtherItemLotStock[]>;
  selectedOtherItem: SelectedOtherItemLotStock[];
  otherItemsMasterListRequest: GetItemRequest;
  otherItemsMasterListResponse: ResponseState<APIGetResponse<ItemDetail>>; //sieve
  initialOtherBlendItem: OtherBlendItem[];
  OtherBOMDetails: OtherBOMItemDetail | null;
  OtherBOMItems: OtherBOMItemDetail | null;
  otherBOMItemsState: boolean;

  selectedSFGItems: BlendSFGItem[]; //SFG
  getSFGItemsResponse: ResponseState<BlendSFGItemOptions[]>;
}

const initialState: TeaBoardSliceState = {
  itemListRequest: {
    page: 1,
    limit: 100,
    type: ITEM_TYPES.TEA_LOT_ITEMS,
  },
  itemListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      data: [],
    },
  },
  selectedBlendSheet: null,
  getTeaBoardDetailResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },
  getTeaBoardReportDetailResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },
  selectedSalesOrder: null,
  selectedBlendDetail: null,
  editBlendSheetHeaderForm: initialBlendSheetHeaderForm,
  BOMItems: null,
  selectedProduct: null,
  selectedWarehouses: [],
  isEdit: false,
  isRelease: false,
  isView: true,
  saveTeaBoardResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined,
  },
  releaseBlendSheetResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },

  warehouseListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: [],
  },
  blendDetails: null,
  BOMDetails: null,

  selectedBlendItem: null,
  initialBlendItems: [],
  viewPreSignedURLResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },
  uplaodPresignedURL: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },
  uploads: [],
  deleteAttachmentResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },
  deletedAttachments: [],
  blendBalanceDetails: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: [],
  },
  selectedBlendBalances: null,
  getBlendBalanceByBlendItemResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: [],
  },
  getPrintBlendSheetResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },
  blendChangeLogsResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      currentPage: 1,
      totalCount: 0,
      totalPages: 0,
      data: [],
    },
  },
  selectedBlendChangeLog: null,
  blendChangeLogsResponseById: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null,
  },
  blendChangeLogsResponseByIdRequest: {
    previousVersionNo: 0,
    currentVersionNo: 0,
  },
  changeLogTotalCount: 0,
  changeLogLimit: 10,
  changeLogTotalPages: 1,
  changeLogCurrentPage: 0,
  changeLogBlendId: null,
  selectableBlendSheets: [],
  masterTotalQuantity: 0,

  otherItemsMasterListRequest: {
    page: 1,
    limit: 100,
    type: ITEM_TYPES.PACKING_ITEMS, //rert 3 other items
  },
  initialOtherBlendItem: [],
  otherItemsMasterListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      data: [],
    },
  },
  OtherBOMDetails: null,
  OtherBOMItems: null,
  otherItemsLotsListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: [],
  },
  selectedOtherItem: [],
  otherBOMItemsState: false,

  selectedSFGItems: [],
  getSFGItemsResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: [],
  },
};

export { initialState as initialCreateBlendSheetSliceState };

export const saveTeaBoardSlice = createSlice({
  name: "saveTeaBoard",
  initialState,
  reducers: {
    setSelectedBlendSheet: (state, action) => {
      state.selectedBlendSheet = action.payload;
    },
    setBlendSheetHeaderFormData: (
      state,
      action: PayloadAction<FormIdentifier<any>>
    ) => {
      const fieldName = action.payload
        .name as keyof typeof state.editBlendSheetHeaderForm;

      const [validatedFormField] = formFieldValidator<string>({
        ...state.editBlendSheetHeaderForm[fieldName],
        value: action.payload.value,
      });

      state.editBlendSheetHeaderForm[fieldName] = validatedFormField;
    },
    setSelectedEditWarehouses: (state, action) => {
      state.selectedWarehouses = action.payload;
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setIsView: (state, action) => {
      state.isView = action.payload;
    },
    resetSaveResponse: (state) => {
      state.saveTeaBoardResponse = initialState.saveTeaBoardResponse;
    },
    setBomItemDetails: (state, action) => {
      if (state.BOMItems?.bomItems) {
        state.BOMItems.bomItems = action.payload;
      }
    },
    setItemMasterListPage: (state, action) => {
      state.itemListRequest.page = action.payload;
    },
    setItemListSearchKey: (state, action) => {
      state.itemListRequest.search = action.payload;
    },
    setItemList: (state, action) => {
      state.itemListResponse.data.data = action.payload;
    },
    setInitialBlendItems: (state, action) => {
      state.initialBlendItems = action.payload;
    },
    resetViewPresignedURL: (state) => {
      state.viewPreSignedURLResponse = initialState.viewPreSignedURLResponse;
    },
    resetUploadPresignedUrl: (state) => {
      state.uplaodPresignedURL.data = null;
    },
    resetWarehouseListResponse: (state) => {
      state.warehouseListResponse.hasError =
        initialState.warehouseListResponse.hasError;
    },
    setUploadFileKeys: (state, action) => {
      state.uploads = action.payload;
    },
    setDeletedFileKeys: (state, action) => {
      state.deletedAttachments = action.payload;
    },
    setSelectedBlendBalances: (state, action) => {
      state.selectedBlendBalances = action.payload;
    },
    resetGetBlendBalanceByItemResponse: (state) => {
      state.getBlendBalanceByBlendItemResponse =
        initialState.getBlendBalanceByBlendItemResponse;
    },
    resetTeaBoardDetailResponse: (state) => {
      state.getTeaBoardDetailResponse = initialState.getTeaBoardDetailResponse;
      state.getTeaBoardReportDetailResponse =
        initialState.getTeaBoardReportDetailResponse;
    },
    setBlendChangeLogCurrentPage: (state, action: PayloadAction<number>) => {
      state.changeLogCurrentPage = action.payload;
    },
    setBlendChangeLogLimit: (state, action: PayloadAction<number>) => {
      state.changeLogLimit = action.payload;
    },
    setSelectedChangeLog: (state, action: PayloadAction<number>) => {
      state.selectedBlendChangeLog = action.payload;
    },
    resetBlendChangeLogsResponseById: (state) => {
      state.blendChangeLogsResponseById =
        initialState.blendChangeLogsResponseById;
    },
    setBlendChangeLogVersions: (state, action: PayloadAction<number>) => {
      state.blendChangeLogsResponseByIdRequest.currentVersionNo =
        action.payload;
      state.blendChangeLogsResponseByIdRequest.previousVersionNo =
        action.payload - 1;
    },
    setSelectedChangeLogBlendId: (state, action: PayloadAction<number>) => {
      state.changeLogBlendId = action.payload;
    },
    setSelectableBlendSheets: (state, action: PayloadAction<string[]>) => {
      state.selectableBlendSheets = action.payload;
    },

    //other items
    setSelectedOtherItemsEdit: (state, action) => {
      state.selectedOtherItem = action.payload;
    },
    resetOtherItemsLotResponse: (state) => {
      state.otherItemsLotsListResponse.hasError =
        initialState.otherItemsLotsListResponse.hasError;
    },
    setOtherItemMasterListPage: (state, action) => {
      state.otherItemsMasterListRequest.page = action.payload;
    },
    setOtherItemMasterListSearchKey: (state, action) => {
      state.otherItemsMasterListRequest.search = action.payload;
    },
    setOtherItemList: (state, action) => {
      state.otherItemsMasterListResponse.data.data = action.payload;
    },
    setOtherBomItemDetails: (state, action) => {
      if (state.OtherBOMItems?.bomItems) {
        state.OtherBOMItems.bomItems = action.payload;
      }
    },
    setInitialOtherBlendItems: (state, action) => {
      state.initialOtherBlendItem = action.payload;
    },
    setOtherBOMItemsState: (state, action: PayloadAction<boolean>) => {
      state.otherBOMItemsState = action.payload;
    },
    //sfg
    setSelectedSFGItems: (state, action) => {
      state.selectedSFGItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //get Tea Board By Detail
      .addCase(getTeaBoardByDetails.pending, (state) => {
        state.getTeaBoardDetailResponse.isLoading = true;
      })
      .addCase(
        getTeaBoardByDetails.fulfilled,
        (state, action: PayloadAction<GetTeaBoardDetail>) => {
          state.getTeaBoardDetailResponse.isLoading = false;
          state.getTeaBoardDetailResponse.isSuccess = true;
          state.getTeaBoardDetailResponse.data = action.payload;

          const selectedSalesOrder: SalesOrder = {
            salesOrderId: action.payload?.salesOrderId,
            salesOrderEntryId: action.payload.salesOrderEntryId,
            orderDate: action.payload.orderDate,
            startDate: action.payload.startDate,
            dueDate: action.payload.dueDate,
            customerCode: action.payload.customerCode,
            productItems: [
              {
                productItemCode: action.payload.productItemCode,
                salesContractQuantity: action.payload.salesContractQuantity,
              },
            ],
          };
          state.selectedSalesOrder = selectedSalesOrder;
          state.selectedProduct = selectedSalesOrder.productItems[0];
          const blendItem: BlendItem = {
            type: action.payload.blendItemType,
            code: action.payload.blendItemCode,
            description: action.payload.blendItemDescription,
            plannedQuantity: action.payload.plannedQuantity,
            quantity: action.payload.quantity,
            warehouseCode: action.payload.warehouseCode,
          };
          state.selectedBlendItem = blendItem;

          const blendDetail: Blend = {
            salesOrderId: action.payload.salesOrderId,
            productItemCode: action.payload.productItemCode,
            masterBlendSheetNo: action.payload.masterBlendSheetNo,
            totalQuantity: action.payload.totalQuantity,
            blendItems: [blendItem],
          };
          state.selectedBlendDetail = blendDetail;

          // Deduplicate blend items by item code, merging lots
          const uniqueBlendItems = action.payload.blendSheetItems.reduce(
            (acc: any[], item: any) => {
              const existingItem = acc.find((i) => i.code === item.code);
              if (existingItem) {
                // Merge lots from duplicate items
                existingItem.lots = [...existingItem.lots, ...item.lots];
              } else {
                // Add new item with its lots
                acc.push({ ...item });
              }
              return acc;
            },
            []
          );

          const bomItems: BOMItemDetail = {
            itemCode: action.payload.blendItemCode,
            bomItems: uniqueBlendItems,
          };
          state.BOMItems = bomItems;
          state.initialBlendItems = uniqueBlendItems;
          let temp: SelectedWarehouseStock[] = [];
          bomItems.bomItems?.forEach((item) => {
            item.lots.forEach((lot, lotIndex) => {
              temp.push({
                index: lotIndex + 1, // Use the lot's position in its array
                itemCode: item.code, // Convert item code to lowercase
                fromWarehouse: {
                  warehouseCode: lot.fromWarehouseCode,
                  lots: [],
                },
                isToWarehouseRequired: false,
                selectedLot: {
                  batchId: lot.batchId || "",
                  quantity: lot.quantity,
                  requiredQuantity: lot.quantity,
                  boxNo: lot.boxNo || null,
                  price: lot.price || null,
                  weightPerBag: lot.weightPerBag || null,
                },
                lotOptions: [],
                isCollapsed: false,
                error: "No Error",
                plannedQuantity: parseFloat(
                  (
                    item.basedQuantity * action.payload.plannedQuantity
                  )?.toFixed(3)
                ),
                remainingQuantity: 0,
              });
            });
          });
          state.selectedWarehouses = temp;
          state.uploads = action.payload.attachments;
          state.selectedBlendBalances =
            action.payload.blendBalance &&
            action.payload.blendBalance?.length > 0
              ? action.payload.blendBalance.map((item) => ({
                  ...item,
                  initialQuantity: item.quantity,
                  isError: "No Error",
                }))
              : null;
          state.masterTotalQuantity = action.payload.quantity;

          // other items - Deduplicate other items by item code, merging lots
          const uniqueOtherItems = (
            action.payload.otherBlendItems || []
          ).reduce((acc: any[], item: any) => {
            const existingItem = acc.find((i) => i.code === item.code);
            if (existingItem) {
              // Merge lots from duplicate items
              existingItem.lots = [...existingItem.lots, ...item.lots];
            } else {
              // Add new item with its lots
              acc.push({ ...item });
            }
            return acc;
          }, []);

          state.initialOtherBlendItem = uniqueOtherItems;
          const otherItems: OtherBOMItemDetail = {
            itemCode: action.payload.blendItemCode,
            bomItems: uniqueOtherItems,
          };
          state.OtherBOMItems = otherItems;
          let temp1: SelectedOtherItemLotStock[] = [];
          otherItems.bomItems?.forEach((item) => {
            item.lots.forEach((lot, lotIndex) => {
              temp1.push({
                index: lotIndex + 1, // Use the lot's position in its array
                itemCode: item.code, // Convert item code to lowercase
                isToWarehouseRequired: false,
                selectedLot: {
                  batchId: lot.batchId || "",
                  quantity: lot.quantity,
                  requiredQuantity: lot.quantity,
                  price: lot.price,
                  warehouseCode: lot.warehouseCode || "",
                  weightPerBag: lot.weightPerBag,
                },
                lotOptions: [],
                isCollapsed: false,
                error: "No Error",
                plannedQuantity: 0,
                remainingQuantity: 0,
              });
            });
          });
          state.selectedOtherItem = temp1;
          temp1.length > 0
            ? (state.otherBOMItemsState = true)
            : state.otherBOMItemsState;

          //SFG
          state.selectedSFGItems = action?.payload?.blendItems || [];
        }
      )
      .addCase(getTeaBoardByDetails.rejected, (state, action) => {
        state.getTeaBoardDetailResponse.isLoading = false;
        state.getTeaBoardDetailResponse.hasError = true;
        state.getTeaBoardDetailResponse.message = action.error.message;
      })

      //get tea board report details
      .addCase(getTeaBoardReportByDetails.pending, (state) => {
        state.getTeaBoardReportDetailResponse.isLoading = true;
        state.getTeaBoardReportDetailResponse.hasError = false;
        state.getTeaBoardReportDetailResponse.isSuccess = false;
      })
      .addCase(getTeaBoardReportByDetails.fulfilled, (state, action) => {
        state.getTeaBoardReportDetailResponse.isLoading = false;
        state.getTeaBoardReportDetailResponse.isSuccess = true;
        state.getTeaBoardReportDetailResponse.data = action.payload;
      })
      .addCase(getTeaBoardReportByDetails.rejected, (state, action) => {
        state.getTeaBoardReportDetailResponse.isLoading = false;
        state.getTeaBoardReportDetailResponse.hasError = true;
        state.getTeaBoardReportDetailResponse.message = action.error.message;
      })

      //get warehouse details
      .addCase(getWarehousesByItemCodes.pending, (state) => {
        state.warehouseListResponse.isLoading = true;
      })
      .addCase(getWarehousesByItemCodes.fulfilled, (state, action) => {
        state.warehouseListResponse.isLoading = false;
        state.warehouseListResponse.isSuccess = true;
        state.warehouseListResponse.data = action.payload || [];
      })
      .addCase(getWarehousesByItemCodes.rejected, (state, action) => {
        state.warehouseListResponse.isLoading = false;
        state.warehouseListResponse.hasError = true;
        state.warehouseListResponse.message = action.error.message;
      })

      //get other items lots details by item code
      .addCase(getOtherItemLotsByItemCodes.pending, (state) => {
        state.otherItemsLotsListResponse.isLoading = true;
      })
      .addCase(getOtherItemLotsByItemCodes.fulfilled, (state, action) => {
        state.otherItemsLotsListResponse.isLoading = false;
        state.otherItemsLotsListResponse.isSuccess = true;
        state.otherItemsLotsListResponse.data = action.payload || [];
      })
      .addCase(getOtherItemLotsByItemCodes.rejected, (state, action) => {
        state.otherItemsLotsListResponse.isLoading = false;
        state.otherItemsLotsListResponse.hasError = true;
        state.otherItemsLotsListResponse.message = action.error.message;
      })

      //save Tea Board
      .addCase(saveTeaBoard.pending, (state) => {
        state.saveTeaBoardResponse.isLoading = true;
      })
      .addCase(saveTeaBoard.fulfilled, (state, action) => {
        state.saveTeaBoardResponse.isLoading = false;
        state.saveTeaBoardResponse.isSuccess = true;
        state.saveTeaBoardResponse.data = action.payload?.message;
      })
      .addCase(saveTeaBoard.rejected, (state, action) => {
        state.saveTeaBoardResponse.isLoading = false;
        state.saveTeaBoardResponse.hasError = true;
        state.saveTeaBoardResponse.message = action.error.message;
      })

      // release blend sheet
      .addCase(releaseBlendSheet.pending, (state) => {
        state.releaseBlendSheetResponse.isLoading = true;
      })
      .addCase(releaseBlendSheet.fulfilled, (state, action) => {
        state.releaseBlendSheetResponse.isLoading = false;
        state.releaseBlendSheetResponse.isSuccess = true;
        state.releaseBlendSheetResponse.data = action.payload;
      })
      .addCase(releaseBlendSheet.rejected, (state, action) => {
        state.releaseBlendSheetResponse.isLoading = false;
        state.releaseBlendSheetResponse.hasError = true;
        state.releaseBlendSheetResponse.message = action.error.message;
      })

      //get item master list
      .addCase(getItemMasterList.pending, (state) => {
        state.itemListResponse.isLoading = true;
      })
      .addCase(getItemMasterList.fulfilled, (state, action) => {
        state.itemListResponse.isLoading = false;
        state.itemListResponse.isSuccess = true;
        state.itemListResponse.data.currentPage = action.payload.currentPage;
        state.itemListResponse.data.totalCount = action.payload.totalCount;
        state.itemListResponse.data.totalPages = action.payload.totalPages;
        const existingItems = new Set(
          state.BOMItems?.bomItems?.map((item) => item.code)
        );
        if (
          state.itemListRequest.search !== "" &&
          state.itemListRequest.search !== undefined
        ) {
          state.itemListResponse.data.data = action.payload.data.filter(
            (item) => !existingItems.has(item.itemCode)
          );
        } else {
          state.itemListResponse.data.data = state.itemListResponse.data.data
            .concat(action.payload.data)
            .filter((item) => !existingItems.has(item.itemCode));
        }
      })
      .addCase(getItemMasterList.rejected, (state, action) => {
        state.itemListResponse.isLoading = false;
        state.itemListResponse.hasError = true;
        state.itemListResponse.message = action.error.message;
      })

      //get other item master list
      .addCase(getOtherItemMasterList.pending, (state) => {
        state.otherItemsMasterListResponse.isLoading = true;
      })
      .addCase(getOtherItemMasterList.fulfilled, (state, action) => {
        state.otherItemsMasterListResponse.isLoading = false;
        state.otherItemsMasterListResponse.isSuccess = true;
        state.otherItemsMasterListResponse.data.currentPage =
          action.payload.currentPage;
        state.otherItemsMasterListResponse.data.totalCount =
          action.payload.totalCount;
        state.otherItemsMasterListResponse.data.totalPages =
          action.payload.totalPages;
        const existingItems = new Set(
          state.OtherBOMItems?.bomItems?.map((item) => item.code)
        );
        if (
          state.otherItemsMasterListRequest.search !== "" &&
          state.otherItemsMasterListRequest.search !== undefined
        ) {
          state.otherItemsMasterListResponse.data.data =
            action.payload.data.filter(
              (item) => !existingItems.has(item.itemCode)
            );
        } else {
          state.otherItemsMasterListResponse.data.data =
            state.otherItemsMasterListResponse.data.data
              .concat(action.payload.data)
              .filter((item) => !existingItems.has(item.itemCode));
        }
      })
      .addCase(getOtherItemMasterList.rejected, (state, action) => {
        state.otherItemsMasterListResponse.isLoading = false;
        state.otherItemsMasterListResponse.hasError = true;
        state.otherItemsMasterListResponse.message = action.error.message;
      })

      //get view pre signed url
      .addCase(getViewPresignedURL.pending, (state) => {
        state.viewPreSignedURLResponse.isLoading = true;
      })
      .addCase(getViewPresignedURL.fulfilled, (state, action) => {
        state.viewPreSignedURLResponse.isLoading = false;
        state.viewPreSignedURLResponse.isSuccess = true;
        state.viewPreSignedURLResponse.data = action.payload.data;
      })
      .addCase(getViewPresignedURL.rejected, (state, action) => {
        state.viewPreSignedURLResponse.isLoading = false;
        state.viewPreSignedURLResponse.hasError = true;
        state.viewPreSignedURLResponse.message = action.error.message;
      })

      //get upload pre signed url
      .addCase(getUploadPresignedURL.pending, (state) => {
        state.uplaodPresignedURL.isLoading = true;
      })
      .addCase(getUploadPresignedURL.fulfilled, (state, action) => {
        state.uplaodPresignedURL.isLoading = false;
        state.uplaodPresignedURL.isSuccess = true;
        state.uplaodPresignedURL.data = action.payload.data;
      })
      .addCase(getUploadPresignedURL.rejected, (state, action) => {
        state.uplaodPresignedURL.isLoading = false;
        state.uplaodPresignedURL.hasError = true;
        state.uplaodPresignedURL.message = action.error.message;
      })

      //get delete pre signed url
      .addCase(deleteAttachment.pending, (state) => {
        state.deleteAttachmentResponse.isLoading = true;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.deleteAttachmentResponse.isLoading = false;
        state.deleteAttachmentResponse.isSuccess = true;
        state.deleteAttachmentResponse.data = action.payload.message;
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.deleteAttachmentResponse.isLoading = false;
        state.deleteAttachmentResponse.hasError = true;
        state.deleteAttachmentResponse.message = action.error.message;
      })

      //get blend sheet balances
      .addCase(getBlendBalanceByBlendItem.pending, (state) => {
        state.getBlendBalanceByBlendItemResponse.isLoading = true;
      })
      .addCase(getBlendBalanceByBlendItem.fulfilled, (state, action) => {
        state.getBlendBalanceByBlendItemResponse.isLoading = false;
        state.getBlendBalanceByBlendItemResponse.isSuccess = true;
        state.getBlendBalanceByBlendItemResponse.data = action.payload || [];
      })
      .addCase(getBlendBalanceByBlendItem.rejected, (state, action) => {
        state.getBlendBalanceByBlendItemResponse.isLoading = false;
        state.getBlendBalanceByBlendItemResponse.hasError = true;
        state.getBlendBalanceByBlendItemResponse.message = action.error.message;
      })

      //get all blend sheet changelog list
      .addCase(getAllBlendChangeLogs.pending, (state) => {
        state.blendChangeLogsResponse.isLoading = true;
      })
      .addCase(getAllBlendChangeLogs.fulfilled, (state, action) => {
        state.blendChangeLogsResponse.isLoading = false;
        state.blendChangeLogsResponse.isSuccess = true;
        if (action.payload) {
          state.blendChangeLogsResponse.data.data = action.payload.data;
          state.blendChangeLogsResponse.data.currentPage =
            action.payload.currentPage;
          state.blendChangeLogsResponse.data.totalCount =
            action.payload.totalCount;
          state.blendChangeLogsResponse.data.totalPages =
            action.payload.totalPages;

          state.changeLogTotalPages = action.payload.totalPages;
          state.changeLogTotalCount = action.payload.totalCount;
        }
      })
      .addCase(getAllBlendChangeLogs.rejected, (state, action) => {
        state.blendChangeLogsResponse.isLoading = false;
        state.blendChangeLogsResponse.hasError = true;
        state.blendChangeLogsResponse.message = action.error.message;
      })

      //get blend sheet changelog by id
      .addCase(getBlendChangeLogById.pending, (state) => {
        state.blendChangeLogsResponseById.isLoading = true;
      })
      .addCase(getBlendChangeLogById.fulfilled, (state, action) => {
        state.blendChangeLogsResponseById.isLoading = false;
        state.blendChangeLogsResponseById.isSuccess = true;
        state.blendChangeLogsResponseById.data = action.payload;
      })
      .addCase(getBlendChangeLogById.rejected, (state, action) => {
        state.blendChangeLogsResponseById.isLoading = false;
        state.blendChangeLogsResponseById.hasError = true;
        state.blendChangeLogsResponseById.message = action.error.message;
      })

      //get SFG Items List by masterBlendSheetNo
      .addCase(getAllSFGItemsByMasterBlendNo.pending, (state) => {
        state.getSFGItemsResponse.isLoading = true;
      })
      .addCase(getAllSFGItemsByMasterBlendNo.fulfilled, (state, action) => {
        state.getSFGItemsResponse.isLoading = false;
        state.getSFGItemsResponse.isSuccess = true;
        state.getSFGItemsResponse.data = action.payload;
      })
      .addCase(getAllSFGItemsByMasterBlendNo.rejected, (state, action) => {
        state.getSFGItemsResponse.isLoading = false;
        state.getSFGItemsResponse.hasError = true;
        state.getSFGItemsResponse.message = action.error.message;
      });
  },
});

export const {
  setSelectedBlendSheet,
  setSelectedEditWarehouses,
  setIsEdit,
  setIsView,
  setBlendSheetHeaderFormData,
  resetSaveResponse,
  setBomItemDetails,
  setItemMasterListPage,
  setItemListSearchKey,
  setItemList,
  setInitialBlendItems,
  resetViewPresignedURL,
  setUploadFileKeys,
  resetUploadPresignedUrl,
  resetWarehouseListResponse,
  setDeletedFileKeys,
  setSelectedBlendBalances,
  resetGetBlendBalanceByItemResponse,
  resetTeaBoardDetailResponse,
  setBlendChangeLogCurrentPage,
  setBlendChangeLogLimit,
  setSelectedChangeLog,
  resetBlendChangeLogsResponseById,
  setBlendChangeLogVersions,
  setSelectedChangeLogBlendId,
  setSelectableBlendSheets,

  setSelectedOtherItemsEdit,
  resetOtherItemsLotResponse,
  setOtherItemMasterListPage,
  setOtherItemMasterListSearchKey,
  setOtherItemList,
  setOtherBomItemDetails,
  setInitialOtherBlendItems,
  setOtherBOMItemsState,

  setSelectedSFGItems,
} = saveTeaBoardSlice.actions;

export default saveTeaBoardSlice.reducer;
