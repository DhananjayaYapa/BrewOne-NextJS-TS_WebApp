import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  DashboardHistoryRequest,
  LotSummeryAPIRequest,
  TabDetailsRequest,
  TeaLotDetailsSummeryRequest,
} from "@/interfaces";
import { dashBoardService } from "@/service";
import { CUSTOMER_ID, SELECTED_STATUS_IDS } from "@/constant";
import dayjs from "dayjs";

// Timeline
export const getTeaLotHistoryById = createAsyncThunk(
  "/getTeaLotHistoryById",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedRecord } = state.lotHistory;
    const queryParams: DashboardHistoryRequest = {
      customerId: 1,
      teaLotId: selectedRecord ? selectedRecord : 0,
    };
    const response = await dashBoardService.getTeaLotHistoryById(queryParams);
    return response;
  }
);
// Catalog List
export const getCatalogueFileList = createAsyncThunk(
  "/getCatalogueFileList",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;

    const queryParams: TabDetailsRequest = {
      customerId: CUSTOMER_ID,
    };
    const response = await dashBoardService.getCatalogueFileList(queryParams);
    return response;
  }
);

// Table
export const getTeaLotsDetailsSummary = createAsyncThunk(
  "/getTeaLotsDetailsSummary",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedCatalogId, filterValues, limit, currentPage } =
      state.lotHistory;
    const queryParams: TeaLotDetailsSummeryRequest = {
      customerId: CUSTOMER_ID,
      catalogId: selectedCatalogId ? selectedCatalogId : undefined,
      lotNumber: filterValues.lotNumber
        ? filterValues.lotNumber.toString()
        : undefined,
      fromDate: filterValues.startDate
        ? dayjs(filterValues.startDate).format("YYYY-MM-DD")
        : undefined,
      toDate: filterValues.endDate
        ? dayjs(filterValues.endDate).format("YYYY-MM-DD")
        : undefined,
      page: currentPage + 1,
      limit: limit,
    };

    const response = await dashBoardService.getTeaLotsDetailsSummary(
      queryParams
    );
    return response;
  }
);

// Tea Lot List
export const getTeaLotSummaryAPI = createAsyncThunk(
  "/getTeaLotSummaryAPI",
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { selectedCatalogId } = state.lotHistory;

    const queryParams: LotSummeryAPIRequest = {
      customerId: CUSTOMER_ID,
      catalogId: selectedCatalogId,
      statusId: SELECTED_STATUS_IDS,
    };
    const response = await dashBoardService.getTeaLotSummaryAPI(queryParams);
    return response;
  }
);
