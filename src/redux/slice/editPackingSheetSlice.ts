  import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  BOMItemDetail, FormIdentifier, ResponseState, SalesOrder, Warehouse, WarehouseStock } from "@/interfaces";
import { FORM_VALIDATOR_TYPES } from "@/utill/common/formValidator/const";
import { formFieldValidator } from "@/utill/common/formValidator/main";
import { ProductItem, SelectedWarehouseStock, BlendWarehouse } from "@/interfaces/salesOrder";
import { PackingSheet } from "@/interfaces/packingSheet";
import { editPackingSheet, getPackingSheetByDetail, getToWarehousesList, getWarehousesByItemCodes, releasePackingSheet } from "../action/editPackingSheetAction";
  
  export interface EditPackingSheetSliceState {
    selectedPackingSheet: PackingSheet | null;
    getPackingSheetDetailResponse:ResponseState<any | null>
    selectedSalesOrder: SalesOrder | null;
    selectedProduct: ProductItem | null;
    selectedPackingItem: any | null;
    selectedPackingDetail: any | null
    editPackingSheetHeaderForm: any
    BOMItems:BOMItemDetail | null
    selectedWarehouses: SelectedWarehouseStock[]
    editPackingSheetResponse:ResponseState<string | undefined>
    releasePackingSheetResponse:ResponseState<any | null>
    isEdit: boolean;
    isRelease: boolean;
    isView: boolean;

    packingDetails: any | null;
    BOMDetails: BOMItemDetail | null;
    warehouseListResponse:ResponseState<WarehouseStock[]>
    toWarehouseListResponse:ResponseState<BlendWarehouse[]>

  }

  export const initialPackingSheetHeaderForm: any = {
    salesOrderId: {
      value: null,
      type: FORM_VALIDATOR_TYPES.OBJECT,
      isRequired: false,
      disable: false,
    },
    productItemCode: {
      value: null,
      type: FORM_VALIDATOR_TYPES.OBJECT,
      isRequired: false,
      disable: false,
    },
    packingItemCode:{
      value: null,
      type: FORM_VALIDATOR_TYPES.OBJECT,
      isRequired: false,
      disable: false,
    },
    orderDate: {
      value: null,
      type: FORM_VALIDATOR_TYPES.DATE,
      isRequired: true,
      disable: false,
      errorMessages: {
        required: "Select order date",
      },
    },
    startDate: {
      value: null,
      type: FORM_VALIDATOR_TYPES.DATE,
      isRequired: true,
      disable: false,
      errorMessages: {
        required: "Select start date",
      },
    },
    dueDate: {
      value: null,
      type: FORM_VALIDATOR_TYPES.DATE,
      isRequired: true,
      disable: false,
      errorMessages: {
        required: "Select due date",
      },
    },
    customerCode: {
      value: "",
      type: FORM_VALIDATOR_TYPES.TEXT,
      isRequired: false,
      disable: false,
      validators: {
        maxLength: 255,
      },
      errorMessages: {
        maxLength: 'Character length should be less than 25',
        
      },
    },
    plannedQuantity: {
      value: 0,
      type: FORM_VALIDATOR_TYPES.NUMBER,
      isRequired: true,
      disable: false,
      errorMessages: {
        required: "Enter planned quantity",
      },
    },
    warehouse: {
      value: null,
      type: FORM_VALIDATOR_TYPES.TEXT,
      isRequired: false,
      disable: false,
      errorMessages: {
        required: "Please select a warehouse",
      },
      
    },
  };

  
  const initialState: EditPackingSheetSliceState = {
    selectedPackingSheet: null,
    getPackingSheetDetailResponse: {
      isLoading: false,
      hasError: false,
      isSuccess: false,
      data: null
    },
    selectedSalesOrder: null,
    selectedPackingDetail: null,
    editPackingSheetHeaderForm: initialPackingSheetHeaderForm,
    BOMItems:null,
    selectedProduct: null,
    selectedWarehouses:[],
    isEdit: false,
    isRelease: false,
    isView: false,
    editPackingSheetResponse:{
      isLoading: false,
      hasError: false,
      isSuccess: false,
      data: undefined
    },
    releasePackingSheetResponse:{
      isLoading: false,
      hasError: false,
      isSuccess: false,
      data: null
    },

    warehouseListResponse:{
      isLoading: false,
      hasError: false,
      isSuccess: false,
      data: []
    },
    toWarehouseListResponse:{
      isLoading: false,
      hasError: false,
      isSuccess: false,
      data: []
    },
    packingDetails: null,
    BOMDetails: null,
    
    selectedPackingItem: null
  };
  
  export { initialState as initialEditPackingSheetSliceState };
  
  export const editPackingSheetSlice = createSlice({
    name: "editPackingSheet",
    initialState,
    reducers: {
      setSelectedPackingSheet: (state, action) => {
        state.selectedPackingSheet = action.payload;
      },
      setPackingSheetHeaderFormData: (state, action: PayloadAction<FormIdentifier<string>>) => {

        const fieldName = action.payload.name as keyof typeof state.editPackingSheetHeaderForm;

        const [validatedFormField] = formFieldValidator<string>({
          ...state.editPackingSheetHeaderForm[fieldName],
          value: action.payload.value,
        });
        
        state.editPackingSheetHeaderForm[fieldName] = validatedFormField;
      },
      setSelectedEditWarehouses: (state, action) => {
        state.selectedWarehouses = action.payload;
      }, 
      setIsEdit: (state, action) => {
        state.isEdit = action.payload;
      }, 
      setIsRelease: (state, action) => {
        state.isRelease = action.payload;
      }, 
      setIsView: (state, action) => {
        state.isView = action.payload;
      },   
      resetEditResponse: (state) =>{
        state.editPackingSheetResponse = initialState.editPackingSheetResponse
      },
      resetReleaseResponse: (state) =>{
        state.releasePackingSheetResponse = initialState.releasePackingSheetResponse
      }
    },
    extraReducers: (builder) => {
      builder
  
        //get Packing Sheet By Detail
        .addCase(getPackingSheetByDetail.pending, (state) => {
          state.getPackingSheetDetailResponse.isLoading = true;
        })
        .addCase(getPackingSheetByDetail.fulfilled, (state, action:PayloadAction<any>) => {
          state.getPackingSheetDetailResponse.isLoading = false;
          state.getPackingSheetDetailResponse.isSuccess = true;
          state.getPackingSheetDetailResponse.data =  action.payload;
          const selectedSalesOrder:SalesOrder = {
            salesOrderId: action.payload?.salesOrderId,
            salesOrderEntryId: action.payload?.salesOrderEntryId,
            orderDate: action.payload.orderDate,
            startDate: action.payload.startDate,
            dueDate: action.payload.dueDate,
            customerCode: action.payload.customerCode,
            productItems: [{
              productItemCode: action.payload.packingItemCode,
              salesContractQuantity: action.payload?.salesContractQuantity
            }]
          }
          state.selectedSalesOrder = selectedSalesOrder
          state.selectedProduct ={
            productItemCode: action.payload.packingItemCode,
            salesContractQuantity: action.payload?.salesContractQuantity

          }
          const packingItem : any = {
            type: action.payload.packingItemType,
            code: action.payload.packingItemCode,
            description: action.payload.packingItemDescription,
            plannedQuantity: action.payload.plannedQuantity,
            warehouseCode: action.payload.warehouseCode
          }
          state.selectedPackingItem = packingItem

          const packingDetail: any = {
            salesOrderId: action.payload.salesOrderId,
            productItemCode: action.payload.productItemCode,
            packingItems: [packingItem]
          }
          state.selectedPackingDetail = packingDetail

          const bomItems: BOMItemDetail ={
            itemCode: action.payload.packingItemCode,
            bomItems:action.payload.packingSheetItems
          }
          state.BOMItems = bomItems
        let temp: SelectedWarehouseStock[] =[]
            bomItems.bomItems?.forEach((item) => {
                item.lots.forEach((lot, index) => {
                    temp.push({
                        index: index, // Use the lot's position in its array
                        itemCode: item.code, // Convert item code to lowercase
                        fromWarehouse: { warehouseCode: lot.fromWarehouseCode, lots: []},
                        isToWarehouseRequired:false,
                        selectedLot: {
                          batchId: lot.batchId || "",
                          quantity: lot.quantity,
                          requiredQuantity: lot.quantity,
                        },
                        lotOptions: [],
                        isCollapsed: false,
                        error: "No Error",
                        plannedQuantity: parseFloat((item.basedQuantity * action.payload.plannedQuantity)?.toFixed(3)),
                        remainingQuantity: 0
                    });
                });
            });
            state.selectedWarehouses = temp
        
        })
        .addCase(getPackingSheetByDetail.rejected, (state, action) => {
          state.getPackingSheetDetailResponse.isLoading = false;
          state.getPackingSheetDetailResponse.hasError = true;
          state.getPackingSheetDetailResponse.message = action.error.message;
        })

        


        //get warehouse details
        .addCase(getWarehousesByItemCodes.pending, (state) => {
          state.warehouseListResponse.isLoading = true;
        })
        .addCase(getWarehousesByItemCodes.fulfilled, (state, action) => {
          state.warehouseListResponse.isLoading = false;
          state.warehouseListResponse.isSuccess = true;
          state.warehouseListResponse.data = action.payload;
        })
        .addCase(getWarehousesByItemCodes.rejected, (state, action) => {
          state.warehouseListResponse.isLoading = false;
          state.warehouseListResponse.hasError = true;
          state.warehouseListResponse.message = action.error.message;
        })

        //edit packing sheet
        .addCase(editPackingSheet.pending, (state) => {
          state.editPackingSheetResponse.isLoading = true;
        })
        .addCase(editPackingSheet.fulfilled, (state, action) => {
          state.editPackingSheetResponse.isLoading = false;
          state.editPackingSheetResponse.isSuccess = true;
          state.editPackingSheetResponse.data = action.payload?.message;
        })
        .addCase(editPackingSheet.rejected, (state, action) => {
          state.editPackingSheetResponse.isLoading = false;
          state.editPackingSheetResponse.hasError = true;
          state.editPackingSheetResponse.message = action.error.message;
        })

        //release packing sheet
        .addCase(releasePackingSheet.pending, (state) => {
          state.releasePackingSheetResponse.isLoading = true;
        })
        .addCase(releasePackingSheet.fulfilled, (state, action) => {
          state.releasePackingSheetResponse.isLoading = false;
          state.releasePackingSheetResponse.isSuccess = true;
          state.releasePackingSheetResponse.data = action.payload;
        })
        .addCase(releasePackingSheet.rejected, (state, action) => {
          state.releasePackingSheetResponse.isLoading = false;
          state.releasePackingSheetResponse.hasError = true;
          state.releasePackingSheetResponse.message = action.error.message;
        })

        //get to warehouse list
        .addCase(getToWarehousesList.pending, (state) => {
          state.toWarehouseListResponse.isLoading = true;
        })
        .addCase(getToWarehousesList.fulfilled, (state, action) => {
          state.toWarehouseListResponse.isLoading = false;
          state.toWarehouseListResponse.isSuccess = true;
          const temp: Warehouse[] = action.payload;
          const packingWarehouses: BlendWarehouse[] = temp?.map((warehouse) => ({
            warehouseCode: warehouse.warehouseCode,
            lots: []
          }));
          state.toWarehouseListResponse.data = packingWarehouses
          
        })
        .addCase(getToWarehousesList.rejected, (state, action) => {
          state.toWarehouseListResponse.isLoading = false;
          state.toWarehouseListResponse.hasError = true;
          state.toWarehouseListResponse.message = action.error.message;
        })
  
       
    },
  });
  
  export const {
    setSelectedPackingSheet,
    setSelectedEditWarehouses,
    setIsEdit,
    setIsRelease,
    setIsView,
    setPackingSheetHeaderFormData,
    resetEditResponse,
    resetReleaseResponse,
    } = editPackingSheetSlice.actions;
  
  export default editPackingSheetSlice.reducer;
  