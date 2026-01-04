  import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIGetResponse, Blend, BlendItem, PackingSheetHeaderForm, BOMItem, BOMItemDetail, FormIdentifier, PaginationRequest, ResponseState, SalesOrder, Warehouse, WarehouseStock } from "@/interfaces";
import { createPackingSheet, getPackingDetailBySalesOrderId, getBOMDetailsByPackingItem, } from "../action/packingSheetAction";
import {  getSalesOrderList, getToWarehousesList, getWarehousesByItemCodes } from "../action/createBlendSheetAction";
import { FORM_VALIDATOR_TYPES } from "@/utill/common/formValidator/const";
import { formFieldValidator } from "@/utill/common/formValidator/main";
import { ProductItem, SelectedWarehouseStock, BlendWarehouse } from "@/interfaces/salesOrder";
  
  export interface CreatePackingSheetSliceState {
    packingDetails: Blend | null;
    BOMDetails: BOMItemDetail | null;
    selectedSalesOrder: SalesOrder | null;
    selectedProduct: ProductItem | null;
    selectedPackingItem: BlendItem | null;
    salesOrderListResponse:ResponseState<APIGetResponse<SalesOrder>>
    salesOrderListRequest:PaginationRequest
    packingDetailResponse:ResponseState<any | null>
    BOMItemsResponse:ResponseState<BOMItemDetail | null>
    warehouseListResponse:ResponseState<WarehouseStock[]>
    toWarehouseListResponse:ResponseState<BlendWarehouse[]>
    createPackingSheetResponse:ResponseState<string | undefined>
    // setBOMItemsStockForm: 
    // createPackingSheetResponse:// };
    createPackingSheetHeaderForm: PackingSheetHeaderForm
    selectedWarehouses: SelectedWarehouseStock[]
  }
  const rows:BOMItemDetail = {
    itemCode: "1",
    bomItems:[
    {
      code: "Item Code 1",
      description: "Item Description 1",
      basedQuantity: 100,
      lots: []
    },
    {
      code: "Item Code 2",
      description: "Item Description 2",
      basedQuantity: 200,
      lots:[]
    },
  ]};

  export const initialPackingSheetHeaderForm: PackingSheetHeaderForm = {
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

  
  const initialState: CreatePackingSheetSliceState = {
    salesOrderListRequest:{
      page: 1,
      limit: 20, //this is a fixed limit from SAP check API docs
    },
    salesOrderListResponse: {
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
    packingDetailResponse:{
      isLoading: false,
        hasError: false,
        isSuccess: false,
        data: null
    },
    BOMItemsResponse:{
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
    selectedSalesOrder: null,
    selectedProduct: null,
    createPackingSheetHeaderForm: initialPackingSheetHeaderForm,
    selectedWarehouses:[],
    createPackingSheetResponse:{
      isLoading: false,
      hasError: false,
      isSuccess: false,
      data: undefined
    },
    selectedPackingItem: null
  };
  
  export { initialState as initialCreatePackingSheetSliceState };
  
  export const createPackingSheetSlice = createSlice({
    name: "createPackingSheet",
    initialState,
    reducers: {
      setSalesOrderPage: (state, action) => {
        state.salesOrderListRequest.page = action.payload;
      },
      setSalesOrderSearchKey: (state, action) => {
        state.salesOrderListRequest.search = action.payload;
      },
      setSelectedSalesOrder: (state, action: PayloadAction<SalesOrder | null>) => {
        state.selectedSalesOrder = action.payload;
      },
      setSelectedProduct: (state, action: PayloadAction<ProductItem | null>) => {
        state.selectedProduct = action.payload;
      },
      setSelectedPackingItemCode: (state, action: PayloadAction<BlendItem | null>) => {
        state.selectedPackingItem = action.payload;
      },
      setBOMItemsStockForm: (state, action) => {
        // state.BOMItemsResponse.data = action.payload;
      },     
      setSelectedWarehouses: (state, action) => {
        state.selectedWarehouses = action.payload;
      },   
      setPackingSheetHeaderFormData: (state, action: PayloadAction<FormIdentifier<any>>) => {

        const fieldName = action.payload.name as keyof typeof state.createPackingSheetHeaderForm;

        const [validatedFormField] = formFieldValidator<string>({
          ...state.createPackingSheetHeaderForm[fieldName],
          value: action.payload.value,
        });
        
        state.createPackingSheetHeaderForm[fieldName] = validatedFormField;
        
      },
      resetCreatePackingSheet: (state) =>{
        state.BOMItemsResponse = initialState.BOMItemsResponse
        state.selectedWarehouses = []
      },
      resetCreatePackingResponse: (state) =>{ 
        
        state.createPackingSheetResponse = initialState.createPackingSheetResponse
      },
      // setPackingSheetStockFormData: (state, action: PayloadAction<FormIdentifier>) => {

      //   const fieldName = action.payload.name as keyof typeof state.packingSheetStockForm;

      //   const [validatedFormField] = formFieldValidator<string>({
      //     ...state.packingSheetStockForm[fieldName],
      //     value: action.payload.value,
      //   });
        
      //   state.packingSheetStockForm[fieldName] = validatedFormField;
        
      // },
    },
    extraReducers: (builder) => {
      builder
  
        //get sales order list
        .addCase(getSalesOrderList.pending, (state) => {
          state.salesOrderListResponse.isLoading = true;
        })
        .addCase(getSalesOrderList.fulfilled, (state, action) => {
          state.salesOrderListResponse.isLoading = false;
          state.salesOrderListResponse.isSuccess = true;
          // state.salesOrderListResponse.data.data = state.salesOrderListResponse.data.data.concat(action.payload.data);
          state.salesOrderListResponse.data.currentPage = action.payload.currentPage;
          state.salesOrderListResponse.data.totalCount = action.payload.totalCount;
          state.salesOrderListResponse.data.totalPages = action.payload.totalPages;

          if(state.salesOrderListRequest.search !== "" || state.salesOrderListRequest.search !== undefined){
            state.salesOrderListResponse.data.data = action.payload.data;
          }else{
            state.salesOrderListResponse.data.data = state.salesOrderListResponse.data.data.concat(action.payload.data);
          }
        })
        .addCase(getSalesOrderList.rejected, (state, action) => {
          state.salesOrderListResponse.isLoading = false;
          state.salesOrderListResponse.hasError = true;
          state.salesOrderListResponse.message = action.error.message;
        })

        //get Packing details by sales order Id
        .addCase(getPackingDetailBySalesOrderId.pending, (state) => {
          state.packingDetailResponse.isLoading = true;
        })
        .addCase(getPackingDetailBySalesOrderId.fulfilled, (state, action) => {
          state.packingDetailResponse.isLoading = false;
          state.packingDetailResponse.isSuccess = true;
          state.packingDetailResponse.data = action.payload || null;
        })
        .addCase(getPackingDetailBySalesOrderId.rejected, (state, action) => {
          state.packingDetailResponse.isLoading = false;
          state.packingDetailResponse.hasError = true;
          state.packingDetailResponse.message = action.error.message;
        })

        //get BOM item details by product/Packing item number
        .addCase(getBOMDetailsByPackingItem.pending, (state) => {
          state.BOMItemsResponse.isLoading = true;
        })
        .addCase(getBOMDetailsByPackingItem.fulfilled, (state, action) => {
          state.BOMItemsResponse.isLoading = false;
          state.BOMItemsResponse.isSuccess = true;
          state.BOMItemsResponse.data = action.payload;
        })
        .addCase(getBOMDetailsByPackingItem.rejected, (state, action) => {
          state.BOMItemsResponse.isLoading = false;
          state.BOMItemsResponse.hasError = true;
          state.BOMItemsResponse.message = action.error.message;
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

        //create Packing sheet
        .addCase(createPackingSheet.pending, (state) => {
          state.createPackingSheetResponse.isLoading = true;
        })
        .addCase(createPackingSheet.fulfilled, (state, action) => {
          state.createPackingSheetResponse.isLoading = false;
          state.createPackingSheetResponse.isSuccess = true;
          state.createPackingSheetResponse.data = action.payload?.message;
        })
        .addCase(createPackingSheet.rejected, (state, action) => {
          state.createPackingSheetResponse.isLoading = false;
          state.createPackingSheetResponse.hasError = true;
          state.createPackingSheetResponse.message = action.error.message;
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
    setSalesOrderPage,
    setSelectedSalesOrder,
    setBOMItemsStockForm,
    setPackingSheetHeaderFormData,
    setSelectedProduct,
    setSelectedWarehouses,
    resetCreatePackingSheet,
    setSelectedPackingItemCode,
    setSalesOrderSearchKey,
    resetCreatePackingResponse
    } = createPackingSheetSlice.actions;
  
  export default createPackingSheetSlice.reducer;
  