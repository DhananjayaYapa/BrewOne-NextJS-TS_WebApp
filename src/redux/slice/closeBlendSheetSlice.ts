import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, APISuccessMessage, GetMasterBlendBalance, PaginationRequest, ResponseState, SalesOrder } from "@/interfaces";
import { BlendSheet, BlendSheetStatus, BlendSheetTemplate, CloseBlendSheetRequest, GetAllBlendSheetsRequest } from "@/interfaces/blendSheet";
import { closeBlendSheets, getAllBlendSheets, getMasterBlendSheetDetails } from "../action/closeBlendSheetAction";
import { BLEND_SHEET_STATUS } from "@/constant";

export interface BlendSheetSliceState {
  blendSheetListResponse:ResponseState<APIGetResponse<BlendSheetTemplate>>
  blendSheetListRequest: GetAllBlendSheetsRequest
  selectedBlendSheets: BlendSheetTemplate[]
  closeBlendSheetResponse:ResponseState<APISuccessMessage | undefined>
  getMasterBlendSheetDetailsResponse: ResponseState<GetMasterBlendBalance[]>
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
    getAll:true,
    filterAllSheetsByStatusId: BLEND_SHEET_STATUS.RELEASED
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
  getMasterBlendSheetDetailsResponse:{
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  }
};

export { initialState as initialCloseBlendSheetSliceState };

export const closeBlendSheetSlice = createSlice({
  name: "closeBlendSheetSlice",
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
      resetRequest:(state) => {
        state.blendSheetListRequest = initialState.blendSheetListRequest;
      },
      setBlendingSheetLimit:(state, action: PayloadAction<number>) => {
        state.blendSheetListRequest.limit = action.payload;
      },
      resetBlendingSheetFilter:(state) => {
        state.blendSheetListRequest = initialState.blendSheetListRequest;
      },
      setSelectedBlendSheets: (state, action) => {
        state.selectedBlendSheets = action.payload;
      },
      resetCloseBlendSheetResponse: (state) =>{ 
        state.closeBlendSheetResponse = initialState.closeBlendSheetResponse
      },
      resetGetMasterBlendBalance: (state) =>{ 
        state.getMasterBlendSheetDetailsResponse = initialState.getMasterBlendSheetDetailsResponse
      },
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

        //close blend sheet
        .addCase(closeBlendSheets.pending, (state) => {
          state.closeBlendSheetResponse.isLoading = true;
        })
        .addCase(closeBlendSheets.fulfilled, (state, action) => {
          state.closeBlendSheetResponse.isLoading = false;
          state.closeBlendSheetResponse.isSuccess = true;
          state.closeBlendSheetResponse.data = action.payload
        })
        .addCase(closeBlendSheets.rejected, (state, action) => {
          state.closeBlendSheetResponse.isLoading = false;
          state.closeBlendSheetResponse.hasError = true;
          state.closeBlendSheetResponse.message = action.error.message;
        })

        //get master blend balance
        .addCase(getMasterBlendSheetDetails.pending, (state) => {
          state.getMasterBlendSheetDetailsResponse.isLoading = true;
        })
        .addCase(getMasterBlendSheetDetails.fulfilled, (state, action) => {
          state.getMasterBlendSheetDetailsResponse.isLoading = false;
          state.getMasterBlendSheetDetailsResponse.isSuccess = true;
          state.getMasterBlendSheetDetailsResponse.data = action.payload
        })
        .addCase(getMasterBlendSheetDetails.rejected, (state, action) => {
          state.getMasterBlendSheetDetailsResponse.isLoading = false;
          state.getMasterBlendSheetDetailsResponse.hasError = true;
          state.getMasterBlendSheetDetailsResponse.message = action.error.message;
        })
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
    setBlendingSheetSalesOrder,
    setSelectedBlendSheets,
    resetCloseBlendSheetResponse,
    resetGetMasterBlendBalance,
    resetRequest
  } = closeBlendSheetSlice.actions;

export default closeBlendSheetSlice.reducer;
