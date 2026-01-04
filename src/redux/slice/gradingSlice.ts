import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeaLot, BulkForm } from "./../../interfaces/teaLot";
import { getTeaLotDetails, updateTeaLotDetails } from "../action/gradingAction";
import { getPurchasedTeaLotDetails } from "../action/deliveryOrderAction";

export interface GradingSliceState {
  tableData: {
    data: TeaLot[];
    isLoading: boolean;
    hasError: boolean;
  };
  editedData: BulkForm[];
  selectedRow: TeaLot | null;
  searchText: string;
  isBuyingPlan: boolean | undefined;
  statusIds: string;
  currentPage: number;
  totalPages: number;
  totalRowCount: number;
  limit: number;
  catalogId: number;
  updateTeaLotResponse: {
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
  };
  tabStatus: string | undefined;
  standardErrorAlert: boolean;
  priceErrorAlert: boolean;
  buyerErrorAlert: boolean;
}

const initialState: GradingSliceState = {
  tableData: {
    data: [],
    isLoading: false,
    hasError: false,
  },
  isBuyingPlan: undefined,
  editedData: [],
  selectedRow: null,
  searchText: "",
  statusIds: "1,2",
  currentPage: 0,
  totalPages: 1,
  totalRowCount: 0,
  limit: 10,
  catalogId: 0,
  updateTeaLotResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    message: undefined,
  },
  tabStatus: undefined,
  standardErrorAlert: false,
  priceErrorAlert: false,
  buyerErrorAlert: false
};

export { initialState as initialGradingSliceState };

export const gradingSlice = createSlice({
  name: "grading",
  initialState,
  reducers: {
    setIsBuyingPlan: (state, action: PayloadAction<boolean>) => {
      state.isBuyingPlan = action.payload;
    },

    setStandardErrorAlert: (state, action: PayloadAction<boolean>) => {
      state.standardErrorAlert = action.payload;
    },

    setPriceErrorAlert: (state, action: PayloadAction<boolean>) => {
      state.priceErrorAlert = action.payload;
    },

    setBuyerErrorAlert: (state, action: PayloadAction<boolean>) => {
      state.buyerErrorAlert = action.payload;
    },

    setTabStatus: (state, action: PayloadAction<string | undefined>) => {
      state.tabStatus = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setStandard: (state, action: PayloadAction<BulkForm>) => {
      const value = state.editedData.find(
        (item) => item.lotId === action.payload.lotId
      );
      if (value) {
        value.standardId = action.payload.standardId;
        value.standardName = action.payload.standardName;
      } else {
        state.editedData = state.editedData.concat(action.payload);
      }
    },
    setPrice: (state, action: PayloadAction<BulkForm>) => {
      const value = state.editedData.find(
        (item) => item.lotId === action.payload.lotId
      );
      if (value) {
        value.price = action.payload.price || undefined;
      } else {
        state.editedData = state.editedData.concat(action.payload);
      }
    },
    setBuyer: (state, action: PayloadAction<BulkForm>) => {
      const value = state.editedData.find(
        (item) => item.lotId === action.payload.lotId
      );
      if (value) {
        value.buyer = action.payload.buyer || "";
      } else {
        state.editedData = state.editedData.concat(action.payload);
      }
    },
    resetEditedData: (state) => {
      state.editedData = [];
    },
    resetTeaLotUpdateResponse: (state) => {
      state.updateTeaLotResponse.isSuccess = false;
    },
    resetPaginationData: (state) => {
      state.tabStatus = initialState.tabStatus
      // state.currentPage = initialState.currentPage
      state.totalPages = initialState.totalPages
      state.totalRowCount = initialState.totalRowCount
      state.limit = initialState.limit
    }
  },
  extraReducers: (builder) => {
    builder
      // get tea lot details
      .addCase(getTeaLotDetails.pending, (state) => {
        state.tableData.isLoading = true;
        state.tableData.hasError = false;
      })
      .addCase(getTeaLotDetails.fulfilled, (state, action) => {
        state.tableData.data = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalRowCount = action.payload.totalCount;
        state.tableData.isLoading = false;
        state.tableData.hasError = false;
      })
      .addCase(getTeaLotDetails.rejected, (state) => {
        state.tableData.isLoading = false;
        state.tableData.hasError = true;
      })

      // update tea lot details
      .addCase(updateTeaLotDetails.pending, (state, action) => {
        state.updateTeaLotResponse.isLoading = true;
      })
      .addCase(updateTeaLotDetails.fulfilled, (state, action) => {
        state.updateTeaLotResponse.isLoading = false;
        state.updateTeaLotResponse.isSuccess = true;
      })
      .addCase(updateTeaLotDetails.rejected, (state, action) => {
        state.updateTeaLotResponse.isLoading = false;
        state.updateTeaLotResponse.hasError = true;
        state.updateTeaLotResponse.message = action.error.message;
      });
  },
});

export const {
  setSearchText,
  setCurrentPage,
  setLimit,
  resetEditedData,
  setStandard,
  setBuyer,
  setPrice,
  setTabStatus,
  resetTeaLotUpdateResponse,
  setStandardErrorAlert,
  setPriceErrorAlert,
  setBuyerErrorAlert,
  resetPaginationData,
  setIsBuyingPlan
} = gradingSlice.actions;

export default gradingSlice.reducer;
