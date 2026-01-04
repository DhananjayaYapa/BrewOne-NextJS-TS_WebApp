import {
  addBuyingPlan,
  cancelBuyingPlan,
  releasePO,
} from "./../action/createPurchaseOrderAction";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createPurchaseOrder } from "../action/createPurchaseOrderAction";
import { release } from "os";

export interface CreatePurchaseOrderSliceState {
  isError: boolean;
  isSuccess: boolean;
  errorAlertOpen: boolean;
  errorDialogMessage: string;
  successDialogMessage: {
    message: string | undefined;
    purchaseOrderNumber: number | undefined;
  };
  isAddToBuyingPlanClicked: boolean;
  isRemoveBuyingPlanClicked: boolean;
  isGeneratePO: boolean;
  selectedPurchaseOrderId: number | null;
  isFilterChecked: boolean;
  releasePurchaseOrderResponse:{
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
    purchaseOrderNumber: number | undefined;
  }
  createPurchaseOrderResponse: {
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
    purchaseOrderNumber: number | undefined;
  };
  addBuyingPlanResponse: {
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
  };
  cancelBuyingPlanResponse: {
    isLoading: boolean;
    hasError: boolean;
    isSuccess: boolean;
    message: string | undefined;
  };
}

const initialState: CreatePurchaseOrderSliceState = {
  isFilterChecked: false,
  isError: false,
  isSuccess: false,
  errorAlertOpen: false,
  errorDialogMessage: "",
  successDialogMessage: {
    message: "",
    purchaseOrderNumber: undefined,
  },
  isAddToBuyingPlanClicked: false,
  isRemoveBuyingPlanClicked: false,
  isGeneratePO: false,
  selectedPurchaseOrderId: null,
  releasePurchaseOrderResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    message: undefined,
    purchaseOrderNumber: undefined,
  },
  createPurchaseOrderResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    message: undefined,
    purchaseOrderNumber: undefined,
  },
  addBuyingPlanResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    message: undefined,
  },
  cancelBuyingPlanResponse: {
    isLoading: false,
    isSuccess: false,
    hasError: false,
    message: undefined,
  },
};

export { initialState as initialCreatePurchaseOrderSliceState };

export const createPurchaseOrderSlice = createSlice({
  name: "createPurchaseOrder",
  initialState,
  reducers: {
    setIsFilterChecked: (state, action: PayloadAction<boolean>) => {
      state.isFilterChecked = action.payload;
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
    setErrorDialogMessage: (state, action: PayloadAction<string>) => {
      state.errorDialogMessage = action.payload;
    },
    setSuccessDialogMessage: (
      state,
      action: PayloadAction<{ message: string; purchaseOrderNumber?: number }>
    ) => {
      const { message, purchaseOrderNumber } = action.payload;
      state.successDialogMessage = {
        message,
        purchaseOrderNumber:
          purchaseOrderNumber !== undefined ? purchaseOrderNumber : undefined,
      };
    },
    setIsAddToBuyingPlanClicked: (state, action: PayloadAction<boolean>) => {
      state.isAddToBuyingPlanClicked = action.payload;
    },
    setIsRemoveBuyingPlanClicked: (state, action: PayloadAction<boolean>) => {
      state.isRemoveBuyingPlanClicked = action.payload;
    },
    setIsGeneratePO: (state, action: PayloadAction<boolean>) => {
      state.isGeneratePO = action.payload;
    },
    setSelectedPurchaseOrderId: (state, action: PayloadAction<number | null>) => {
      state.selectedPurchaseOrderId = action.payload;
    },
    resetAddBuyingPlanResponse: (state) => {
      state.addBuyingPlanResponse.isSuccess =
        initialState.addBuyingPlanResponse.isSuccess;
      state.addBuyingPlanResponse.hasError =
        initialState.addBuyingPlanResponse.hasError;
    },
    resetCancelBuyingPlanResponse: (state) => {
      state.cancelBuyingPlanResponse.isSuccess =
        initialState.cancelBuyingPlanResponse.isSuccess;
      state.cancelBuyingPlanResponse.hasError =
        initialState.cancelBuyingPlanResponse.hasError;
    },
    resetCreatePurchaseOrderResponse: (state) => {
      state.createPurchaseOrderResponse.isSuccess =
        initialState.createPurchaseOrderResponse.isSuccess;
      state.createPurchaseOrderResponse.hasError =
        initialState.createPurchaseOrderResponse.hasError;
        // state.isFilterChecked = initialState.isFilterChecked;
    },
     resetReleasePurchaseOrderResponse: (state) => {
      state.releasePurchaseOrderResponse.isSuccess =
        initialState.releasePurchaseOrderResponse.isSuccess;
      state.releasePurchaseOrderResponse.hasError =
        initialState.releasePurchaseOrderResponse.hasError;
        state.releasePurchaseOrderResponse =
        initialState.releasePurchaseOrderResponse
        // state.isFilterChecked = initialState.isFilterChecked;
    },
  },
  extraReducers: (builder) => {
    builder

    //release purchase order
      .addCase(releasePO.pending, (state) => {
        state.releasePurchaseOrderResponse.isLoading = true;
      })
      .addCase(releasePO.fulfilled, (state, action) => {
        state.releasePurchaseOrderResponse.isLoading = false;
        state.releasePurchaseOrderResponse.hasError = false;
        state.releasePurchaseOrderResponse.isSuccess = true;
        state.releasePurchaseOrderResponse.message = action.payload.message;
        state.releasePurchaseOrderResponse.purchaseOrderNumber =
          action.payload.purchaseOrderNumber;
      })
      .addCase(releasePO.rejected, (state, action) => {
        state.releasePurchaseOrderResponse.isLoading = false;
        state.releasePurchaseOrderResponse.hasError = true;
        state.releasePurchaseOrderResponse.message = action.error.message;
      })

      //create purchase order
      .addCase(createPurchaseOrder.pending, (state) => {
        state.createPurchaseOrderResponse.isLoading = true;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.createPurchaseOrderResponse.isLoading = false;
        state.createPurchaseOrderResponse.hasError = false;
        state.createPurchaseOrderResponse.isSuccess = true;
        state.createPurchaseOrderResponse.message = action.payload.message;
        state.createPurchaseOrderResponse.purchaseOrderNumber =
          action.payload.purchaseOrderNumber;
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.createPurchaseOrderResponse.isLoading = false;
        state.createPurchaseOrderResponse.hasError = true;
        state.createPurchaseOrderResponse.message = action.error.message;
      })

      //add buying plan
      .addCase(addBuyingPlan.pending, (state) => {
        state.addBuyingPlanResponse.isLoading = true;
      })
      .addCase(addBuyingPlan.fulfilled, (state, action) => {
        state.addBuyingPlanResponse.isLoading = false;
        state.addBuyingPlanResponse.hasError = false;
        state.addBuyingPlanResponse.isSuccess = true;
        state.addBuyingPlanResponse.message = action.payload.message;
      })
      .addCase(addBuyingPlan.rejected, (state, action) => {
        state.addBuyingPlanResponse.isLoading = false;
        state.addBuyingPlanResponse.hasError = true;
        state.addBuyingPlanResponse.message = action.error.message;
      })

      //cancel buying plan
      .addCase(cancelBuyingPlan.pending, (state) => {
        state.cancelBuyingPlanResponse.isLoading = true;
      })
      .addCase(cancelBuyingPlan.fulfilled, (state, action) => {
        state.cancelBuyingPlanResponse.isLoading = false;
        state.cancelBuyingPlanResponse.hasError = false;
        state.cancelBuyingPlanResponse.isSuccess = true;
        state.cancelBuyingPlanResponse.message = action.payload.message;
      })
      .addCase(cancelBuyingPlan.rejected, (state, action) => {
        state.cancelBuyingPlanResponse.isLoading = false;
        state.cancelBuyingPlanResponse.hasError = true;
        state.cancelBuyingPlanResponse.message = action.error.message;
      });
  },
});

export const {
  setIsFilterChecked,
  setIsError,
  setIsSuccess,
  setErrorAlertOpen,
  setErrorDialogMessage,
  setSuccessDialogMessage,
  setIsAddToBuyingPlanClicked,
  setIsRemoveBuyingPlanClicked,
  setIsGeneratePO,
  resetAddBuyingPlanResponse,
  resetCancelBuyingPlanResponse,
  resetCreatePurchaseOrderResponse,
  setSelectedPurchaseOrderId,
  resetReleasePurchaseOrderResponse
} = createPurchaseOrderSlice.actions;

export default createPurchaseOrderSlice.reducer;
