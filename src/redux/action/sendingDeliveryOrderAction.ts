import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { sendingDeliveryOrderService, teaLotManagementService } from "@/service";
import {
  CreateSendingDeliveryOrderRequest,
  GetDeliveryOrderDetailsByIdRequest,
  GetDeliveryOrderDetailsRequest,
  GetTeaLotDetailsRequest,
  UpdateDeliveryOrderActionRequest,
} from "@/interfaces";
import dayjs from "dayjs";

export const getSendingDeliveryOrderDetails = createAsyncThunk(
  "/getSendingDeliveryOrderDetails",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { filterValues, limit, currentPage } = state.deliveryOrder;
    const queryParams: GetDeliveryOrderDetailsRequest = {
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
    const response = await sendingDeliveryOrderService.getSendingDeliveryOrderDetails(
      queryParams
    );
    return response;
  }
);

export const getDeliveryItemsById = createAsyncThunk(
  "/getDeliveryItemsById",
  async (id: number) => {
    
    const response = await sendingDeliveryOrderService.getDeliveryItemsById(
      id
    );
    return response;
  }
);

export const createSendingDeliveryOrder = createAsyncThunk(
  "/createSendingDeliveryOrder",
  async (createDeliveryOrderRequest: CreateSendingDeliveryOrderRequest) => {
    const response = await sendingDeliveryOrderService.createSendingDeliveryOrder(
      createDeliveryOrderRequest
    );
    return response;
  }
);

export const getSendingDeliveryOrderDetailsById = createAsyncThunk(
  "/getSendingDeliveryOrderDetailsById",
  async (id: number, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedLot } = state.deliveryOrder;
    const queryParams: GetDeliveryOrderDetailsByIdRequest = {
      customerId: 1,
    };
    const response = await sendingDeliveryOrderService.getSendingDeliveryOrderDetailsById(
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

export const updateSendingDeliveryOrderAction = createAsyncThunk(
  "/updateSendingDeliveryOrderAction",
  async (
    updateDeliveryOrderActionRequest: UpdateDeliveryOrderActionRequest,
    { getState }
  ) => {
    const state: RootState = getState() as RootState;
    const { selectedLot } = state.deliveryOrder;

    const response = await sendingDeliveryOrderService.updateSendingDeliveryOrderAction(
      selectedLot,
      updateDeliveryOrderActionRequest
    );
    return response;
  }
);
