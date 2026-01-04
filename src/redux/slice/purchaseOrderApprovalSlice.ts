import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, APISuccessMessage, Broker, GetTeaLotDetailsRequest, LotForm, ResponseState, TeaLot } from "@/interfaces";
import { GetPurchaseOrderListRequest, PurchaseOrder } from "@/interfaces/purchaseOrder";
import { approvePO, getBrokerList, getMasterData, getPurchaseOrderApprovalList, getTeaLotDetails, rejectPO } from "../action/purchaseOrderApprovalsAction";
import { MasterData, TeaLotById } from "@/interfaces/teaLotById";
import { FORM_VALIDATOR_TYPES, formFieldValidator } from "@/utill/common/formValidator/main";


export interface PurchaseOrderApprovalsSliceState {
  purchaseOrderListResponse:ResponseState<APIGetResponse<PurchaseOrder>>
  purchaseOrderListRequest: GetPurchaseOrderListRequest
  selectedPurchaseOrder: PurchaseOrder | null
  selectedLot: TeaLot | null
  selectedLotDetail: ResponseState<TeaLotById | undefined>
  teaLotDetailRequest: GetTeaLotDetailsRequest
  teaLotDetailResponse: TeaLotById | null
  rejectReason: string | null
  rejectPOResponse: ResponseState<APISuccessMessage | undefined>
  approvePOResponse: ResponseState<APISuccessMessage | undefined>
  lotDetailForm: LotForm
  masterData: ResponseState<MasterData>
  brokerListReponse: ResponseState<Broker[]>
}
export const initialLotForm: LotForm = {
  lotNo: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
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
    isRequired: false,
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
    isRequired: false,
    disable: false,
    error: undefined
  },
  weightPerBag: {
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
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
    isRequired: false,
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
    type: FORM_VALIDATOR_TYPES.OBJECT,
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
const initialState: PurchaseOrderApprovalsSliceState = {
  lotDetailForm: initialLotForm,
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
    getAll: false,
  },
  selectedPurchaseOrder: null,
  selectedLot: null,
  selectedLotDetail: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
  teaLotDetailRequest: { customerId: 1},
  teaLotDetailResponse: null,
  rejectReason: null,
  rejectPOResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
  approvePOResponse: {
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: undefined
  },
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
  brokerListReponse:{
    isLoading: false,
    hasError: false,
    isSuccess: false,
    data: []
  }
};

export { initialState as initialPurchaseOrderSliceState };

export const purchaseOrderApprovalsSlice = createSlice({
  name: "purchaseOrderApprovalsSlice",
  initialState,
  reducers: {
     setPurchaseOrderSearchText: (state, action: PayloadAction<string>) => {
        state.purchaseOrderListRequest.search = action.payload;
      },
      setPurchaseOrderStatus: (state, action: PayloadAction<string | undefined>) => {
        state.purchaseOrderListRequest.approvalStatus = action.payload;
      },
      setBroker: (state, action: PayloadAction<string | undefined>) => {
        state.purchaseOrderListRequest.brokerCode = action.payload;
      },
      setPurchaseOrderGetAll: (state, action: PayloadAction<boolean | undefined>) => {
        state.purchaseOrderListRequest.getAll = action.payload;
      },
      setPurchaseOrderCurrentPage:(state, action: PayloadAction<number>) => {
        state.purchaseOrderListRequest.page = action.payload;
      },
      setPurchaseOrderLimit:(state, action: PayloadAction<number>) => {
        state.purchaseOrderListRequest.limit = action.payload;
      },
      setSelectedPurchaseOrder:(state, action: PayloadAction<PurchaseOrder | null>) => {
        state.selectedPurchaseOrder = action.payload;
      },
      setSelectedTeaLot:(state, action: PayloadAction<TeaLot | null>) => {
        state.selectedLot = action.payload;
      },
      setRejectReason:(state, action: PayloadAction<string | null>) => {
        state.rejectReason = action.payload;
      },
      resetApproveResponse:(state ) => {
        state.approvePOResponse = initialState.approvePOResponse;
      },
      resetRejectResponse:(state ) => {
        state.rejectPOResponse = initialState.rejectPOResponse;

      },
      resetPurchaseOrderFilter:(state) => {
        state.purchaseOrderListRequest = initialState.purchaseOrderListRequest;
      },
  },
  extraReducers: (builder) => {
    builder

      //get all purchase orders
      .addCase(getPurchaseOrderApprovalList.pending, (state) => {
        state.purchaseOrderListResponse.isLoading = true;
        state.purchaseOrderListResponse.data.data = [];
      })
      .addCase(getPurchaseOrderApprovalList.fulfilled, (state, action) => {
        state.purchaseOrderListResponse.isLoading = false;
        state.purchaseOrderListResponse.isSuccess = true;
        state.purchaseOrderListResponse.data = action.payload;
        // state.purchaseOrderListResponse.data.currentPage = action.payload.currentPage;
        // state.purchaseOrderListResponse.data.totalCount = action.payload.totalCount;
        // state.purchaseOrderListResponse.data.totalPages = action.payload.totalPages;
      })
      .addCase(getPurchaseOrderApprovalList.rejected, (state, action) => {
        state.purchaseOrderListResponse.isLoading = false;
        state.purchaseOrderListResponse.hasError = true;
        state.purchaseOrderListResponse.message = action.error.message;
      })

      //approve purchase order
      .addCase(approvePO.pending, (state) => {
        state.approvePOResponse.isLoading = true;
      })
      .addCase(approvePO.fulfilled, (state, action) => {
        state.approvePOResponse.isLoading = false;
        state.approvePOResponse.isSuccess = true;
        state.approvePOResponse.data = action.payload;
      })
      .addCase(approvePO.rejected, (state, action) => {
        state.approvePOResponse.isLoading = false;
        state.approvePOResponse.hasError = true;
        state.approvePOResponse.message = action.error.message;
      })

      //reject purchase order
      .addCase(rejectPO.pending, (state) => {
        state.rejectPOResponse.isLoading = true;
      })
      .addCase(rejectPO.fulfilled, (state, action) => {
        state.rejectPOResponse.isLoading = false;
        state.rejectPOResponse.isSuccess = true;
        state.rejectPOResponse.data = action.payload;
      })
      .addCase(rejectPO.rejected, (state, action) => {
        state.rejectPOResponse.isLoading = false;
        state.rejectPOResponse.hasError = true;
        state.rejectPOResponse.message = action.error.message;
      })

      //get tea lot detail
      .addCase(getTeaLotDetails.pending, (state) => {
        state.selectedLotDetail.isLoading = true;
      })
      .addCase(getTeaLotDetails.fulfilled, (state, action) => {
        state.selectedLotDetail.isLoading = false;
        state.selectedLotDetail.isSuccess = true;
        state.selectedLotDetail.data = action.payload;
        if(action.payload){
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
        state.masterData.isLoading = true;
       })
       .addCase(getMasterData.fulfilled, (state, action) => {
         state.masterData.data = action.payload;
         state.masterData.isLoading = false;
         state.masterData.isSuccess = true;
       })
       .addCase(getMasterData.rejected, (state) => {
         state.masterData.hasError = true;
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
    setRejectReason,
    resetRejectResponse,
    resetApproveResponse,
    setBroker,
    resetPurchaseOrderFilter
  } = purchaseOrderApprovalsSlice.actions;

export default purchaseOrderApprovalsSlice.reducer;
