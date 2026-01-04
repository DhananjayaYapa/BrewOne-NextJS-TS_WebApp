import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, APISuccessMessage, Broker, FormIdentifier, GetTeaLotDetailsRequest, LotForm, ResponseState, TeaLot } from "@/interfaces";
import { GetPurchaseOrderListRequest, PurchaseOrder } from "@/interfaces/purchaseOrder";
import { MasterData, TeaLotById } from "@/interfaces/teaLotById";
import { FORM_VALIDATOR_TYPES } from "@/utill/common/formValidator/const";
import { formFieldValidator } from "@/utill/common/formValidator/main";
import { cancelPO, getBrokerList, getMasterData, getPurchaseOrderByID, getPurchaseOrderList, getTeaLotDetails, updateTeaLotDetailsById } from "../action/purchaseOrdersAction";


export interface PurchaseOrdersSliceState {
  purchaseOrderListResponse: ResponseState<APIGetResponse<PurchaseOrder>>
  purchaseOrderListRequest: GetPurchaseOrderListRequest
  selectedPurchaseOrder: PurchaseOrder | null
  selectedLot: TeaLot | null
  selectedLotDetail: ResponseState<TeaLotById | undefined>
  teaLotDetailRequest: GetTeaLotDetailsRequest
  teaLotDetailResponse: TeaLotById | null
  lotDetailForm: LotForm
  masterData: ResponseState<MasterData>
  editingLot: TeaLot | null
  editLotResponse: ResponseState<APISuccessMessage | undefined>
  brokerListReponse: ResponseState<Broker[]>
  cancelPurchaseOrderReponse: ResponseState<APISuccessMessage | undefined>
}
export const initialLotForm: LotForm = {
  lotNo: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: true,
    error: undefined
  },
  boxNo: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: true,
    error: undefined
  },
  statusName: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: true,
    error: undefined
  },
  breakId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  gradeId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  bagCount: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: false,
    error: undefined
  },
  weightPerBag: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: false,
    error: undefined
  },
  estateId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  estateCode: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  estateName: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  standardId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  purchaseOrderNumber: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: true,
    error: undefined
  },
  chestTypeId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  sackTypeId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  netQuantity: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: true,
    error: undefined
  },
  storeAddress: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  buyer: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  allowance: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  elevationId: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  sampleCount: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  price: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: false,
    error: undefined
  },
  deliveryDatesCount: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  itemCode: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: false,
    error: undefined
  },
  value: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: true,
    error: undefined
  },
  invoiceNo: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  postingDate: {
    value: new Date(),
    type: FORM_VALIDATOR_TYPES.DATE,
    isRequired: false,
    disable: false,
    error: undefined
  },
  remarks: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  paymentType: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  contractNumber: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
}
const initialState: PurchaseOrdersSliceState = {
  purchaseOrderListResponse: {
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
  purchaseOrderListRequest: {
    page: 1,
    limit: 10,
  },
  selectedPurchaseOrder: null,
  selectedLot: null,
  selectedLotDetail: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
  teaLotDetailRequest: { customerId: 1 },
  teaLotDetailResponse: null,
  lotDetailForm: initialLotForm,
  masterData: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      break: [],
      chestType: [],
      elevation: [],
      itemDetail: [],
      sackType: [],
      standard: [],
      grade: [],
      // estate: [],
      paymentType: []
    }
  },
  editingLot: null,
  editLotResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: {
      message: ""
    }
  },
  brokerListReponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  },
  cancelPurchaseOrderReponse:{
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  }
};

export { initialState as initialPurchaseOrderSliceState };

export const purchaseOrdersSlice = createSlice({
  name: "purchaseOrdersSlice",
  initialState,
  reducers: {
    setPurchaseOrderSearchText: (state, action: PayloadAction<string>) => {
      state.purchaseOrderListRequest.search = action.payload;
    },
    setPurchaseOrderStatus: (state, action: PayloadAction<string | undefined>) => {
      state.purchaseOrderListRequest.approvalStatus = action.payload;
    },
    setPurchaseOrderGetAll: (state, action: PayloadAction<boolean | undefined>) => {
      state.purchaseOrderListRequest.getAll = action.payload;
    },
    setPurchaseOrderCurrentPage: (state, action: PayloadAction<number>) => {
      state.purchaseOrderListRequest.page = action.payload;
    },
    setPurchaseOrderLimit: (state, action: PayloadAction<number>) => {
      state.purchaseOrderListRequest.limit = action.payload;
    },
    setSelectedPurchaseOrder: (state, action: PayloadAction<PurchaseOrder | null>) => {
      state.selectedPurchaseOrder = action.payload;
    },
    setSelectedTeaLot: (state, action: PayloadAction<TeaLot | null>) => {
      state.selectedLot = action.payload;
    },
    setEditingLot: (state, action) => {
      state.editingLot = action.payload;
    },
    resetEditTeaLotResponse: (state) => {
      state.editLotResponse = initialState.editLotResponse;
    },
    setLotFormData: (state, action: PayloadAction<FormIdentifier<string>>) => {

      const fieldName = action.payload.name as keyof typeof state.lotDetailForm;

      const [validatedFormField] = formFieldValidator<string>({
        ...state.lotDetailForm[fieldName],
        value: action.payload.value,
      });
      state.lotDetailForm[fieldName] = validatedFormField;
    },
    setBroker: (state, action: PayloadAction<string | undefined>) => {
      state.purchaseOrderListRequest.brokerCode = action.payload;
    },
    resetPurchaseOrderFilter: (state) => {
      state.purchaseOrderListRequest = initialState.purchaseOrderListRequest;
    },
    resetCancelPurchaseOrderResponse: (state) => {
      state.cancelPurchaseOrderReponse = initialState.cancelPurchaseOrderReponse;
    },
  },
  extraReducers: (builder) => {
    builder

      //get all purchase orders
      .addCase(getPurchaseOrderList.pending, (state) => {
        state.purchaseOrderListResponse.isLoading = true;
        state.purchaseOrderListResponse.data.data = [];
      })
      .addCase(getPurchaseOrderList.fulfilled, (state, action) => {
        state.purchaseOrderListResponse.isLoading = false;
        state.purchaseOrderListResponse.isSuccess = true;
        state.purchaseOrderListResponse.data.data = action.payload.data;
        state.purchaseOrderListResponse.data.currentPage = action.payload.currentPage;
        state.purchaseOrderListResponse.data.totalCount = action.payload.totalCount;
        state.purchaseOrderListResponse.data.totalPages = action.payload.totalPages;
      })
      .addCase(getPurchaseOrderList.rejected, (state, action) => {
        state.purchaseOrderListResponse.isLoading = false;
        state.purchaseOrderListResponse.hasError = true;
        state.purchaseOrderListResponse.message = action.error.message;
      })


      //get tea lot detail
      .addCase(getTeaLotDetails.pending, (state) => {
        state.selectedLotDetail.isLoading = true;
      })
      .addCase(getTeaLotDetails.fulfilled, (state, action) => {
        state.selectedLotDetail.isLoading = false;
        state.selectedLotDetail.isSuccess = true;
        state.selectedLotDetail.data = action.payload;

        const lotObj = { ...state.lotDetailForm };
        if (action.payload) {
          type TeaLotByIdKeys = keyof TeaLotById;

          const lotObj = { ...state.lotDetailForm };

          (Object.keys(action.payload) as TeaLotByIdKeys[]).forEach((key) => {

            const fieldName = key as keyof typeof state.lotDetailForm;

            const [validatedFormField] = formFieldValidator<string>({
              ...state.lotDetailForm[fieldName],
              value: action.payload && action.payload[key]?.toString(),
            });

            state.lotDetailForm[fieldName] = validatedFormField;
          });
        }
      })
      .addCase(getTeaLotDetails.rejected, (state, action) => {
        state.selectedLotDetail.isLoading = false;
        state.selectedLotDetail.hasError = true;
        state.selectedLotDetail.message = action.error.message;
      })

      // get masterData
      .addCase(getMasterData.pending, (state) => {

      })
      .addCase(getMasterData.fulfilled, (state, action) => {
        state.masterData.data = action.payload;
        state.masterData.isLoading = false;
        state.masterData.isSuccess = true;
      })
      .addCase(getMasterData.rejected, (state) => {
        state.masterData.hasError = true;
      })

      //edit tea lot
      .addCase(updateTeaLotDetailsById.pending, (state) => {
        state.editLotResponse.isLoading = false;

      })
      .addCase(updateTeaLotDetailsById.fulfilled, (state, action) => {
        state.editLotResponse.data = action.payload || undefined;
        state.editLotResponse.isLoading = false;
        state.editLotResponse.isSuccess = true;
      })
      .addCase(updateTeaLotDetailsById.rejected, (state, action) => {
        state.editLotResponse.hasError = true;
        state.editLotResponse.message = action.error.message;
      })

      // get broker list
      .addCase(getBrokerList.pending, (state) => {
        state.brokerListReponse.isLoading = true;
      })
      .addCase(getBrokerList.fulfilled, (state, action) => {
        state.brokerListReponse.data = action.payload;
        state.brokerListReponse.isLoading = false;
        state.brokerListReponse.isSuccess = true;
      })
      .addCase(getBrokerList.rejected, (state) => {
        state.brokerListReponse.hasError = true;
      })

       // cancel PO
      .addCase(cancelPO.pending, (state) => {
        state.cancelPurchaseOrderReponse.isLoading = true;
      })
      .addCase(cancelPO.fulfilled, (state, action) => {
        state.cancelPurchaseOrderReponse.data = action.payload;
        state.cancelPurchaseOrderReponse.isLoading = false;
        state.cancelPurchaseOrderReponse.isSuccess = true;
      })
      .addCase(cancelPO.rejected, (state,action) => {
        state.cancelPurchaseOrderReponse.hasError = true;
        state.cancelPurchaseOrderReponse.message = action.error.message
      })

      // get PO by id
      .addCase(getPurchaseOrderByID.pending, (state) => {
        // state.cancelPurchaseOrderReponse.isLoading = true;
      })
      .addCase(getPurchaseOrderByID.fulfilled, (state, action) => {
        state.selectedPurchaseOrder = action.payload || null;
        // state.cancelPurchaseOrderReponse.isLoading = false;
        // state.cancelPurchaseOrderReponse.isSuccess = true;
      })
      .addCase(getPurchaseOrderByID.rejected, (state,action) => {
        // state.cancelPurchaseOrderReponse.hasError = true;
        // state.cancelPurchaseOrderReponse.message = action.error.message
      })
  },
});

export const {
  setPurchaseOrderSearchText,
  setPurchaseOrderCurrentPage,
  setPurchaseOrderLimit,
  setPurchaseOrderStatus,
  setPurchaseOrderGetAll,
  setSelectedTeaLot,
  setSelectedPurchaseOrder,
  setLotFormData,
  setEditingLot,
  resetEditTeaLotResponse,
  setBroker,
  resetPurchaseOrderFilter,
  resetCancelPurchaseOrderResponse
} = purchaseOrdersSlice.actions;

export default purchaseOrdersSlice.reducer;
