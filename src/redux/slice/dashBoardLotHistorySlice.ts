import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CatalogFileList,
  FieldValue,
  LotSummeryAPIResponse,
  StatusHistory,
  TeaLotDetailsSummery,
} from "@/interfaces";
import {
  getCatalogueFileList,
  getTeaLotHistoryById,
  getTeaLotsDetailsSummary,
  getTeaLotSummaryAPI,
} from "../action/dashBoardTeaLotsAction";

export interface initialStateProps {
  limit: number;
  timeLineData: {
    lotId: number;
    lotNo: number;
    statusHistory: StatusHistory[];
  };
  isLoading: boolean;
  hasError: boolean;
  catalogFiles: CatalogFileList[];
  catalogsFiles: CatalogFileList[];
  selectedCatalogId:  number | undefined;
  selectedcatalogSerialNumber: string | undefined;
  selectedRecord:number | null;
  currentPage: number;
    totalPages: number;
    totalCount: number;
  tableData: {
    data: TeaLotDetailsSummery[];
  };
  lotData: LotSummeryAPIResponse[];
  filterValues: {
    lotNumber: string | null;
    catalogSerialNumber: FieldValue<CatalogFileList | null>;
    startDate: Date | null;
    endDate: Date | null;
  };
}

const initialState: initialStateProps = {
  limit: 10,
  timeLineData: {
    lotId: 0,
    lotNo: 0,
    statusHistory: [
      {
        index: 0,
        statusId: 0,
        statusName: "",
        stageType: "", //(PREVIOUS,CURRENT,UPCOMING)
        updatedAt: "",
      },
    ],
  },
  isLoading: false,
  hasError: false,
  catalogFiles: [],
  catalogsFiles:[],
  selectedCatalogId: 0,
  selectedcatalogSerialNumber: "",
  selectedRecord:null,
  
  currentPage: 0,
  totalPages: 1,
  totalCount: 0,
  tableData: {
    data: [],
  },
  lotData: [],
  filterValues: {
    lotNumber: null,
    catalogSerialNumber: {value: null, error: null},
    startDate: null,
    endDate: null,
  },
};

export const dashBoardLotHistorySlice = createSlice({
  name: "lotHistory",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSelectedCatalog: (state, action: PayloadAction<number | undefined>) => {
      state.selectedCatalogId = action.payload;
      
    },
    setSelectedCatalogSerialNumber: (state, action: PayloadAction<string | undefined>) => {
      state.selectedcatalogSerialNumber = action.payload;
      
    },
    setSelectedRecord: (state, action: PayloadAction<number>) => {
      state.selectedRecord = action.payload;
    },
    setStartDateFilterValue: (state, action: PayloadAction<Date | null>) => {
      state.filterValues.startDate = action.payload;
    },
    setEndDateFilterValue: (state, action: PayloadAction<Date | null>) => {
      state.filterValues.endDate = action.payload;
    },
    setTeaLotFilterValue: (state, action: PayloadAction<string | null>) => {
      state.filterValues.lotNumber = action.payload;
    },
    setCatalogSerialNumberFilterValue: (state, action: PayloadAction<CatalogFileList | null>) => {
      const catalogFilter={
        value: action.payload,
          error: null
      }
      state.filterValues.catalogSerialNumber = catalogFilter;
    },
    resetFilterDashboard: (state) => {
      state.filterValues.catalogSerialNumber = {value: null, error: null}
      state.filterValues.lotNumber = null;
      state.filterValues.lotNumber = null;
      state.filterValues.endDate = null;
      state.filterValues.startDate = null;
      state.selectedCatalogId = undefined
    },
    resetSelectedRow: (state) => {
      state.selectedRecord =initialState.selectedRecord;
    },
    resetTimeLineData: (state) => {
      state.timeLineData = initialState.timeLineData;
    }
  },

  extraReducers: (builder) => {
    builder
      // get tea lot history
      .addCase(getTeaLotHistoryById.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getTeaLotHistoryById.fulfilled, (state, action) => {
        state.timeLineData = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getTeaLotHistoryById.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // get Catalogue File List

      .addCase(getCatalogueFileList.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getCatalogueFileList.fulfilled, (state, action) => {
        state.catalogFiles = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getCatalogueFileList.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })

      // Get Tea Lots Details Summary

      .addCase(getTeaLotsDetailsSummary.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      
      .addCase(getTeaLotsDetailsSummary.fulfilled, (state, action) => {
        state.totalCount=action.payload.totalCount;
        state.totalPages=action.payload.totalPages;
        state.tableData = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getTeaLotsDetailsSummary.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })


      // Get Tea Lot Summary API
      .addCase(getTeaLotSummaryAPI.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getTeaLotSummaryAPI.fulfilled, (state, action) => {
        state.lotData = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getTeaLotSummaryAPI.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const {
  setSelectedRecord,
  setCurrentPage,
  setSelectedCatalog,
  setSelectedCatalogSerialNumber,
  setCatalogSerialNumberFilterValue,
  setLimit,
  setStartDateFilterValue,
  setEndDateFilterValue,
  setTeaLotFilterValue,
  resetFilterDashboard,
  resetTimeLineData,
  resetSelectedRow,
} = dashBoardLotHistorySlice.actions;
export default dashBoardLotHistorySlice.reducer;
