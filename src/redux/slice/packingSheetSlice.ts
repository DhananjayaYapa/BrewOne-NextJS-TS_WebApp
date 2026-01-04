import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, GetAllPackingSheetsRequest, PackingSheet, PackingSheetStatus, ResponseState } from "@/interfaces";
import { getAllPackingSheets, getPackingSheetStatus } from "../action/packingSheetAction";

export interface PackingSheetSliceState {
  packingSheetListResponse:ResponseState<APIGetResponse<PackingSheet>>
  packingSheetListRequest: GetAllPackingSheetsRequest
  packingSheetStatusList:ResponseState<PackingSheetStatus[]>
}

const initialState: PackingSheetSliceState = {
    packingSheetListResponse: {
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
  packingSheetListRequest:{
    page:1,
    limit: 10,
  },
  packingSheetStatusList:{
      isLoading: false,
      hasError: false,
      isSuccess: false,
      data: []
  }
};

export { initialState as initialPackingSheetSliceState };

export const packingSheetSlice = createSlice({
  name: "packingSheetSlice",
  initialState,
  reducers: {
     setPackingSheetSearchText: (state, action: PayloadAction<string>) => {
        state.packingSheetListRequest.search = action.payload;
      },
      setPackingSheetStatus: (state, action: PayloadAction<PackingSheetStatus | null>) => {
        state.packingSheetListRequest.status = action.payload;
        state.packingSheetListRequest.statusId = action.payload?.statusId || undefined;
      },
      setPackingSheetStartDateValue:(state, action: PayloadAction<string>) => {
        state.packingSheetListRequest.startDate = action.payload;
      },
      setPackingSheetEndDateValue:(state, action: PayloadAction<string>) => {
        state.packingSheetListRequest.endDate = action.payload;
      },
      setPackingSheetCurrentPage:(state, action: PayloadAction<number>) => {
        state.packingSheetListRequest.page = action.payload;
      },
      setPackingSheetLimit:(state, action: PayloadAction<number>) => {
        state.packingSheetListRequest.limit = action.payload;
      },
      resetPackingSheetFilter:(state) => {
        state.packingSheetListRequest = initialState.packingSheetListRequest;
      },
  },
  extraReducers: (builder) => {
    builder

      //get all packing sheets list
      .addCase(getAllPackingSheets.pending, (state) => {
        state.packingSheetListResponse.isLoading = true;
      })
      .addCase(getAllPackingSheets.fulfilled, (state, action) => {
        state.packingSheetListResponse.isLoading = false;
        state.packingSheetListResponse.isSuccess = true;
        state.packingSheetListResponse.data.data = action.payload.data;
        state.packingSheetListResponse.data.currentPage = action.payload.currentPage;
        state.packingSheetListResponse.data.totalCount = action.payload.totalCount;
        state.packingSheetListResponse.data.totalPages = action.payload.totalPages;
      })
      .addCase(getAllPackingSheets.rejected, (state, action) => {
        state.packingSheetListResponse.isLoading = false;
        state.packingSheetListResponse.hasError = true;
        state.packingSheetListResponse.message = action.error.message;
      })

      //get packing sheet status
      .addCase(getPackingSheetStatus.pending, (state) => {
        state.packingSheetStatusList.isLoading = true;
      })
      .addCase(getPackingSheetStatus.fulfilled, (state, action) => {
        state.packingSheetStatusList.isLoading = false;
        state.packingSheetStatusList.isSuccess = true;
        state.packingSheetStatusList.data = action.payload;
      })
      .addCase(getPackingSheetStatus.rejected, (state, action) => {
        state.packingSheetStatusList.isLoading = false;
        state.packingSheetStatusList.hasError = true;
        state.packingSheetStatusList.message = action.error.message;
      })

     
  },
});

export const {
    setPackingSheetSearchText,
    setPackingSheetStatus,
    setPackingSheetStartDateValue,
    setPackingSheetEndDateValue,
    setPackingSheetCurrentPage,
    setPackingSheetLimit,
    resetPackingSheetFilter
  } = packingSheetSlice.actions;

export default packingSheetSlice.reducer;
