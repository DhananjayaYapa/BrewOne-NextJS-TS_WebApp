import { AsyncThunkAction, createAsyncThunk, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { teaLotManagementService } from "@/service";
import { GetTeaLotDetailsRequest } from "@/interfaces";
import { TeaLotById, updateTeaLotDetails } from "@/interfaces/teaLotById";
import { CURRENT_DATE, CUSTOMER_ID, MONTHS } from "@/constant";

export const getTeaLotDetailsById = createAsyncThunk(
  '/getTeaLotDetailsById',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedLot
    } = state.lotDetails;
    const queryParams: GetTeaLotDetailsRequest = {
      customerId: CUSTOMER_ID,
    };
    const response = await teaLotManagementService.getTeaLotDetailsById(selectedLot, queryParams);
    return response;
  },
);

export const updateTeaLotDetailsById = createAsyncThunk(
  'UpdateTeaLotDetailsById',
  async (bodyParams: updateTeaLotDetails, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedLot } = state.lotDetails;
    const response = await teaLotManagementService.updateTeaLotDetailsById(bodyParams, 1, selectedLot);
    return response;
  }

);

export const getMaterData = createAsyncThunk(
  '/getMasterData',
  async (_,) => {

    const response = await teaLotManagementService.getMasterData();

    return response;
  },
);

export const getPurchasedTeaLotSummary = createAsyncThunk(
  '/getPurchasedTeaLotSummary',
  async () => {
    const queryParams: GetTeaLotDetailsRequest = {
      customerId: CUSTOMER_ID,
      date: CURRENT_DATE,
      months: MONTHS
    };

    const response = await teaLotManagementService.getPurchasedTeaLotSummary(queryParams);
    return response;
  },
);
