import { ResponseState, TextFile, TextFileCodes } from "@/interfaces";
import { getTextFileCodesByBrokerCode, getTextFileFormatByBrokerCode, uploadCatalogue } from "./../action/uploadCatalogueAction";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UploadCatalogueSliceState {
  searchBy: string;
  isFieldsVisible: boolean;
  selectedBrokerCode: string;
  selectedBrokerName: string;
  isBrokerSelected: boolean;
  totalLinesCount: number;
  nullValuesCount:  {index: number, nullCount: number }[];
  irrelevantValueCount: number;
  invalidBrokerCodes: {code: number, index: number }[];
  invalidDates: {code: number, index: number }[];
  invalidData: Record<string, { code: string | number, index: number }[]>;
  fileSize: string;
  fileName: string;
  // duplicatedLotNos: Record<string, number[]> | null;
  isUploadFailed: boolean;
  file: any;
  isUploaded: boolean;
  inputSalesCode: string | null;
  uploadCatalogueResponse: {
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
  };
  isError: boolean;
  isSuccess: boolean;
  errorAlertOpen: boolean;
  isUploadButtonClick: boolean;
  catalogueSerialNo: string;
  errorDialogMessage: string;
  successDialogMessage: string;
  csvData: string[];
  isSuccessfullyUploaded: boolean;
  textFieldFormatResponse: ResponseState<TextFile[]>
  textFileCodesResponse: ResponseState<TextFileCodes[]>
}

const initialState: UploadCatalogueSliceState = {
  searchBy: "",
  isFieldsVisible: false,
  selectedBrokerCode: "",
  selectedBrokerName: "",
  isBrokerSelected: false,
  totalLinesCount: 0,
  nullValuesCount: [],
  irrelevantValueCount: 0,
  invalidBrokerCodes: [],
  invalidData: {} as Record<string, { code: string | number, index: number }[]>,
  invalidDates: [],
  fileSize: "",
  fileName: "",
  // duplicatedLotNos: null,
  isUploadFailed: false,
  file: "",
  isUploaded: false,
  inputSalesCode: null,
  uploadCatalogueResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    message: undefined,
  },
  isError: false,
  isSuccess: false,
  errorAlertOpen: false,
  isUploadButtonClick: false,
  catalogueSerialNo: "",
  errorDialogMessage: "",
  successDialogMessage: "",
  csvData: [],
  isSuccessfullyUploaded: false,
  textFieldFormatResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    data: []
  },
  textFileCodesResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  }
};

export { initialState as initialUploadCatalogueSliceState };

export const uploadCatalogueSlice = createSlice({
  name: "uploadCatalogue",
  initialState,
  reducers: {
    setInvalidData: (state, action: PayloadAction<{ key: string; data: { code: string | number, index: number }[] }>) => {
      state.invalidData[action.payload.key] = action.payload.data;
    },
    resetInvlalidData: (state) => {
      state.invalidData = initialState.invalidData;
    },
    setSearchBy: (state, action: PayloadAction<string>) => {
      state.searchBy = action.payload;
    },
    setIsFieldsVisible: (state, action: PayloadAction<boolean>) => {
      state.isFieldsVisible = action.payload;
    },
    setSelectedBrokerCode: (state, action: PayloadAction<string>) => {
      state.selectedBrokerCode = action.payload;
    },
    setSelectedBrokerName: (state, action: PayloadAction<string>) => {
      state.selectedBrokerName = action.payload;
    },
    setIsBrokerSelected: (state, action: PayloadAction<boolean>) => {
      state.isBrokerSelected = action.payload;
    },
    setTotalLinesCount: (state, action: PayloadAction<number>) => {
      state.totalLinesCount = action.payload;
    },
    setNullValuesCount: (state, action) => {
      state.nullValuesCount = action.payload;
    },
    setIrrelevantValueCount: (state, action: PayloadAction<number>) => {
      state.irrelevantValueCount = action.payload;
    },
    setInvalidBrokerCodes: (state, action) => {
      state.invalidBrokerCodes = action.payload;
    },
    setInvalidDates: (state, action) => {
      state.invalidDates = action.payload;
    },
    setFileSize: (state, action: PayloadAction<string>) => {
      state.fileSize = action.payload;
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload;
    },
    // setDuplicatedLotNos: (state, action) => {
    //   state.duplicatedLotNos = action.payload;
    // },
    setIsUploadFailed: (state, action: PayloadAction<boolean>) => {
      state.isUploadFailed = action.payload;
    },
    setFile: (state, action: PayloadAction<any>) => {
      state.file = action.payload;
    },
    setIsUploaded: (state, action: PayloadAction<boolean>) => {
      state.isUploaded = action.payload;
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setIsSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    setErrorAlertOpen: (state, action: PayloadAction<boolean>) => {
      state.errorAlertOpen = action.payload;
    },
    setIsUploadButtonClick: (state, action: PayloadAction<boolean>) => {
      state.isUploadButtonClick = action.payload;
    },
    setCatalogueSerialNo: (state, action: PayloadAction<string>) => {
      state.catalogueSerialNo = action.payload;
    },
    setErrorDialogMessage: (state, action: PayloadAction<string>) => {
      state.errorDialogMessage = action.payload;
    },
    setSuccessDialogMessage: (state, action: PayloadAction<string>) => {
      state.successDialogMessage = action.payload;
    },
    setCsvData: (state, action: PayloadAction<string[]>) => {
      state.csvData = action.payload;
    },
    setIsSuccessfullyUploaded: (state, action: PayloadAction<boolean>) => {
      state.isSuccessfullyUploaded = action.payload;
    },
    resetUploadResponse: (state) => {
      state.uploadCatalogueResponse.isSuccess =
        initialState.uploadCatalogueResponse.isSuccess;
      state.searchBy = initialState.searchBy;
      state.isFieldsVisible = initialState.isFieldsVisible;
      state.selectedBrokerCode = initialState.selectedBrokerCode;
      state.selectedBrokerName = initialState.selectedBrokerName;
      state.isBrokerSelected = initialState.isBrokerSelected;
      state.totalLinesCount = initialState.totalLinesCount;
      state.nullValuesCount = initialState.nullValuesCount;
      state.fileSize = initialState.fileSize;
      // state.duplicatedLotNos = initialState.duplicatedLotNos;
      state.isUploadFailed = initialState.isUploadFailed;
      state.file = initialState.file;
      state.isUploaded = initialState.isUploaded;
      state.invalidBrokerCodes = initialState.invalidBrokerCodes;
      state.invalidData = initialState.invalidData;
      state.invalidDates = initialState.invalidDates;
    },
    resetUploadErrorResponse: (state) => {
      state.uploadCatalogueResponse.hasError =
        initialState.uploadCatalogueResponse.hasError;
    },
    setInputSalesCode: (state, action: PayloadAction<string>) => {
      state.inputSalesCode = action.payload;
    },
    resetFileFormat: (state) => {
      state.textFieldFormatResponse = initialState.textFieldFormatResponse
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCatalogue.pending, (state) => {
        state.uploadCatalogueResponse.isLoading = true;
      })
      .addCase(uploadCatalogue.fulfilled, (state, action) => {
        state.uploadCatalogueResponse.isLoading = false;
        state.uploadCatalogueResponse.hasError = false;
        state.uploadCatalogueResponse.isSuccess = true;
        state.uploadCatalogueResponse.message = action.payload.message;
      })
      .addCase(uploadCatalogue.rejected, (state, action) => {
        state.uploadCatalogueResponse.isLoading = false;
        state.uploadCatalogueResponse.hasError = true;
        state.uploadCatalogueResponse.message = action.error.message;
      })

      // getTextFileFormatByBrokerCode
      .addCase(getTextFileFormatByBrokerCode.pending, (state) => {
        state.textFieldFormatResponse.isLoading = true;
      })
      .addCase(getTextFileFormatByBrokerCode.fulfilled, (state, action) => {
        state.textFieldFormatResponse.isLoading = false;
        state.textFieldFormatResponse.hasError = false;
        state.textFieldFormatResponse.isSuccess = true;
        state.textFieldFormatResponse.data = action.payload;
      })
      .addCase(getTextFileFormatByBrokerCode.rejected, (state, action) => {
        state.textFieldFormatResponse.isLoading = false;
        state.textFieldFormatResponse.hasError = true;
        state.textFieldFormatResponse.message = action.error.message;
      })

      // get text file codes
      .addCase(getTextFileCodesByBrokerCode.pending, (state) => {
        state.textFileCodesResponse.isLoading = true;

      })
      .addCase(getTextFileCodesByBrokerCode.fulfilled, (state, action) => {
        state.textFileCodesResponse.data = action.payload;
        state.textFileCodesResponse.isLoading = false;
        state.textFileCodesResponse.isSuccess = true;
      })
      .addCase(getTextFileCodesByBrokerCode.rejected, (state,action) => {
        state.textFileCodesResponse.hasError = true;
        state.textFileCodesResponse.message = action.error.message;
      })
  },
});

export const {
  setSearchBy,
  setIsFieldsVisible,
  setSelectedBrokerCode,
  setSelectedBrokerName,
  setIsBrokerSelected,
  setTotalLinesCount,
  setNullValuesCount,
  setIrrelevantValueCount,
  setInvalidBrokerCodes,
  setInvalidDates,
  setFileSize,
  setFileName,
  // setDuplicatedLotNos,
  setIsUploadFailed,
  setFile,
  setIsUploaded,
  setIsError,
  setIsSuccess,
  resetUploadResponse,
  setErrorAlertOpen,
  setIsUploadButtonClick,
  setCatalogueSerialNo,
  setErrorDialogMessage,
  setSuccessDialogMessage,
  setCsvData,
  setIsSuccessfullyUploaded,
  resetUploadErrorResponse,
  setInvalidData,
  resetInvlalidData,
  setInputSalesCode,
  resetFileFormat
} = uploadCatalogueSlice.actions;

export default uploadCatalogueSlice.reducer;
