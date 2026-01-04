import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeaLotById, MasterData, updateTeaLotDetails } from '@/interfaces/teaLotById';
import { getMaterData, getPurchasedTeaLotSummary, getTeaLotDetailsById, updateTeaLotDetailsById } from '../action/teaLotDetailsAction';
import { LotDetailsForm, PurchasedSummary } from "./../../interfaces/teaLot";
import { FORM_VALIDATOR_TYPES } from '@/utill/common/formValidator/const';

export const initialLotDetailsForm: LotDetailsForm = {
  lotNo: {    //textfield - final number
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: true,
    error: undefined
  },
  boxNo: {    //textfield - final text
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: true,
    error: undefined
  },
  statusName: {    //textfield - final text
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: true,
    error: undefined
  },
  breakType: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  grade: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  bagCount: {    //textfield - final NUMBER
    value: null,
    type: FORM_VALIDATOR_TYPES.NUMBER,
    isRequired: true,
    disable: false,
    error: undefined
  },
  weightPerBag: {    //textfield - final NUMBER decimal [final convert to number]
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: false,
    error: undefined
  },
  estateCode: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  estateName: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  standard: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  purchaseOrderNo: {    //textfield - final number
    value: null,
    type: FORM_VALIDATOR_TYPES.NUMBER,
    isRequired: false,
    disable: true,
    error: undefined
  },
  chest: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  sack: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  netQuantity: {    //textfield - number
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: true,
    error: undefined
  },
  storeAddress: {    //textfield - user input
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  buyer: {    //textfield - user input
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  allowance: {    //textfield - final NUMBER decimal [final convert to number]
    value: null,
    type: FORM_VALIDATOR_TYPES.NUMBER,
    isRequired: false,
    disable: false,
    error: undefined,
    errorMessages: {
      max: 'Cannot be greater than net quantity'
    },
  
  },
  elevation: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  sampleCount: {    //textfield - final number
    value: null,
    type: FORM_VALIDATOR_TYPES.NUMBER,
    isRequired: false,
    disable: false,
    error: undefined
  },
  price: {    //textfield - final NUMBER decimal [final convert to number]
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: true,
    disable: false,
    error: undefined
  },
  deliveryDatesCount: {    //textfield - final number
    value: null,
    type: FORM_VALIDATOR_TYPES.NUMBER,
    isRequired: false,
    disable: false,
    error: undefined
  },
  itemType: {    //textfield - final OBJECT
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: true,
    disable: false,
    error: undefined
  },
  valueNumber: {    //textfield - final NUMBER decimal [final convert to number]
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: true,
    error: undefined
  },
  invoiceNo: {    //textfield
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  postingDate: { //datepicker - string
    value: new Date(),
    type: FORM_VALIDATOR_TYPES.DATE,
    isRequired: true,
    disable: false,
    error: undefined
  },
  remarks: {    //textfield
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  contractNumber: {    //textfield
    value: null,
    type: FORM_VALIDATOR_TYPES.TEXT,
    isRequired: false,
    disable: false,
    error: undefined
  },
  paymentType: {    //textfield
    value: null,
    type: FORM_VALIDATOR_TYPES.OBJECT,
    isRequired: true,
    disable: false,
    error: undefined
  },
}

export interface initialStateProps {
  data: TeaLotById, //*GETTING TEA LOT DETAILS BY ID in a Catalogue, MAIN
  isLoading: boolean,  //* state of - GETTING TEA LOT DETAILS BY ID in a Catalogue
  hasError: boolean,  //* error - GETTING TEA LOT DETAILS BY ID in a Catalogue

  selectedLot: number, //* on RowClick this is being set (KEY), don't handle

  masterData: MasterData, // master API DATA
  purchasedSummaryData: { // DASHBOARD
    isLoading: boolean;
    hasError: boolean;
    purchasedSummary: PurchasedSummary;
  }

  isEdit: boolean; // EDIT ACTION
  showEditIcon: boolean; // Edit button show/hide
  isLeaveOn: boolean; //Edit cancel
  editLoading: boolean;
  editResponseData: {
    message: string | undefined,
    hasError: boolean,
    isSuccess: boolean
  },

  lotDetailsForm: LotDetailsForm
  lotDetailsFormPersist: LotDetailsForm

  isChecked: boolean
  isCheckedList: number[]
  dataList: TeaLotById[]

  searchLotValue: string;
}

const initialState: initialStateProps = {
  data: {
    lotId: 0,
    lotNo: '',
    catalogId: 0,
    estateCode: '',
    estateName: '',
    gradeCode: '',
    gradeId: 0,
    bagCount: 0,
    weightPerBag: 0,
    netQuantity: 0,
    deliveryDatesCount: 0,
    boxNo: '',
    itemCode: '',
    itemName: '',
    allowance: 0,
    price: 0,
    value: 0,
    standardId: 0,
    standardName: '',
    buyer: '',
    sampleCount: 0,
    breakId: 0,
    breakName: '',
    elevationId: 0,
    elevationName: '',
    chestTypeId: 0,
    chestTypeName: '',
    sackTypeId: 0,
    sackTypeName: '',
    description: '',
    remarks: '',
    purchaseOrderId: 0,
    purchaseOrderNumber: 0,
    statusId: 0,
    statusName: '',
    postingDate: new Date().toISOString().split('T')[0],
    storeAddress: '',
    deliveryOrderId: '',
    invoiceNo: '',
    paymentTypeId: 0,
    paymentType: '',
    contractNumber: ''
  },
  isLoading: false,
  hasError: false,

  selectedLot: 0, //INITIAL CALL TRIGGERED ON 0th index
  masterData: {
    break: [],
    chestType: [],
    elevation: [],
    itemDetail: [],
    sackType: [],
    standard: [],
    grade: [],
    // estate: [],
    paymentType: []
  },
  purchasedSummaryData: {
    isLoading: false,
    hasError: false,
    purchasedSummary: {
      endDate: '',
      startDate: '',
      totalPurchasedLots: 0,
      lotsByMonth: []
    }
  },

  editLoading: false,
  editResponseData: {
    message: undefined,
    hasError: false,
    isSuccess: false
  },
  isEdit: false,
  showEditIcon: true,
  isLeaveOn: false,
  lotDetailsForm: initialLotDetailsForm,
  lotDetailsFormPersist: initialLotDetailsForm,

  isChecked: false,
  isCheckedList: [],
  dataList: [],
  searchLotValue: ''
};

export const lotDetailsSlice = createSlice({
  name: 'lotDetails',
  initialState,
  reducers: {
    setSearchLotValue: (state, action: PayloadAction<string>) => {
      state.searchLotValue = action.payload
    },
    //WHEN EDIT BUTTON GETS CLICKED, EDIT STATE CHANGES TO TRUE, after save change/cancel back to false
    setIsEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload
    },

    setEditLotForm: (state, action) => {
      state.lotDetailsForm = action.payload
    },

    //EDIT BUTTON ACCESSABILITY
    setShowEditIcon: (state, action: PayloadAction<boolean>) => {
      state.showEditIcon = action.payload
    },

    setIsLeaveOn: (state, action: PayloadAction<boolean>) => {
      state.isLeaveOn = action.payload
    },

    //CALLED ON LotNoLIST
    setLot: (state, action: PayloadAction<number>) => {
      state.selectedLot = action.payload
    },
    resetLot: (state) => {
      state.selectedLot = initialState.selectedLot
    },

    //NEW REDUCERS
    setEditLotFormPersist: (state, action) => {
      state.lotDetailsFormPersist = action.payload;
    },
    validateEditLotForm: (state, action) => {
      state.lotDetailsForm = action.payload;
    },
    resetEditLotForm: (state) => {
      state.lotDetailsForm = initialState.lotDetailsForm
    },
    setDataList: (state, action) => {
      const filteredList = state.dataList.filter((data) => data.lotId !== action.payload)
      state.dataList = filteredList
    },
    setChecked: (state, action) => {
      state.isChecked = action.payload
    },
    setCheckedList: (state, action) => {
      state.isCheckedList = state.isCheckedList.some((lot) => lot === action.payload) ?
        state.isCheckedList.filter((lot) => lot !== action.payload) : [...state.isCheckedList, action.payload]
    },
    setDataListInitial: (state) => {
      state.isCheckedList = initialState.isCheckedList;
      state.dataList = initialState.dataList;
    },
    resetEditResponse: (state) => {
      state.editResponseData = initialState.editResponseData
    }
  },
  extraReducers: (builder) => {
    builder
      // get tea lot details *
      .addCase(getTeaLotDetailsById.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getTeaLotDetailsById.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.hasError = false;

        if (state.isCheckedList.length > 0) {
          const lotExists = state.isCheckedList.includes(action.payload.lotId);
          if (!lotExists) {
            // console.log('first', lotExists)
            state.dataList = state.dataList.filter(lot => lot.lotId !== action.payload.lotId);
          } else {
            // console.log('first 1', lotExists)
            const isNotChecked = state.dataList.find((data) => data.lotId === action.payload.lotId)

            if (!isNotChecked) {
              state.dataList = [...state.dataList, action.payload];
            }
            // if(!state.dataList.includes(action.payload.){

            // })
            // if(state.isCheckedList)
          }
        } else {
          state.dataList = initialState.dataList;
        }
      })
      .addCase(getTeaLotDetailsById.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })

      // get masterData
      .addCase(getMaterData.pending, (state) => {

      })
      .addCase(getMaterData.fulfilled, (state, action) => {
        state.masterData = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getMaterData.rejected, (state) => {

      })

      // update tea lot details
      .addCase(updateTeaLotDetailsById.pending, (state) => {
        state.editLoading = true
      })
      .addCase(updateTeaLotDetailsById.fulfilled, (state, action) => {
        state.editLoading = false
        state.lotDetailsForm = initialState.lotDetailsForm
        state.editResponseData.isSuccess = true
        state.editResponseData.message = action.payload.message
      })
      .addCase(updateTeaLotDetailsById.rejected, (state, action) => {
        state.editLoading = false
        state.editResponseData.hasError = true
        state.editResponseData.message = action.error.message
      })

      //Purchased tea lot summary
      .addCase(getPurchasedTeaLotSummary.pending, (state) => {
        state.purchasedSummaryData.isLoading = true;
        state.purchasedSummaryData.hasError = false;
      })

      .addCase(getPurchasedTeaLotSummary.fulfilled, (state, action) => {
        state.purchasedSummaryData.isLoading = false;
        state.purchasedSummaryData.hasError = false;
        state.purchasedSummaryData.purchasedSummary = action.payload;

      })
      .addCase(getPurchasedTeaLotSummary.rejected, (state) => {
        state.purchasedSummaryData.isLoading = false;
        state.purchasedSummaryData.hasError = true;
      })
  },
});

export const {
  setLot,
  resetLot,
  setIsEdit,
  setShowEditIcon,
  setIsLeaveOn,
  setEditLotForm,
  setEditLotFormPersist,
  validateEditLotForm,
  resetEditLotForm,
  setDataList,
  setChecked,
  setCheckedList,
  setDataListInitial,
  resetEditResponse,
  setSearchLotValue
} = lotDetailsSlice.actions;

export default lotDetailsSlice.reducer;
