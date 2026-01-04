import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, APISuccessMessage, PaginationRequest, ResponseState, SalesOrder } from "@/interfaces";
import { BlendSheet, BlendSheetStatus, BlendSheetTemplate, CloseBlendSheetRequest, GetAllBlendSheetsRequest } from "@/interfaces/blendSheet";
import {  getAllBlendSheets, getBlendSheetStatus, getPrintBlendSheet, getSalesOrderList } from "../action/blendAction";

export interface BlendSheetSliceState {
  blendSheetListResponse:ResponseState<APIGetResponse<BlendSheetTemplate>>
  blendSheetListRequest: GetAllBlendSheetsRequest
  blendSheetStatusList:ResponseState<BlendSheetStatus[]>
  salesOrderListRequest:PaginationRequest
  salesOrderListResponse:ResponseState<APIGetResponse<SalesOrder>>
  selectedBlendSheets: BlendSheet[]
  closeBlendSheetResponse:ResponseState<APISuccessMessage>
}

const initialState: BlendSheetSliceState = {
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
    getAll:true
  },
  blendSheetStatusList: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
  salesOrderListRequest: {
    page: 1,
    limit: 20, //this is a fixed limit from SAP check API docs
  }, salesOrderListResponse: {
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
  selectedBlendSheets: [],
  closeBlendSheetResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      message: ""
    }
  },
};

export { initialState as initialBlendSheetSliceState };

export const blendSheetSlice = createSlice({
  name: "blendSheetSlice",
  initialState,
  reducers: {
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
      setBlendSheetStartDateValue:(state, action: PayloadAction<string>) => {
        state.blendSheetListRequest.startDate = action.payload;
      },
      setBlendSheetEndDateValue:(state, action: PayloadAction<string>) => {
        state.blendSheetListRequest.endDate = action.payload;
      },
      setBlendSheetCurrentPage:(state, action: PayloadAction<number>) => {
        state.blendSheetListRequest.page = action.payload;
      },
      setBlendingSheetLimit:(state, action: PayloadAction<number>) => {
        state.blendSheetListRequest.limit = action.payload;
      },
      resetBlendingSheetFilter:(state) => {
        state.blendSheetListRequest = initialState.blendSheetListRequest;
      },
      setSalesOrderPage: (state, action) => {
        state.salesOrderListRequest.page = action.payload;
      },
      setSalesOrderSearchKey: (state, action) => {
        state.salesOrderListRequest.search = action.payload;
      },
      setSelectedBlendSheets: (state, action) => {
        state.selectedBlendSheets = action.payload;
      },
      resetCloseBlendSheetResponse: (state) =>{
        state.closeBlendSheetResponse = initialState.closeBlendSheetResponse
      }
  },
  extraReducers: (builder) => {
    builder

      //get all blend sheets list
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

      //get blend sheet status
      .addCase(getBlendSheetStatus.pending, (state) => {
        state.blendSheetStatusList.isLoading = true;
      })
      .addCase(getBlendSheetStatus.fulfilled, (state, action) => {
        state.blendSheetStatusList.isLoading = false;
        state.blendSheetStatusList.isSuccess = true;
        state.blendSheetStatusList.data = action.payload;
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

          if(state.salesOrderListRequest.search !== undefined){
            state.salesOrderListResponse.data.data = action.payload.data;

          }else{
            state.salesOrderListResponse.data.data = state.salesOrderListResponse.data.data.concat(action.payload.data);
          }
        })
        .addCase(getSalesOrderList.rejected, (state, action) => {
          state.salesOrderListResponse.isLoading = false;
          state.salesOrderListResponse.hasError = true;
          state.salesOrderListResponse.message = action.error.message;
        })

        // //close blend sheet
        // .addCase(closeBlendSheets.pending, (state) => {
        //   state.closeBlendSheetResponse.isLoading = true;
        // })
        // .addCase(closeBlendSheets.fulfilled, (state, action) => {
        //   state.closeBlendSheetResponse.isLoading = false;
        //   state.closeBlendSheetResponse.isSuccess = true;
        //   state.closeBlendSheetResponse.data = action.payload
        // })
        // .addCase(closeBlendSheets.rejected, (state, action) => {
        //   state.closeBlendSheetResponse.isLoading = false;
        //   state.closeBlendSheetResponse.hasError = true;
        //   state.closeBlendSheetResponse.message = action.error.message;
        // })
  },
});

export const {
    setBlendingSheetSearchText,
    setBlendingSheetStatus,
    setBlendSheetStartDateValue,
    setBlendSheetEndDateValue,
    setBlendSheetCurrentPage,
    setBlendingSheetLimit,
    resetBlendingSheetFilter,
    setSalesOrderSearchKey,
    setSalesOrderPage,
    setBlendingSheetSalesOrder,
    setSelectedBlendSheets,
    resetCloseBlendSheetResponse
  } = blendSheetSlice.actions;

export default blendSheetSlice.reducer;
