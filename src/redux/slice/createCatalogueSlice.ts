import { AddLotFormNewDto, CatalogueTypeList, CreateCatalogueHeaderForm, CreateCatalogueLotForm, CreatedLotDetails, PostHandleHeaderDto } from "@/interfaces";
import { FORM_VALIDATOR_TYPES } from "@/utill/common/formValidator/const";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCatalogue, getCatalogueTypeList } from "../action/createCatalogueAction";

export const initialCatalogueHeaderForm: CreateCatalogueHeaderForm = {
    catalogueType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: true,
        disable: false,
        error: undefined
    },
    brokerCode: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: true,
        disable: false,
        error: undefined
    },
    salesCode: {
        value: null,
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: true,
        disable: true,
        error: undefined,
    },
    salesDate: {
        value:  new Date(),
        type: FORM_VALIDATOR_TYPES.DATE,
        isRequired: true,
        disable: false,
        error: undefined
    }
}

export const initialCatalogueLotForm: CreateCatalogueLotForm = {
    lotNo: {
        value: null,
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: true,
        disable: false,
        error: undefined
    },
    invoiceNo: {
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
    grade: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    noOfBags: {
        value: null,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: true,
        disable: false,
        error: undefined
    },
    chestType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    weightOfBag: {
        value: null,
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: true,
        disable: false,
        error: undefined
    },
    netQuantity: {
        value: null,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: false,
        disable: true,
        error: undefined
    },
    sackType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    breakType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    noOfDeliveryDays: {
        value: null,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: false,
        disable: false,
        error: undefined
    },
    mainBuyer: {
        value: null,
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    elevationType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    allowance: {
        value: null,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: false,
        disable: false,
        error: undefined,
        errorMessages:{
            max: 'Cannot be greater than net quantity'
        }
    },
    standardType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    storeAddress: {
        value: null,
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    itemType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: true,
        disable: false,
        error: undefined
    },
    sampleCount: {
        value: null,
        type: FORM_VALIDATOR_TYPES.NUMBER,
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
    valueNumber: {
        value: null,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: false,
        disable: true,
        error: undefined
    },
    postingDate: {
        value: new Date(),
        type: FORM_VALIDATOR_TYPES.DATE,
        isRequired: true,
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
    contractNo: {
        value: null,
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: false,
        disable: false,
        error: undefined
    },
    paymentType: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: true,
        disable: false,
        error: undefined
    }
}

export interface CreateCatalogueSliceState {
    createCatalogueHeaderForm: CreateCatalogueHeaderForm,
    createCatalogueLotForm: CreateCatalogueLotForm,
    catalogueTypeList: CatalogueTypeList[],
    createdLotDetails: CreatedLotDetails[]
    brokerCode: string,
    typeId: number,
    salesCode: string,
    salesDate: string,
    headerFormState: boolean,
    lotDetails: AddLotFormNewDto[],
    currentPage: number,
    limit: number,
    addALert: boolean,
    editAlert: boolean,
    deleteAlert: boolean,
    catalogueResponseData: {
        message: string | undefined,
        isLoading: boolean,
        hasError: boolean,
        isSuccess: boolean
    },
    isEditForm: boolean,

}

const initialState: CreateCatalogueSliceState = {
    createCatalogueHeaderForm: initialCatalogueHeaderForm,
    createCatalogueLotForm: initialCatalogueLotForm,
    catalogueTypeList: [],
    createdLotDetails: [],
    brokerCode: '',
    typeId: 0,
    salesCode: '',
    salesDate: '',
    headerFormState: false,
    lotDetails: [],
    currentPage: 0,
    limit: 10,
    addALert: false,
    editAlert: false,
    deleteAlert: false,
    catalogueResponseData: {
        message: "",
        isLoading: false,
        hasError: false,
        isSuccess: false
    },
    isEditForm: false,
};

export const createCatalogueSlice = createSlice({
    name: "createCatalogue",
    initialState,
    reducers: {
        setChangeHeaderFields: (state, action) => {
            state.createCatalogueHeaderForm = action.payload;
        },
        setChangeLotFields: (state, action) => {
            state.createCatalogueLotForm = action.payload;
        },
        validateCatalogueHeaderForm: (state, action) => {
            state.createCatalogueHeaderForm = action.payload;
        },
        validateCatalogueLotForm: (state, action) => {
            state.createCatalogueLotForm = action.payload;
        },
        handlePostHeader: (state, action: PayloadAction<PostHandleHeaderDto>) => {
            state.brokerCode = action.payload.brokerCode;
            state.typeId = action.payload.typeId;
            state.salesCode = action.payload.salesCode;
            state.salesDate = action.payload.salesDate
            state.headerFormState = true
        },
        addLotForm: (state, action: PayloadAction<{ data: AddLotFormNewDto }>) => {
            if (state.isEditForm === false) {
                state.lotDetails = [...state.lotDetails, action.payload.data]
                state.addALert = true
            } else {
                const existData = state.lotDetails.filter((lot) => lot.lotNo !== action.payload.data.lotNo)
                state.lotDetails = [...existData, action.payload.data]
                state.editAlert = true
                state.isEditForm = false
            }
        },
        clearLotForm: (state) => {
            state.createCatalogueLotForm = initialState.createCatalogueLotForm;
        },
        deleteLotForm: (state, action) => {
            state.lotDetails = state.lotDetails.filter((lot) => lot.lotNo !== action.payload)
            state.deleteAlert = true

            if (state.isEditForm === true) {
                state.isEditForm = false
                state.createCatalogueLotForm = initialState.createCatalogueLotForm
            }

            if (state.lotDetails.length === 0) {
                state.createCatalogueHeaderForm = initialState.createCatalogueHeaderForm
                state.headerFormState = initialState.headerFormState
            }
        },
        setCreateCatalogueCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        resetCatalogState: (state) => {
            state.createCatalogueHeaderForm = initialState.createCatalogueHeaderForm
            state.createCatalogueLotForm = initialState.createCatalogueLotForm
            state.lotDetails = initialState.lotDetails
            state.brokerCode = initialState.brokerCode
            state.typeId = initialState.typeId
            state.salesCode = initialState.salesCode
            state.salesDate = initialState.salesDate
            state.headerFormState = initialState.headerFormState
        },
        clearAllAlert: (state) => {
            state.addALert = initialState.addALert
            state.deleteAlert = initialState.deleteAlert
            state.editAlert = initialState.editAlert
        },
        resetCatalogueResponse: (state) => {
            state.catalogueResponseData = initialState.catalogueResponseData
        },
        setEditLotForm: (state, action) => {
            state.isEditForm = action.payload
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCatalogueTypeList.fulfilled, (state, action) => {
                state.catalogueTypeList = action.payload;
            })
            .addCase(getCatalogueTypeList.rejected, (state) => {
                state.catalogueTypeList = initialState.catalogueTypeList;
            })
            .addCase(createCatalogue.pending, (state) => {
                state.catalogueResponseData.isLoading = true
            })
            .addCase(createCatalogue.fulfilled, (state, action) => {
                state.catalogueResponseData.isLoading = false
                state.catalogueResponseData.message = action.payload.message
                state.catalogueResponseData.isSuccess = true
            })
            .addCase(createCatalogue.rejected, (state, action) => {
                state.catalogueResponseData.isLoading = false
                state.catalogueResponseData.message = action.error.message
                state.catalogueResponseData.hasError = true
            })
    }
})

export const {
    setChangeHeaderFields,
    setChangeLotFields,
    validateCatalogueHeaderForm,
    validateCatalogueLotForm,
    handlePostHeader,
    addLotForm,
    clearLotForm,
    deleteLotForm,
    setCreateCatalogueCurrentPage,
    resetCatalogState,
    clearAllAlert,
    resetCatalogueResponse,
    setEditLotForm,
    setLimit
} = createCatalogueSlice.actions;

export default createCatalogueSlice.reducer;