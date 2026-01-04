import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, APISuccessMessage, Blend, BlendItem, BlendSheetHeaderForm, BOMItemDetail, FormIdentifier, GetTeaLotDetailsRequest, PaginationRequest, ProductItem, ResponseState, SalesOrder, SelectedWarehouseStock, TeaLot } from "@/interfaces";
import { BlendBalance, BlendBalanceItem, BlendSheet, BlendSheetStatus, BlendSheetTemplate, GetAllBlendSheetsRequest, GetBlendSheetDetail } from "@/interfaces";
import { approveBlendSheet, getAllBlendSheets, getBlendBalanceByBlendItem, getBlendSheetByDetail, getBlendSheetStatus, getSalesOrderList, rejectBlendSheet } from "../action/blendSheetApprovalsAction";
import { TeaLotById } from "@/interfaces/teaLotById";
import { FORM_VALIDATOR_TYPES, formFieldValidator } from "@/utill/common/formValidator/main";
import { APPROVAL_STATUS } from "@/constant";


export interface BlendSheetApprovalsSliceState {
  blendSheetListResponse: ResponseState<APIGetResponse<BlendSheetTemplate>>
  blendSheetListRequest: GetAllBlendSheetsRequest
  selectedBlendSheet: BlendSheet | null
  selectedLot: TeaLot | null
  selectedLotDetail: ResponseState<TeaLotById | undefined>
  teaLotDetailRequest: GetTeaLotDetailsRequest
  teaLotDetailResponse: TeaLotById | null
  rejectReason: string | null
  rejectBlendSheetResponse: ResponseState<APISuccessMessage | undefined>
  approveBlendSheetResponse: ResponseState<APISuccessMessage | undefined>
  getBlendSheetDetailResponse: ResponseState<GetBlendSheetDetail | null>
  selectedSalesOrder: SalesOrder | null
  selectedProduct: ProductItem | null;
  selectedBlendItem: BlendItem | null;
  selectedBlendDetail: Blend | null
  BOMItems: BOMItemDetail | null
  selectedWarehouses: SelectedWarehouseStock[]
  uploads: { fileKey: string }[]
  viewBlendSheetHeaderForm: BlendSheetHeaderForm
  blendSheetStatusList: ResponseState<BlendSheetStatus[]>
  salesOrderListRequest: PaginationRequest
  salesOrderListResponse: ResponseState<APIGetResponse<SalesOrder>>
  selectedBlendBalances: BlendBalance[] | null
  getBlendBalanceByBlendItemResponse: ResponseState<BlendBalanceItem[]>
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
const initialState: BlendSheetApprovalsSliceState = {
  viewBlendSheetHeaderForm: initialBlendSheetHeaderForm,
  blendSheetListResponse: {
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
  blendSheetListRequest: {
    page: 1,
    limit: 10,
    getAll: false,
  },
  selectedBlendSheet: null,
  selectedLot: null,
  selectedLotDetail: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
  teaLotDetailRequest: { customerId: 1 },
  teaLotDetailResponse: null,
  rejectReason: null,
  rejectBlendSheetResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
  approveBlendSheetResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
  getBlendSheetDetailResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null
  },
  selectedSalesOrder: null,
  selectedProduct: null,
  selectedBlendItem: null,
  selectedBlendDetail: null,
  BOMItems: null,
  selectedWarehouses: [],
  uploads: [],
  blendSheetStatusList: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: APPROVAL_STATUS
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
  selectedBlendBalances: null,
  getBlendBalanceByBlendItemResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
};

export { initialState as initialBlendSheetSliceState };

export const blendSheetApprovalsSlice = createSlice({
  name: "blendSheetApprovalsSlice",
  initialState,
  reducers: {
    setSelectedWarehouses: (state, action) => {
      state.selectedWarehouses = action.payload;
    },
    setBlendSheetSearchText: (state, action: PayloadAction<string>) => {
      state.blendSheetListRequest.search = action.payload;
    },
    setBlendSheetStatus: (state, action: PayloadAction<'PENDING' | 'REJECTED' | 'APPROVED'>) => {
      state.blendSheetListRequest.approvalStatus = action.payload;
    },
    setBlendSheetGetAll: (state, action: PayloadAction<boolean | undefined>) => {
      state.blendSheetListRequest.getAll = action.payload;
    },
    setBlendSheetCurrentPage: (state, action: PayloadAction<number>) => {
      state.blendSheetListRequest.page = action.payload;
    },
    setBlendSheetLimit: (state, action: PayloadAction<number>) => {
      state.blendSheetListRequest.limit = action.payload;
    },
    setBlendSheetApprovalStatus: (state, action: PayloadAction<'PENDING' |'APPROVED'|'REJECTED' | undefined>) => {
      state.blendSheetListRequest.approvalStatus = action.payload;
    },
    setSelectedBlendSheet: (state, action: PayloadAction<BlendSheet | null>) => {
      state.selectedBlendSheet = action.payload;
    },

    resetBlendingSheetFilter: (state) => {
      state.blendSheetListRequest = initialState.blendSheetListRequest;
    },
    setSelectedTeaLot: (state, action: PayloadAction<TeaLot | null>) => {
      state.selectedLot = action.payload;
    },
    setRejectReason: (state, action: PayloadAction<string | null>) => {
      state.rejectReason = action.payload;
    },
    resetApproveResponse: (state) => {
      state.approveBlendSheetResponse = initialState.approveBlendSheetResponse;
    },
    resetRejectResponse: (state) => {
      state.rejectBlendSheetResponse = initialState.rejectBlendSheetResponse;

    },
    setBlendingSheetSearchText: (state, action: PayloadAction<string>) => {
      state.blendSheetListRequest.search = action.payload;
    },
    setBlendingSheetStatus: (state, action: PayloadAction<BlendSheetStatus | null>) => {
      state.blendSheetListRequest.status = action.payload;
      state.blendSheetListRequest.statusId = action.payload?.statusId || undefined;
    },
    setBlendingSheetSalesOrder: (state, action: PayloadAction<SalesOrder | null>) => {
      state.blendSheetListRequest.salesOrder = action.payload;
      state.blendSheetListRequest.salesOrderId = action.payload?.salesOrderId.toString() || undefined;
    },
    setSalesOrderPage: (state, action) => {
      state.salesOrderListRequest.page = action.payload;
    },
    setSalesOrderSearchKey: (state, action) => {
      state.salesOrderListRequest.search = action.payload;
    },
    setBlendSheetHeaderFormData: (state, action: PayloadAction<FormIdentifier<any>>) => {

      const fieldName = action.payload.name as keyof typeof state.viewBlendSheetHeaderForm;

      const [validatedFormField] = formFieldValidator<string>({
        ...state.viewBlendSheetHeaderForm[fieldName],
        value: action.payload.value,
      });

      state.viewBlendSheetHeaderForm[fieldName] = validatedFormField;
    },
  },
  extraReducers: (builder) => {
    builder

      //get all blend sheets
      .addCase(getAllBlendSheets.pending, (state) => {
        state.blendSheetListResponse.isLoading = true;
      })
      .addCase(getAllBlendSheets.fulfilled, (state, action) => {
        state.blendSheetListResponse.isLoading = false;
        state.blendSheetListResponse.isSuccess = true;
        state.blendSheetListResponse.data.data = action.payload.data;
        state.blendSheetListResponse.data.currentPage = action.payload.currentPage;
        state.blendSheetListResponse.data.totalCount = action.payload.totalCount;
        state.blendSheetListResponse.data.totalPages = action.payload.totalPages;
      })
      .addCase(getAllBlendSheets.rejected, (state, action) => {
        state.blendSheetListResponse.isLoading = false;
        state.blendSheetListResponse.hasError = true;
        state.blendSheetListResponse.message = action.error.message;
      })

      //approve blend sheet
      .addCase(approveBlendSheet.pending, (state) => {
        state.approveBlendSheetResponse.isLoading = true;
      })
      .addCase(approveBlendSheet.fulfilled, (state, action) => {
        state.approveBlendSheetResponse.isLoading = false;
        state.approveBlendSheetResponse.isSuccess = true;
        state.approveBlendSheetResponse.data = action.payload;
      })
      .addCase(approveBlendSheet.rejected, (state, action) => {
        state.approveBlendSheetResponse.isLoading = false;
        state.approveBlendSheetResponse.hasError = true;
        state.approveBlendSheetResponse.message = action.error.message;
      })

      //reject blend Sheet
      .addCase(rejectBlendSheet.pending, (state) => {
        state.rejectBlendSheetResponse.isLoading = true;
      })
      .addCase(rejectBlendSheet.fulfilled, (state, action) => {
        state.rejectBlendSheetResponse.isLoading = false;
        state.rejectBlendSheetResponse.isSuccess = true;
        state.rejectBlendSheetResponse.data = action.payload;
      })
      .addCase(rejectBlendSheet.rejected, (state, action) => {
        state.rejectBlendSheetResponse.isLoading = false;
        state.rejectBlendSheetResponse.hasError = true;
        state.rejectBlendSheetResponse.message = action.error.message;
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
          salesOrderEntryId: action.payload?.salesOrderId,
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
          plannedQuantity: action.payload.plannedQuantity,
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
        state.selectedBlendDetail = blendDetail

        const bomItems: BOMItemDetail = {
          itemCode: action.payload.blendItemCode,
          bomItems: action.payload.blendSheetItems
        }
        state.BOMItems = bomItems
        // state.initialBlendItems = action.payload.blendSheetItems
        let temp: SelectedWarehouseStock[] = []
        bomItems.bomItems?.forEach((item) => {
          item.lots.forEach((lot, lotIndex) => {
            temp.push({
              index: lotIndex + 1, // Use the lot's position in its array
              itemCode: item.code, // Convert item code to lowercase
              fromWarehouse: { warehouseCode: lot.fromWarehouseCode, lots: [] },
              isToWarehouseRequired: false,
              selectedLot: {
                batchId: lot.batchId || "",
                quantity: lot.quantity,
                requiredQuantity: lot.quantity,
                boxNo: lot.boxNo || null,
                price: lot?.price || null,
                weightPerBag: lot?.weightPerBag || null
              },
              lotOptions: [],
              isCollapsed: false,
              error: "No Error",
              plannedQuantity: parseFloat((item.basedQuantity * action.payload.plannedQuantity)?.toFixed(3)),
              remainingQuantity: 0
            });
          });
        });
        state.selectedWarehouses = temp
        state.uploads = action.payload.attachments
        state.selectedBlendBalances = action.payload.blendBalance && action.payload.blendBalance?.length > 0
                ? action.payload.blendBalance.map(item => ({
                  ...item,
                  isError: 'No Error'
                })) : null
      })
      .addCase(getBlendSheetByDetail.rejected, (state, action) => {
        state.getBlendSheetDetailResponse.isLoading = false;
        state.getBlendSheetDetailResponse.hasError = true;
        state.getBlendSheetDetailResponse.message = action.error.message;
      })

      //get blend sheet status
      .addCase(getBlendSheetStatus.pending, (state) => {
        state.blendSheetStatusList.isLoading = true;
      })
      .addCase(getBlendSheetStatus.fulfilled, (state, action) => {
        state.blendSheetStatusList.isLoading = false;
        state.blendSheetStatusList.isSuccess = true;
        state.blendSheetStatusList.data = state.blendSheetStatusList.data.concat(action.payload);
      })
      .addCase(getBlendSheetStatus.rejected, (state, action) => {
        state.blendSheetStatusList.isLoading = false;
        state.blendSheetStatusList.hasError = true;
        state.blendSheetStatusList.message = action.error.message;
      })

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

        if (state.salesOrderListRequest.search !== undefined) {
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
  setBlendSheetSearchText,
  setBlendSheetCurrentPage,
  resetBlendingSheetFilter,
  setBlendSheetLimit,
  setBlendSheetStatus,
  setBlendSheetGetAll,
  setSelectedTeaLot,
  setSelectedBlendSheet,
  setRejectReason,
  resetRejectResponse,
  resetApproveResponse,
  setSelectedWarehouses,
  setBlendSheetHeaderFormData,
  setBlendingSheetSearchText,
  setBlendingSheetStatus,
  setBlendingSheetSalesOrder,
  setSalesOrderSearchKey,
  setSalesOrderPage,
  setBlendSheetApprovalStatus
} = blendSheetApprovalsSlice.actions;

export default blendSheetApprovalsSlice.reducer;
