import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCatalog, getAllCatalogueLogs, getCatalogueLogsById, getCatalogues, getCataloguesSummary, getTabDetails } from '../action/catalogueAction';
import { APIGetResponse, Broker, Catalogue, CatalogueChangeLogs, CatalogueLogsVersionRequest, CatalogueLogVersions, CataloguesSummary, CatalogueStatus, FieldValue, ResponseState, Sales } from '@/interfaces';
// import { getTabDetails } from '../action/detailsByIdAction';

export interface CatalogueSliceState {
  tableData: {
    data: Catalogue[],
    isLoading: boolean,
    hasError: boolean
  },
  catalogueData: {
    catalogue: Catalogue,
    isLoading: boolean,
    hasError: boolean
  },
  filterValues: {
    searchText: string
    brokerValue: FieldValue<Broker | null>,
    salesCodeValue: FieldValue<Sales | null>,
    startDate: Date | null,
    endDate: Date | null,
    catalogueStatus: FieldValue<CatalogueStatus[] | null>,
  },
  filterData: {
    salesData: Sales[],
  },
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  selectedCatalogueId: number;
  deletedCatalogue: boolean;
  deleteCatalogResponse: {
    isLoading: boolean,
    hasError: boolean,
    isSuccess: boolean,
    message: string | undefined,
  };
  deleteCatalogSuccessMessage: string,
  catalogueSummaryData: {
    isLoading: boolean,
    hasError: boolean,
    catalogueSummary: CataloguesSummary
  }
  catalogueChangeLogResponse: ResponseState<APIGetResponse<CatalogueChangeLogs>>
  selectedCatalogueLotNo: number
  catalogueChangeLogsByIdResponse: ResponseState<CatalogueLogVersions[] | null>
  catalogueChangeLogsByIdRequest: CatalogueLogsVersionRequest
  changeLogTotalCount: number
  changeLogLimit: number
  changeLogTotalPages: number
  changeLogCurrentPage: number
  changeLogCatalogueId: number
}


const initialState: CatalogueSliceState = {
  tableData: {
    data: [],
    isLoading: false,
    hasError: false,
  },
  catalogueData: {
    catalogue: {
      catalogId: 0,
      catalogSerialNumber: "",
      brokerCode: "",
      brokerName: "",
      salesCode: "",
      salesDate: "",
      statusId: 0,
      statusName: "",
      isEnable: false,
      typeId: 0,
      typeName: "",
      createdBy: "",
      createdAt: "",
      updatedBy: "",
      updatedAt: "",
    },

    isLoading: false,
    hasError: false,
  },
  filterValues: {
    searchText: '',
    brokerValue: { value: null, error: null },
    salesCodeValue: { value: null, error: null },
    startDate: null,
    endDate: null,
    catalogueStatus: { value: [], error: null },
  },
  filterData: {
    salesData: [],
  },
  currentPage: 0,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
  selectedCatalogueId: 0,
  deletedCatalogue: false,
  deleteCatalogResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    message: undefined,
  },
  deleteCatalogSuccessMessage: "",
  catalogueSummaryData: {
    catalogueSummary: {
      totalCatalogFiles: 0,
      statuses: []
    },
    hasError: false,
    isLoading: false
  },
  catalogueChangeLogResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      currentPage: 1,
      totalCount: 0,
      totalPages: 0,
      data: []
    },
  },
  selectedCatalogueLotNo: 0,
  catalogueChangeLogsByIdRequest: {
    previousVersionNo: 0,
    currentVersionNo: 0
  },
  catalogueChangeLogsByIdResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: null
  },
  changeLogTotalCount: 0,
  changeLogLimit: 10,
  changeLogTotalPages: 1,
  changeLogCurrentPage: 0,
  changeLogCatalogueId: 0
};

export { initialState as initialCatalogueSliceState };

export const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {

    setDeleteCatalogIsError: (state, action: PayloadAction<boolean>) => {
      state.deleteCatalogResponse.hasError = action.payload;
    },
    setDeleteCatalogIsSuccess: (state, action: PayloadAction<boolean>) => {
      state.deleteCatalogResponse.isSuccess = action.payload;
    },
    setDeleteCatalogSuccessMessage: (state, action: PayloadAction<string>) => {
      state.deleteCatalogResponse.message = action.payload;
    },
    setDeleteCatalogErrorMessage: (state, action: PayloadAction<string>) => {
      state.deleteCatalogResponse.message = action.payload;
    },
    setCatalogueId: (state, action: PayloadAction<number>) => {
      state.selectedCatalogueId = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.filterValues.searchText = action.payload;
    },
    setBrokerFilterValue: (state, action: PayloadAction<Broker | null>) => {
      const brokerFilter = {
        value: action.payload,
        error: null
      }
      state.filterValues.brokerValue = brokerFilter
      const salesFilter = {
        value: null,
        error: null
      }
      state.filterValues.salesCodeValue = salesFilter
      if (action.payload?.salesData) {
        state.filterData.salesData = action.payload?.salesData
      }
    },
    setSalesFilterValue: (state, action: PayloadAction<Sales | null>) => {
      const salesFilter = {
        value: action.payload,
        error: null
      }
      state.filterValues.salesCodeValue = salesFilter
    },
    setStartDateFilterValue: (state, action: PayloadAction<Date | null>) => {
      state.filterValues.startDate = action.payload
    },
    setEndDateFilterValue: (state, action: PayloadAction<Date | null>) => {
      state.filterValues.endDate = action.payload
    },
    setCatalogueStatusFilterValue: (state, action: PayloadAction<CatalogueStatus[] | null>) => {
      const statusFilter = {
        value: action.payload,
        error: null
      }
      state.filterValues.catalogueStatus = statusFilter
    },
    resetFilter: (state) => {
      const resetField = {
        value: null,
        error: null
      }

      const resetFieldS = {
        value: [],
        error: null
      }

      state.filterValues.searchText = initialState.filterValues.searchText
      state.filterValues.brokerValue = resetField
      state.filterValues.salesCodeValue = resetField
      state.filterValues.endDate = null
      state.filterValues.startDate = null
      state.filterValues.catalogueStatus = resetFieldS
      state.filterData.salesData = []
    },
    // change logs
    setCatalogueChangeLogCurrentPage: (state, action: PayloadAction<number>) => {
      state.changeLogCurrentPage = action.payload;
    },
    setCatalogueChangeLogLimit: (state, action: PayloadAction<number>) => {
      state.changeLogLimit = action.payload;
    },
    setCatalogueLotId: (state, action: PayloadAction<number>) => {
      state.selectedCatalogueLotNo = action.payload
    },
    setCatalogueChangeLogVersions: (state, action: PayloadAction<number>) => {
      state.catalogueChangeLogsByIdRequest.currentVersionNo = action.payload
      state.catalogueChangeLogsByIdRequest.previousVersionNo = action.payload - 1
    },
    resetCatalogueChangeLogsByIdResponse: (state) => {
      state.catalogueChangeLogsByIdResponse = initialState.catalogueChangeLogsByIdResponse
    },
    setSelectedChangeLogCatalogueId: (state, action: PayloadAction<number>) => {
      state.changeLogCatalogueId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // get catalogues
      .addCase(getCatalogues.pending, (state) => {
        state.tableData.isLoading = true;
        state.tableData.hasError = false;
      })
      .addCase(getCatalogues.fulfilled, (state, action) => {
        state.tableData.data = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.tableData.isLoading = false;
        state.tableData.hasError = false;
      })
      .addCase(getCatalogues.rejected, (state) => {
        state.tableData.isLoading = false;
        state.tableData.hasError = true;
      })


      // get catalogues by Id
      .addCase(getTabDetails.pending, (state) => {
        state.catalogueData.isLoading = true;
        state.catalogueData.hasError = false;
      })
      .addCase(getTabDetails.fulfilled, (state, action) => {
        state.catalogueData.catalogue = action.payload.data;
        state.catalogueData.isLoading = false;
        state.catalogueData.hasError = false;
      })
      .addCase(getTabDetails.rejected, (state) => {
        state.catalogueData.isLoading = false;
        state.catalogueData.hasError = true;
      })

      // delete catalogue
      .addCase(deleteCatalog.pending, (state) => {
        state.deleteCatalogResponse.isLoading = true;
      })
      .addCase(deleteCatalog.fulfilled, (state, action) => {
        state.deleteCatalogResponse.isLoading = false;
        state.deleteCatalogResponse.hasError = false;
        state.deleteCatalogResponse.isSuccess = true;
        state.deleteCatalogResponse.message = action.payload.data.message;
        state.deletedCatalogue = true;
      })
      .addCase(deleteCatalog.rejected, (state, action) => {
        state.deleteCatalogResponse.isLoading = false;
        state.deleteCatalogResponse.hasError = true;
        state.deleteCatalogResponse.message = action.error.message;
        state.deletedCatalogue = false;
      })

      //Catalogue summary
      .addCase(getCataloguesSummary.pending, (state) => {
        state.catalogueSummaryData.isLoading = true;
      })
      .addCase(getCataloguesSummary.fulfilled, (state, action) => {
        state.catalogueSummaryData.isLoading = false;
        state.catalogueSummaryData.hasError = false;
        state.catalogueSummaryData.catalogueSummary = action.payload;
        state.deletedCatalogue = true;
      })
      .addCase(getCataloguesSummary.rejected, (state, action) => {
        state.catalogueSummaryData.isLoading = false;
        state.catalogueSummaryData.hasError = true;
      })

      //all change log
      .addCase(getAllCatalogueLogs.pending, (state) => {
        state.catalogueChangeLogResponse.isLoading = true;
      })
      .addCase(getAllCatalogueLogs.fulfilled, (state, action) => {
        state.catalogueChangeLogResponse.isLoading = false;
        state.catalogueChangeLogResponse.isSuccess = true;
        state.catalogueChangeLogResponse.data.data = action.payload.data;
        state.catalogueChangeLogResponse.data.currentPage = action.payload.currentPage;
        state.catalogueChangeLogResponse.data.totalCount = action.payload.totalCount;
        state.catalogueChangeLogResponse.data.totalPages = action.payload.totalPages;
        state.changeLogTotalPages = action.payload.totalPages;
        state.changeLogTotalCount = action.payload.totalCount;
      })
      .addCase(getAllCatalogueLogs.rejected, (state, action) => {
        state.catalogueChangeLogResponse.isLoading = false;
        state.catalogueChangeLogResponse.hasError = true;
        state.catalogueChangeLogResponse.message = action.error.message;
      })

      //change logs by lot id
      .addCase(getCatalogueLogsById.pending, (state) => {
        state.catalogueChangeLogsByIdResponse.isLoading = true;
      })
      .addCase(getCatalogueLogsById.fulfilled, (state, action) => {
        state.catalogueChangeLogsByIdResponse.isLoading = false;
        state.catalogueChangeLogsByIdResponse.isSuccess = true;
        state.catalogueChangeLogsByIdResponse.data = action.payload;
      })
      .addCase(getCatalogueLogsById.rejected, (state, action) => {
        state.catalogueChangeLogsByIdResponse.isLoading = false;
        state.catalogueChangeLogsByIdResponse.hasError = true;
        state.catalogueChangeLogsByIdResponse.message = action.error.message;
      })
  },
});

export const {
  setDeleteCatalogIsError,
  setDeleteCatalogIsSuccess,
  setDeleteCatalogSuccessMessage,
  setDeleteCatalogErrorMessage,
  setCatalogueId,
  setCurrentPage,
  resetFilter,
  setLimit,
  setSearchText,
  setSalesFilterValue,
  setBrokerFilterValue,
  setStartDateFilterValue,
  setEndDateFilterValue,
  setCatalogueStatusFilterValue,
  setCatalogueChangeLogCurrentPage,
  setCatalogueChangeLogLimit,
  setCatalogueLotId,
  setCatalogueChangeLogVersions,
  resetCatalogueChangeLogsByIdResponse,
  setSelectedChangeLogCatalogueId
} = catalogueSlice.actions;

export default catalogueSlice.reducer;
