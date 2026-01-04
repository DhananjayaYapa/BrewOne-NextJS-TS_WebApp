import { PayloadAction, WritableDraft, createSlice } from "@reduxjs/toolkit";
import {
  getCatalogueStatusList,
  getDeliveryOrderMasterData,
  getDeliveryOrderStatusList,
  getDeliverySalesOrderMasterData,
} from "../action/dataAction";
import {
  CatalogueStatus,
  DeliveryOrderMasterData,
  DeliveryOrderStatus,
  DeliverySalesOrderMasterData,
  Driver,
  FieldValue,
  ResponseState,
  SalesOrder,
  Vehicle,
  Warehouse,
} from "@/interfaces";

export interface DataSliceState {
  data: {
    catalogueStatusList: CatalogueStatus[];
    deliveryOrderStatusList: DeliveryOrderStatus[];  
    deliveryOrderMasterData: DeliveryOrderMasterData;
    deliverySalesOrderMasterData: WritableDraft<DeliverySalesOrderMasterData>[];
    isLoading: boolean;
    hasError: boolean;
  };
  selectedVehicle?: Vehicle | null;
  selectedDriver?: Driver | null;
  selectedWarehouse?: Warehouse | null;
  selectedSalesOrder?: any | null;
  selectedSalesCode?: DeliverySalesOrderMasterData | null;  
  selectedSalesDate: Date | undefined;

}

const initialState: DataSliceState = {
  data: {
    catalogueStatusList: [],
    deliveryOrderStatusList: [],
    deliveryOrderMasterData: {
      vehicle: [],
      driver: [],
      warehouse: [],
    },
    deliverySalesOrderMasterData:[],
    isLoading: false,
    hasError: false,
  },
  selectedVehicle: null,
  selectedDriver: null,
  selectedWarehouse: null,
  selectedSalesOrder: null,
  selectedSalesCode:  null,
  selectedSalesDate: undefined,
};

export { initialState as initialDataSliceState };

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    //selected options
    setSelectedVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.selectedVehicle = action.payload;
    },
    setSelectedDriver: (state, action: PayloadAction<Driver | null>) => {
      state.selectedDriver = action.payload;
    },
    setSelectedWarehouse: (state, action: PayloadAction<Warehouse | null>) => {
      state.selectedWarehouse = action.payload;
    },
    setSelectedSalesOrder: (state, action: PayloadAction<SalesOrder | null>) => {
      state.selectedSalesOrder = action.payload;
    },
    resetSelectedOptions: (state) => {
      state.selectedDriver = initialState.selectedDriver;
      state.selectedVehicle = initialState.selectedVehicle;
      state.selectedSalesOrder = initialState.selectedSalesOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      // get catalogue status list
      .addCase(getCatalogueStatusList.pending, (state) => {
        state.data.isLoading = true;
        state.data.hasError = false;
      })
      .addCase(getCatalogueStatusList.fulfilled, (state, action) => {
        state.data.catalogueStatusList = action.payload;
        state.data.isLoading = false;
        state.data.hasError = false;
      })
      .addCase(getCatalogueStatusList.rejected, (state) => {
        state.data.isLoading = false;
        state.data.hasError = true;
      })

      // get delivery order status list
      .addCase(getDeliveryOrderStatusList.pending, (state) => {
        state.data.isLoading = true;
        state.data.hasError = false;
      })
      .addCase(getDeliveryOrderStatusList.fulfilled, (state, action) => {
        state.data.deliveryOrderStatusList = action.payload;
        state.data.isLoading = false;
        state.data.hasError = false;
      })
      .addCase(getDeliveryOrderStatusList.rejected, (state) => {
        state.data.isLoading = false;
        state.data.hasError = true;
      })

      // get delivery order status list
      .addCase(getDeliveryOrderMasterData.pending, (state) => {
        state.data.isLoading = true;
        state.data.hasError = false;
      })
      .addCase(getDeliveryOrderMasterData.fulfilled, (state, action) => {
        state.data.deliveryOrderMasterData = action.payload;
        state.data.isLoading = false;
        state.data.hasError = false;
      })
      .addCase(getDeliveryOrderMasterData.rejected, (state) => {
        state.data.isLoading = false;
        state.data.hasError = true;
      })

      // get sales codes list
       .addCase(getDeliverySalesOrderMasterData.pending, (state) => {
        state.data.isLoading = true;
        state.data.hasError = false;
      })
      .addCase(getDeliverySalesOrderMasterData.fulfilled, (state, action) => {
        state.data.deliverySalesOrderMasterData = Array.isArray(action.payload) ? action.payload : [action.payload];
        state.data.isLoading = false;
        state.data.hasError = false;
      })
      .addCase(getDeliverySalesOrderMasterData.rejected, (state) => {
        state.data.isLoading = false;
        state.data.hasError = true;
      });
  },
});

export const {
  setSelectedVehicle,
  setSelectedDriver,
  setSelectedWarehouse,
  setSelectedSalesOrder,
  resetSelectedOptions,
} = dataSlice.actions;

export default dataSlice.reducer;
