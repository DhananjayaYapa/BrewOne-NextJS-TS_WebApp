import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, Blend, BlendItem, BlendSheetHeaderForm, BOMItem, BOMItemDetail, FormIdentifier, OtherBlendItem, OtherBOMItemDetail, OtherItemLotStock, PaginationRequest, PreSignedURL, ResponseState, SalesOrder, SelectedOtherItemLotStock, UploadAttachment, Warehouse, WarehouseStock } from "@/interfaces";
import { createBlendSheet, deleteAttachment, getBlendBalanceByBlendItem, getBlendDetailBySalesOrderId, getBlendSheetBalances, getBlendSheetByDetail, getBOMDetailsByBlendItem, getItemMasterList, getOtherItemMasterList, getSalesOrderList, getToWarehousesList, getUploadPresignedURL, getWarehousesByItemCodes } from "../action/createBlendSheetAction";
import { FORM_VALIDATOR_TYPES } from "@/utill/common/formValidator/const";
import { formFieldValidator } from "@/utill/common/formValidator/main";
import { ProductItem, SelectedWarehouseStock, BlendWarehouse } from "@/interfaces/salesOrder";
import { BlendBalance, BlendBalanceItem, BlendSheet, BlendSheetTemplate, CreateBlendSheetSuccess, GetBlendSheetDetail } from "@/interfaces";
import { create } from "lodash";
import { GetItemRequest } from "@/interfaces/item";
import { ITEM_TYPES } from "@/constant";
import { ItemDetail } from "@/interfaces/teaLotById";
import { getOtherItemLotsByItemCodes } from "../action/editBlendSheetAction";

export interface CreateBlendSheetSliceState {
  duplicatedBlendSheet: BlendSheet | null;
  duplicatedTemplate: BlendSheetTemplate | null
  blendDetails: Blend | null;
  BOMDetails: BOMItemDetail | null;
  selectedSalesOrder: SalesOrder | null;
  selectedProduct: ProductItem | null;
  selectedBlendItem: BlendItem | null;
  salesOrderListResponse: ResponseState<APIGetResponse<SalesOrder>>
  salesOrderListRequest: PaginationRequest
  blendDetailResponse: ResponseState<Blend | null>
  BOMItemsResponse: ResponseState<BOMItemDetail | null>
  warehouseListResponse: ResponseState<WarehouseStock[]>
  toWarehouseListResponse: ResponseState<BlendWarehouse[]>
  createBlendSheetResponse: ResponseState<string | undefined>
  createBlendSheetHeaderForm: BlendSheetHeaderForm
  selectedWarehouses: SelectedWarehouseStock[]
  itemListRequest: GetItemRequest
  itemListResponse: ResponseState<APIGetResponse<ItemDetail>>
  initialBlendItems: BOMItem[]
  uplaodPresignedURL: ResponseState<PreSignedURL | null>
  uploads: { fileKey: string }[]
  deleteAttachmentResponse: ResponseState<string | null>
  blendBalanceDetails: ResponseState<BlendSheet[]>//TODO API DTO
  selectedBlendBalances: BlendBalance[] | null//TODO API DTO
  getBlendSheetDetailResponse: ResponseState<GetBlendSheetDetail | null>
  getBlendBalanceByBlendItemResponse: ResponseState<BlendBalanceItem[]> //TODO API DTO
  selectableCreateBlendSheets: string[]
  blendSheetAlreadyCreatedError: string | null

  otherItemsLotsListResponse: ResponseState<OtherItemLotStock[]>
  selectedOtherItem: SelectedOtherItemLotStock[]
  otherItemsMasterListRequest: GetItemRequest
  otherItemsMasterListResponse: ResponseState<APIGetResponse<ItemDetail>> //sieve
  initialOtherBlendItem: OtherBlendItem[];
  OtherBOMDetails: OtherBOMItemDetail | null
  OtherBOMItems: OtherBOMItemDetail | null
  otherBOMItemsState: boolean
}

export const initialBlendSheetHeaderForm: BlendSheetHeaderForm = {
  salesOrderId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
  },
  productItemCode: {
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
  },
  blendItemCode: {
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
  },
  orderDate: {
    value: null,
    type: FORM_VALIDATOR_TYPES.DATE,
    isRequired: true,
    disable: false,
    errorMessages: {
      required: "Select order date",
    },
  },
  startDate: {
    value: null,
    type: FORM_VALIDATOR_TYPES.DATE,
    isRequired: true,
    disable: false,
    errorMessages: {
      required: "Select start date",
    },
  },
  dueDate: {
    value: null,
    type: FORM_VALIDATOR_TYPES.DATE,
    isRequired: true,
    disable: false,
    errorMessages: {
      required: "Select due date",
    },
  },
  customerCode: {
    value: "",
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    validators: {
      maxLength: 255,
    },
    errorMessages: {
      maxLength: 'Character length should be less than 25',

    },
  },
  plannedQuantity: {
    value: 0,
    type: FORM_VALIDATOR_TYPES.NUMBER,
    isRequired: true,
    disable: false,
    errorMessages: {
      required: "Enter planned quantity",
    },
  },
  actualPlannedQuantity: {
    value: 0,
    type: FORM_VALIDATOR_TYPES.NUMBER,
    isRequired: true,
    disable: false,
    errorMessages: {
      required: "Enter planned quantity",
    },
  },
  warehouse: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    errorMessages: {
      required: "Please select a warehouse",
    },
  },
  remarks: {
    value: '',
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
  },
};


const initialState: CreateBlendSheetSliceState = {
  duplicatedBlendSheet: null,
  duplicatedTemplate: null,
  itemListRequest: {
    page: 1,
    limit: 100,
    type: ITEM_TYPES.TEA_LOT_ITEMS
  },
  itemListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      data: []
    }
  },
  salesOrderListRequest: {
    page: 1,
    limit: 20, //this is a fixed limit from SAP check API docs
  },
  salesOrderListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      currentPage: 1,
      totalCount: 0,
      totalPages: 0,
      data: []
    }
  },
  blendDetailResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null
  },
  BOMItemsResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null
  },
  warehouseListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
  toWarehouseListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
  blendDetails: null,
  BOMDetails: null,
  selectedSalesOrder: null,
  selectedProduct: null,
  createBlendSheetHeaderForm: initialBlendSheetHeaderForm,
  selectedWarehouses: [],
  createBlendSheetResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
  selectedBlendItem: null,
  initialBlendItems: [],
  uplaodPresignedURL: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null
  },
  uploads: [],
  deleteAttachmentResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null
  },
  blendBalanceDetails: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
  selectedBlendBalances: null,
  getBlendSheetDetailResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null
  },
  getBlendBalanceByBlendItemResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
  selectableCreateBlendSheets: [],
  blendSheetAlreadyCreatedError: null,

  //other
  otherItemsMasterListRequest: {
    page: 1,
    limit: 100,
    type: ITEM_TYPES.PACKING_ITEMS //TODO: REVERT to 3
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
      data: []
    }
  },
  OtherBOMDetails: null,
  OtherBOMItems: null,
  otherItemsLotsListResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
  selectedOtherItem: [],
  otherBOMItemsState: false,
};

export { initialState as initialCreateBlendSheetSliceState };

export const createBlendSheetSlice = createSlice({
  name: "createBlendSheet",
  initialState,
  reducers: {
    setDuplicatedBlendSheet: (state, action) => {
      state.duplicatedBlendSheet = action.payload;
    },
    setDuplicatedTemplate: (state, action) => {
      state.duplicatedTemplate = action.payload;
    },
    setSalesOrderPage: (state, action) => {
      state.salesOrderListRequest.page = action.payload;
    },
    setSalesOrderSearchKey: (state, action) => {
      state.salesOrderListRequest.search = action.payload;
    },
    setSelectedSalesOrder: (state, action: PayloadAction<SalesOrder | null>) => {
      state.selectedSalesOrder = action.payload;
      state.blendSheetAlreadyCreatedError = null;
    },
    setSelectedProduct: (state, action: PayloadAction<ProductItem | null>) => {
      state.selectedProduct = action.payload;
      state.blendSheetAlreadyCreatedError = null;
    },
    setSelectedBlendItemCode: (state, action: PayloadAction<BlendItem | null>) => {
      state.selectedBlendItem = action.payload;
    },
    setSelectedWarehouses: (state, action) => {
      state.selectedWarehouses = action.payload;
    },
    setBomItemDetails: (state, action) => {
      if (state.BOMItemsResponse.data) {
        state.BOMItemsResponse.data.bomItems = action.payload
      }
    },
    setBlendSheetHeaderFormData: (state, action: PayloadAction<FormIdentifier<any>>) => {

      const fieldName = action.payload.name as keyof typeof state.createBlendSheetHeaderForm;

      const [validatedFormField] = formFieldValidator<string>({
        ...state.createBlendSheetHeaderForm[fieldName],
        value: action.payload.value
      });

      state.createBlendSheetHeaderForm[fieldName] = validatedFormField;

    },
    resetCreateBlendSheet: (state) => {
      state.BOMItemsResponse = initialState.BOMItemsResponse
      state.selectedWarehouses = []
    },
    resetCreateBlendResponse: (state) => {

      state.createBlendSheetResponse = initialState.createBlendSheetResponse
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
      state.initialBlendItems = action.payload
    },
    resetUploadPresignedUrl: (state) => {
      state.uplaodPresignedURL.data = null
    },
    setUploadFileKeys: (state, action) => {
      state.uploads = action.payload
    },
    setSelectedBlendBalances: (state, action) => {
      state.selectedBlendBalances = action.payload
    },
    setSelectableCreateBlendSheets: (state, action: PayloadAction<string[]>) => {
      state.selectableCreateBlendSheets = action.payload
    },
    setBlendSheetAlreadyCreatedError: (state, action: PayloadAction<string | null>) => {
      state.blendSheetAlreadyCreatedError = action.payload
    },
    //other items
    setSelectedOtherItemsEdit: (state, action) => {
      state.selectedOtherItem = action.payload;
    },
    resetOtherItemsLotResponse: (state) => {
      state.otherItemsLotsListResponse.hasError = initialState.otherItemsLotsListResponse.hasError
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
        state.OtherBOMItems.bomItems = action.payload
      }
    },
    setInitialOtherBlendItems: (state, action) => {
      state.initialOtherBlendItem = action.payload
    },
    setOtherBOMItemsState: (state, action: PayloadAction<boolean>) => {
      state.otherBOMItemsState = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      //get sales order list
      .addCase(getSalesOrderList.pending, (state) => {
        state.salesOrderListResponse.isLoading = true;
      })
      .addCase(getSalesOrderList.fulfilled, (state, action) => {
        state.salesOrderListResponse.isLoading = false;
        state.salesOrderListResponse.isSuccess = true;
        // state.salesOrderListResponse.data.data = state.salesOrderListResponse.data.data.concat(action.payload.data);
        state.salesOrderListResponse.data.currentPage = action.payload.currentPage;
        state.salesOrderListResponse.data.totalCount = action.payload.totalCount;
        state.salesOrderListResponse.data.totalPages = action.payload.totalPages;

        if (state.salesOrderListRequest.search !== "" && state.salesOrderListRequest.search !== undefined) {
          state.salesOrderListResponse.data.data = action.payload.data;
        } else {
          state.salesOrderListResponse.data.data = state.salesOrderListResponse.data.data.concat(action.payload.data);
        }
      })
      .addCase(getSalesOrderList.rejected, (state, action) => {
        state.salesOrderListResponse.isLoading = false;
        state.salesOrderListResponse.hasError = true;
        state.salesOrderListResponse.message = action.error.message;
      })

      //get blend details by sales order Id
      .addCase(getBlendDetailBySalesOrderId.pending, (state) => {
        state.blendDetailResponse.isLoading = true;
      })
      .addCase(getBlendDetailBySalesOrderId.fulfilled, (state, action) => {
        state.blendDetailResponse.isLoading = false;
        state.blendDetailResponse.isSuccess = true;
        state.blendDetailResponse.data = action.payload || null;

        if (action.payload) {
          const otherItems: OtherBOMItemDetail = {
            itemCode: action.payload.productItemCode,
            bomItems: []
          }
          state.OtherBOMItems = otherItems
        }

      })
      .addCase(getBlendDetailBySalesOrderId.rejected, (state, action) => {
        state.blendDetailResponse.isLoading = false;
        state.blendDetailResponse.hasError = true;
        state.blendDetailResponse.message = action.error.message;
      })

      //get BOM item details by product/blend item number
      .addCase(getBOMDetailsByBlendItem.pending, (state) => {
        state.BOMItemsResponse.isLoading = true;
      })
      .addCase(getBOMDetailsByBlendItem.fulfilled, (state, action) => {
        state.BOMItemsResponse.isLoading = false;
        state.BOMItemsResponse.isSuccess = true;
        state.BOMItemsResponse.data = action.payload;
        if (action.payload)
          state.initialBlendItems = action.payload.bomItems
      })
      .addCase(getBOMDetailsByBlendItem.rejected, (state, action) => {
        state.BOMItemsResponse.isLoading = false;
        state.BOMItemsResponse.hasError = true;
        state.BOMItemsResponse.message = action.error.message;
      })

      //get warehouse details
      .addCase(getWarehousesByItemCodes.pending, (state) => {
        state.warehouseListResponse.isLoading = true;
      })
      .addCase(getWarehousesByItemCodes.fulfilled, (state, action) => {
        state.warehouseListResponse.isLoading = false;
        state.warehouseListResponse.isSuccess = true;
        state.warehouseListResponse.data = action.payload;
      })
      .addCase(getWarehousesByItemCodes.rejected, (state, action) => {
        state.warehouseListResponse.isLoading = false;
        state.warehouseListResponse.hasError = true;
        state.warehouseListResponse.message = action.error.message;
      })

      //create blend sheet
      .addCase(createBlendSheet.pending, (state) => {
        state.createBlendSheetResponse.isLoading = true;
      })
      .addCase(createBlendSheet.fulfilled, (state, action) => {
        state.createBlendSheetResponse.isLoading = false;
        state.createBlendSheetResponse.isSuccess = true;
        state.createBlendSheetResponse.data = action.payload?.message;
      })
      .addCase(createBlendSheet.rejected, (state, action) => {
        state.createBlendSheetResponse.isLoading = false;
        state.createBlendSheetResponse.hasError = true;
        state.createBlendSheetResponse.message = action.error.message;
      })

      //get to warehouse list
      .addCase(getToWarehousesList.pending, (state) => {
        state.toWarehouseListResponse.isLoading = true;
      })
      .addCase(getToWarehousesList.fulfilled, (state, action) => {
        state.toWarehouseListResponse.isLoading = false;
        state.toWarehouseListResponse.isSuccess = true;
        const temp: Warehouse[] = action.payload;
        const blendWarehouses: BlendWarehouse[] = temp?.map((warehouse) => ({
          warehouseCode: warehouse.warehouseCode,
          lots: []
        }));
        state.toWarehouseListResponse.data = blendWarehouses

      })
      .addCase(getToWarehousesList.rejected, (state, action) => {
        state.toWarehouseListResponse.isLoading = false;
        state.toWarehouseListResponse.hasError = true;
        state.toWarehouseListResponse.message = action.error.message;
      })

      //get item master list
      .addCase(getItemMasterList.pending, (state) => {
        state.itemListResponse.isLoading = true;
      })
      .addCase(getItemMasterList.fulfilled, (state, action) => {
        state.itemListResponse.isLoading = false;
        state.itemListResponse.isSuccess = true;
        // state.salesOrderListResponse.data.data = state.salesOrderListResponse.data.data.concat(action.payload.data);
        state.itemListResponse.data.currentPage = action.payload.currentPage;
        state.itemListResponse.data.totalCount = action.payload.totalCount;
        state.itemListResponse.data.totalPages = action.payload.totalPages;

        if (state.itemListRequest.search !== "" && state.itemListRequest.search !== undefined) {
          state.itemListResponse.data.data = action.payload.data;
        } else {
          state.itemListResponse.data.data = state.itemListResponse.data.data.concat(action.payload.data);
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
        state.otherItemsMasterListResponse.data.currentPage = action.payload.currentPage;
        state.otherItemsMasterListResponse.data.totalCount = action.payload.totalCount;
        state.otherItemsMasterListResponse.data.totalPages = action.payload.totalPages;
        const existingItems = new Set(state.OtherBOMItems?.bomItems?.map((item) => item.code))
        if (state.otherItemsMasterListRequest.search !== "" && state.otherItemsMasterListRequest.search !== undefined) {
          state.otherItemsMasterListResponse.data.data = action.payload.data.filter((item) => !existingItems.has(item.itemCode));
        } else {
          state.otherItemsMasterListResponse.data.data = state.otherItemsMasterListResponse.data.data
            .concat(action.payload.data).filter((item) => !existingItems.has(item.itemCode));
        }
      })
      .addCase(getOtherItemMasterList.rejected, (state, action) => {
        state.otherItemsMasterListResponse.isLoading = false;
        state.otherItemsMasterListResponse.hasError = true;
        state.otherItemsMasterListResponse.message = action.error.message;
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

      //get upload pre signed url
      .addCase(getUploadPresignedURL.pending, (state) => {
        state.uplaodPresignedURL.isLoading = true;
      })
      .addCase(getUploadPresignedURL.fulfilled, (state, action) => {
        state.uplaodPresignedURL.isLoading = false;
        state.uplaodPresignedURL.isSuccess = true;
        state.uplaodPresignedURL.data = action.payload.data

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
        state.deleteAttachmentResponse.data = action.payload.message

      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.deleteAttachmentResponse.isLoading = false;
        state.deleteAttachmentResponse.hasError = true;
        state.deleteAttachmentResponse.message = action.error.message;
      })

      //get blend sheet balances
      .addCase(getBlendSheetBalances.pending, (state) => {
        state.blendBalanceDetails.isLoading = true;
      })
      .addCase(getBlendSheetBalances.fulfilled, (state, action) => {
        state.blendBalanceDetails.isLoading = false;
        state.blendBalanceDetails.isSuccess = true;
        state.blendBalanceDetails.data = action.payload.data

      })
      .addCase(getBlendSheetBalances.rejected, (state, action) => {
        state.blendBalanceDetails.isLoading = false;
        state.blendBalanceDetails.hasError = true;
        state.blendBalanceDetails.message = action.error.message;
      })

      //get Blend Sheet By Detail
      .addCase(getBlendSheetByDetail.pending, (state) => {
        state.getBlendSheetDetailResponse.isLoading = true;
      })
      .addCase(getBlendSheetByDetail.fulfilled, (state, action: PayloadAction<GetBlendSheetDetail>) => {
        state.getBlendSheetDetailResponse.isLoading = false;
        state.getBlendSheetDetailResponse.isSuccess = true;
        state.getBlendSheetDetailResponse.data = action.payload;

        const selectedSalesOrder: SalesOrder = {
          salesOrderId: action.payload?.salesOrderId,
          salesOrderEntryId: action.payload.salesOrderEntryId,
          orderDate: action.payload.orderDate,
          startDate: action.payload.startDate,
          dueDate: action.payload.dueDate,
          customerCode: action.payload.customerCode,
          productItems: [{
            productItemCode: action.payload.productItemCode,
            salesContractQuantity: action.payload.salesContractQuantity
          }]
        }
        state.selectedSalesOrder = selectedSalesOrder
        state.selectedProduct = selectedSalesOrder.productItems[0]
        const blendItem: BlendItem = {
          type: action.payload.blendItemType,
          code: action.payload.blendItemCode,
          description: action.payload.blendItemDescription,
          plannedQuantity: action.payload.totalQuantity - (state.duplicatedTemplate?.blendSheets?.reduce((accumulator, currentVal) => accumulator + currentVal.plannedQuantity, 0) || 0),
          quantity: action.payload.quantity,
          warehouseCode: action.payload.warehouseCode
        }
        state.selectedBlendItem = blendItem

        const blendDetail: Blend = {
          salesOrderId: action.payload.salesOrderId,
          productItemCode: action.payload.productItemCode,
          masterBlendSheetNo: action.payload.masterBlendSheetNo,
          totalQuantity: action.payload.totalQuantity,
          blendItems: [blendItem]
        }
        state.blendDetailResponse.data = blendDetail
        state.blendDetails = blendDetail

        const bomItems: BOMItemDetail = {
          itemCode: action.payload.blendItemCode,
          bomItems: action.payload.blendSheetItems
        }
        state.BOMDetails = bomItems
        state.BOMItemsResponse.data = bomItems
        state.initialBlendItems = action.payload.blendSheetItems
        let temp: SelectedWarehouseStock[] = []
        bomItems.bomItems?.forEach((item) => {
          const totalQty = item.lots.reduce((sum, item) => sum + (item.quantity), 0)
          console.log(blendItem.plannedQuantity, 'whyy', totalQty)
          item.lots.forEach((lot, lotIndex) => {
            temp.push({
              index: lotIndex + 1, // Use the lot's position in its array
              itemCode: item.code, // Convert item code to lowercase
              fromWarehouse: {
                warehouseCode: lot.fromWarehouseCode, lots:
                  state.warehouseListResponse.data
                    .find(i => i.itemCode === item.code)
                    ?.warehouses.find(w => w.warehouseCode === lot.fromWarehouseCode)
                    ?.lots || []
              },
              isToWarehouseRequired: false,
              selectedLot: {
                batchId: lot.batchId || "",
                quantity: lot.quantity,
                requiredQuantity: lot.quantity,
                boxNo: lot.boxNo || null
              },
              lotOptions: state.warehouseListResponse.data
                .find(i => i.itemCode === item.code)
                ?.warehouses.find(w => w.warehouseCode === lot.fromWarehouseCode)
                ?.lots || [],
              isCollapsed: false,
              error: blendItem.plannedQuantity > totalQty ? 'Minimum is planned quantity' : 'No Error',
              plannedQuantity: parseFloat((item.basedQuantity * action.payload.plannedQuantity)?.toFixed(3)),
              remainingQuantity: 0
            });
          });
        });
        state.selectedWarehouses = temp
        state.uploads = action.payload.attachments
      })
      .addCase(getBlendSheetByDetail.rejected, (state, action) => {
        state.getBlendSheetDetailResponse.isLoading = false;
        state.getBlendSheetDetailResponse.hasError = true;
        state.getBlendSheetDetailResponse.message = action.error.message;
      })


      //get blend sheet balances
      .addCase(getBlendBalanceByBlendItem.pending, (state) => {
        state.getBlendBalanceByBlendItemResponse.isLoading = true;
      })
      .addCase(getBlendBalanceByBlendItem.fulfilled, (state, action) => {
        state.getBlendBalanceByBlendItemResponse.isLoading = false;
        state.getBlendBalanceByBlendItemResponse.isSuccess = true;
        state.getBlendBalanceByBlendItemResponse.data = action.payload || []

      })
      .addCase(getBlendBalanceByBlendItem.rejected, (state, action) => {
        state.getBlendBalanceByBlendItemResponse.isLoading = false;
        state.getBlendBalanceByBlendItemResponse.hasError = true;
        state.getBlendBalanceByBlendItemResponse.message = action.error.message;
      })
  },
});

export const {
  setSalesOrderPage,
  setSelectedSalesOrder,
  setBlendSheetHeaderFormData,
  setSelectedProduct,
  setSelectedWarehouses,
  resetCreateBlendSheet,
  setSelectedBlendItemCode,
  setSalesOrderSearchKey,
  resetCreateBlendResponse,
  setBomItemDetails,
  setItemMasterListPage,
  setItemListSearchKey,
  setItemList,
  setInitialBlendItems,
  resetUploadPresignedUrl,
  setUploadFileKeys,
  setSelectedBlendBalances,
  setDuplicatedBlendSheet,
  setDuplicatedTemplate,
  setSelectableCreateBlendSheets,
  setBlendSheetAlreadyCreatedError,

  setSelectedOtherItemsEdit,
  resetOtherItemsLotResponse,
  setOtherItemMasterListPage,
  setOtherItemMasterListSearchKey,
  setOtherItemList,
  setOtherBomItemDetails,
  setInitialOtherBlendItems,
  setOtherBOMItemsState,
} = createBlendSheetSlice.actions;

export default createBlendSheetSlice.reducer;