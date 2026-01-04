import {
  SendingDeliveryOrderDetailsById,
  DeliveryOrderItem,
  DeliveryOrderStatus,
  FieldValue,
  SendingDeliveryOrder,
  TeaLot,
  SendingDeliveryOrderItem,
} from "@/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createSendingDeliveryOrder,

  getSendingDeliveryOrderDetails,
  getSendingDeliveryOrderDetailsById,
  updateSendingDeliveryOrderAction,
  getDeliveryItemsById,
} from "../action/sendingDeliveryOrderAction";

export interface DeliveryOrderSliceState {
  //view DO
  tableData: {
    data: SendingDeliveryOrder[];
    isLoading: boolean;
    hasError: boolean;
  };
  filterValues: {
    searchText: string;
    fromDate: Date | null;
    toDate: Date | null;
    deliveryOrderStatus: FieldValue<DeliveryOrderStatus[] | null>;
  };
  selectedLot: number;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  deliveryDateValue: Date | undefined;
  isMarkAsCompleteClicked: boolean;
  //create DO
  createDO: {
    tableData: {
      data: SendingDeliveryOrderItem[];
      isLoading: boolean;
      hasError: boolean;
    };
    statusIds: string;
    currentPageDO: number;
    totalPagesDO: number;
    totalCountDO: number;
    limitDO: number;
    tabStatus: string | undefined;
    selectedRows: any[];
    isSelectAllChecked: boolean;
    allLotIds: number[];
    errorAlertOpen: boolean;
    deliveryOrderId: number;
  };
  createDeliveryOrderResponse: {
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
    deliveryOrderNumber: number | undefined;
    deliveryOrderId: number | undefined;
  };
  //get DO by Id
  deliveryOrderData: {
    deliveryOrder: SendingDeliveryOrderDetailsById;
    isLoading: boolean;
    hasError: boolean;
  };
  //update DO action
  updateDeliverOrderActionResponse: {
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
  };
}

const initialState: DeliveryOrderSliceState = {
  tableData: {
    data: [],
    isLoading: false,
    hasError: false,
  },
  filterValues: {
    searchText: "",
    fromDate: null,
    toDate: null,
    deliveryOrderStatus: { value: [], error: null },
  },
  selectedLot: 0,
  currentPage: 0,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
  deliveryDateValue: undefined,
  isMarkAsCompleteClicked: false,
  createDO: {
    tableData: {
      data: [],
      isLoading: false,
      hasError: false,
    },
    statusIds: "4",
    currentPageDO: 1,
    totalPagesDO: 0,
    totalCountDO: 0,
    limitDO: 10,
    tabStatus: undefined,
    selectedRows: [],
    isSelectAllChecked: false,
    allLotIds: [],
    errorAlertOpen: false,
    deliveryOrderId: 0,
  },
  createDeliveryOrderResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    message: undefined,
    deliveryOrderNumber: undefined,
    deliveryOrderId: undefined,
  },
  deliveryOrderData: {
    deliveryOrder: {} as SendingDeliveryOrderDetailsById,
    isLoading: false,
    hasError: false,
  },
  updateDeliverOrderActionResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    message: undefined,
  },
};

export { initialState as initialDeliveryOrderSliceState };

export const sendingDeliveryOrderSlice = createSlice({
  name: "deliveryOrders",
  initialState,
  reducers: {
    setSelectedRow: (state, action: PayloadAction<number>) => {
      state.selectedLot = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setCreateDOPage: (state, action: PayloadAction<number>) => {
      state.createDO.currentPageDO = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setCreateDOLimit: (state, action: PayloadAction<number>) => {
      state.createDO.limitDO = action.payload;
    },
    setDeliveryOrderId: (state, action: PayloadAction<number>) => {
      state.createDO.deliveryOrderId = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.filterValues.searchText = action.payload;
    },
    setFromDateFilterValue: (state, action: PayloadAction<Date | null>) => {
      state.filterValues.fromDate = action.payload;
    },
    setToDateFilterValue: (state, action: PayloadAction<Date | null>) => {
      state.filterValues.toDate = action.payload;
    },
    setdeliveryDateValue: (
      state,
      action: PayloadAction<Date | undefined>
    ) => {
      state.deliveryDateValue = action.payload;
    },
    setTabStatus: (state, action: PayloadAction<string | undefined>) => {
      state.createDO.tabStatus = action.payload;
    },
    setSelectedRows: (state, action: PayloadAction<number[]>) => {
      state.createDO.selectedRows = action.payload;
    },
    setIsSelectAllChecked: (state, action: PayloadAction<boolean>) => {
      state.createDO.isSelectAllChecked = action.payload;
    },
    setAllLotIds: (state, action: PayloadAction<number[]>) => {
      state.createDO.allLotIds = action.payload;
    },
    setErrorAlertOpen: (state, action: PayloadAction<boolean>) => {
      state.createDO.errorAlertOpen = action.payload;
    },
    setIsMarkAsCompleteClicked: (state, action: PayloadAction<boolean>) => {
      state.isMarkAsCompleteClicked = action.payload;
    },
    setDeliveryOrderStatusFilterValue: (
      state,
      action: PayloadAction<DeliveryOrderStatus[] | null>
    ) => {
      const statusFilter = {
        value: action.payload,
        error: null,
      };
      state.filterValues.deliveryOrderStatus = statusFilter;
    },
    resetFilter: (state) => {
      const resetFields = {
        value: [],
        error: null,
      };
      state.filterValues.fromDate = null;
      state.filterValues.toDate = null;
      state.filterValues.deliveryOrderStatus = resetFields;
      state.filterValues.searchText = initialState.filterValues.searchText;
    },
    resetCreateDeliveryOrderResponse: (state) => {
      state.createDeliveryOrderResponse.isSuccess =
        initialState.createDeliveryOrderResponse.isSuccess;
      state.createDeliveryOrderResponse.hasError =
        initialState.createDeliveryOrderResponse.hasError;
    },
    resetCreateDeliveryOrder: (state) => {
      state.deliveryDateValue = initialState.deliveryDateValue;
      state.createDO.selectedRows = initialState.createDO.selectedRows;
    },
    resetUdateDeliverOrderActionResponse: (state) => {
      state.updateDeliverOrderActionResponse.isSuccess =
        initialState.updateDeliverOrderActionResponse.isSuccess;
      state.updateDeliverOrderActionResponse.hasError =
        initialState.updateDeliverOrderActionResponse.hasError;
    },
  },
  extraReducers: (builder) => {
    builder
      // get delivery orders
      .addCase(getSendingDeliveryOrderDetails.pending, (state) => {
        state.tableData.isLoading = true;
        state.tableData.hasError = false;
      })
      .addCase(getSendingDeliveryOrderDetails.fulfilled, (state, action) => {
        state.tableData.data = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.tableData.isLoading = false;
        state.tableData.hasError = false;
      })
      .addCase(getSendingDeliveryOrderDetails.rejected, (state) => {
        state.tableData.isLoading = false;
        state.tableData.hasError = true;
      })

      //create delivery order
      .addCase(createSendingDeliveryOrder.pending, (state) => {
        state.createDeliveryOrderResponse.isLoading = true;
      })
      .addCase(createSendingDeliveryOrder.fulfilled, (state, action) => {
        state.createDeliveryOrderResponse.isLoading = false;
        state.createDeliveryOrderResponse.hasError = false;
        state.createDeliveryOrderResponse.isSuccess = true;
        state.createDeliveryOrderResponse.message = action.payload.message;
        state.createDeliveryOrderResponse.deliveryOrderNumber =
          action.payload.deliveryOrderNumber;
        state.createDeliveryOrderResponse.deliveryOrderId =
          action.payload.deliveryOrderId;
      })
      .addCase(createSendingDeliveryOrder.rejected, (state, action) => {
        state.createDeliveryOrderResponse.isLoading = false;
        state.createDeliveryOrderResponse.hasError = true;
        state.createDeliveryOrderResponse.message = action.error.message;
      })

      // get delivery orders by id
      .addCase(getSendingDeliveryOrderDetailsById.pending, (state) => {
        state.deliveryOrderData.isLoading = true;
        state.deliveryOrderData.hasError = false;
      })
      .addCase(getSendingDeliveryOrderDetailsById.fulfilled, (state, action) => {
        state.deliveryOrderData.deliveryOrder = action.payload.data;
        state.deliveryOrderData.isLoading = false;
        state.deliveryOrderData.hasError = false;
      })
      .addCase(getSendingDeliveryOrderDetailsById.rejected, (state) => {
        state.deliveryOrderData.isLoading = false;
        state.deliveryOrderData.hasError = true;
      })

      // get DO created teaLot details
      .addCase(getDeliveryItemsById.pending, (state) => {
        state.createDO.tableData.isLoading = true;
        state.createDO.tableData.hasError = false;
      })
      .addCase(getDeliveryItemsById.fulfilled, (state, action) => {
        state.createDO.tableData.data = action.payload?.deliveryItems || [];
        state.createDO.totalPagesDO = 1;
        state.createDO.totalCountDO = action.payload?.deliveryItems.length || 0;
        state.createDO.tableData.isLoading = false;
        state.createDO.tableData.hasError = false;
      })
      .addCase(getDeliveryItemsById.rejected, (state) => {
        state.createDO.tableData.isLoading = false;
        state.createDO.tableData.hasError = true;
      })

      //update delivery order action
      .addCase(updateSendingDeliveryOrderAction.pending, (state) => {
        state.updateDeliverOrderActionResponse.isLoading = true;
      })
      .addCase(updateSendingDeliveryOrderAction.fulfilled, (state, action) => {
        state.updateDeliverOrderActionResponse.isLoading = false;
        state.updateDeliverOrderActionResponse.hasError = false;
        state.updateDeliverOrderActionResponse.isSuccess = true;
        state.updateDeliverOrderActionResponse.message = action.payload.message;
      })
      .addCase(updateSendingDeliveryOrderAction.rejected, (state, action) => {
        state.updateDeliverOrderActionResponse.isLoading = false;
        state.updateDeliverOrderActionResponse.hasError = true;
        state.updateDeliverOrderActionResponse.message = action.error.message;
      });
  },
});

export const {
  resetFilter,
  setCurrentPage,
  setCreateDOPage,
  setLimit,
  setCreateDOLimit,
  setSearchText,
  setFromDateFilterValue,
  setToDateFilterValue,
  setdeliveryDateValue,
  setDeliveryOrderStatusFilterValue,
  setTabStatus,
  setSelectedRows,
  resetCreateDeliveryOrderResponse,
  resetCreateDeliveryOrder,
  setErrorAlertOpen,
  setIsSelectAllChecked,
  setAllLotIds,
  setSelectedRow,
  setDeliveryOrderId,
  resetUdateDeliverOrderActionResponse,
  setIsMarkAsCompleteClicked,
} = sendingDeliveryOrderSlice.actions;

export default sendingDeliveryOrderSlice.reducer;
