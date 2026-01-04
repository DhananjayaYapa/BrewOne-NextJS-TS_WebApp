import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { deliveryOrderService, teaLotManagementService } from "@/service";
import {
  CreateDeliveryOrderRequest,
  GetDeliveryOrderDetailsByIdRequest,
  GetDeliveryOrderDetailsRequest,
  GetTeaLotDetailsRequest,
  UpdateDeliveryOrderActionRequest,
} from "@/interfaces";
import dayjs from "dayjs";

export const getDeliveryOrderDetails = createAsyncThunk(
  "/getDeliveryOrderDetails",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { filterValues, limit, currentPage } = state.deliveryOrder;
    const queryParams: GetDeliveryOrderDetailsRequest = {
      customerId: 1,
      limit: limit,
      page: currentPage + 1,
      search: filterValues.searchText,
      fromDate: filterValues.fromDate
        ? dayjs(filterValues.fromDate).format("YYYY-MM-DD")
        : undefined,
      toDate: filterValues.toDate
        ? dayjs(filterValues.toDate).format("YYYY-MM-DD")
        : undefined,
      statusId:
        filterValues.deliveryOrderStatus?.value &&
        filterValues.deliveryOrderStatus?.value?.length > 0
          ? filterValues.deliveryOrderStatus?.value?.map(
              (item) => item.statusId
            )
          : undefined,
    };
    const response = await deliveryOrderService.getDeliveryOrderDetails(
      queryParams
    );
    return response;
  }
);

export const getPurchasedTeaLotDetails = createAsyncThunk(
  "/getPurchasedTeaLotDetails",
  async (
    params: { salesCode?: string; salesDate?: string },
    { getState }
  ) => {
    const state: RootState = getState() as RootState;
    const { limitDO, currentPageDO, tabStatus } = state.deliveryOrder.createDO;

    const queryParams: GetTeaLotDetailsRequest = {
      // customerId: 1,
      page: currentPageDO + 1,
      limit: limitDO,
      statusId: tabStatus,
      catalogStatusId: "1",
      salesCode: params?.salesCode,       
      salesDate: params?.salesDate,        
    };

    const response = await teaLotManagementService.getTeaLotDetails(queryParams);
    return response;
  }
);


export const createDeliveryOrder = createAsyncThunk(
  "/createDeliveryOrder",
  async (createDeliveryOrderRequest: CreateDeliveryOrderRequest) => {
    const response = await deliveryOrderService.createDeliveryOrder(
      createDeliveryOrderRequest
    );
    return response;
  }
);

export const getDeliveryOrderDetailsById = createAsyncThunk(
  "/getDeliveryOrderDetailsById",
  async (id: number, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedLot } = state.deliveryOrder;
    const queryParams: GetDeliveryOrderDetailsByIdRequest = {
      customerId: 1,
    };
    const response = await deliveryOrderService.getDeliveryOrderDetailsById(
      id,
      queryParams
    );
    return response;
  }
);

export const getDOCreatedTeaLotDetails = createAsyncThunk(
  "/getDOCreatedTeaLotDetails",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { limitDO, currentPageDO } = state.deliveryOrder.createDO;
    const { selectedLot } = state.deliveryOrder;

    const queryParams: GetTeaLotDetailsRequest = {
      customerId: 1,
      page: currentPageDO + 1,
      limit: limitDO,
      deliveryOrderId: selectedLot,
    };
    const response = await teaLotManagementService.getTeaLotDetails(
      queryParams
    );
    return response;
  }
);

export const updateDeliveryOrderAction = createAsyncThunk(
  "/updateDeliveryOrderAction",
  async (
    updateDeliveryOrderActionRequest: UpdateDeliveryOrderActionRequest,
    { getState }
  ) => {
    const state: RootState = getState() as RootState;
    const { selectedLot } = state.deliveryOrder;

    const response = await deliveryOrderService.updateDeliveryOrderAction(
      selectedLot,
      updateDeliveryOrderActionRequest
    );
    return response;
  }
);

export const getDeliveryOrderAckReport = createAsyncThunk(
  "/getDeliveryOrderAckReport",
  async (id: number, { getState }) => {
    const response = await deliveryOrderService.getDeliveryOrderAckReport(id);
    return response;
  }
);
