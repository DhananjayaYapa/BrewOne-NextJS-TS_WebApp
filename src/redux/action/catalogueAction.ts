import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { catalogueManagementService } from "../../service";
import { GetCatalogueRequest, PaginationRequest, TabDetailsRequest } from "@/interfaces";
import { CUSTOMER_ID } from "@/constant";
import dayjs from "dayjs";

export const getCatalogues = createAsyncThunk(
  '/getCatalogues',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      filterValues, limit, currentPage
    } = state.catalogue;
    const queryParams: GetCatalogueRequest = {
      customerId: 1, //TODO
      limit: limit,
      page: currentPage + 1,
      brokerCode: filterValues.brokerValue?.value?.brokerCode,
      salesCode: filterValues.salesCodeValue?.value?.salesCode,
      startDate: filterValues.startDate ? dayjs(filterValues.startDate).format("YYYY-MM-DD") : undefined,
      endDate: filterValues.endDate ? dayjs(filterValues.endDate).format("YYYY-MM-DD") : undefined,
      search: filterValues.searchText,
      statusId: filterValues.catalogueStatus?.value && filterValues.catalogueStatus?.value?.length > 0
        ? filterValues.catalogueStatus?.value?.map(item => item.statusId)
        : undefined
    };
    const response = await catalogueManagementService.getCatalogues(queryParams);
    return response;
  },
);

export const getTabDetails = createAsyncThunk(
  '/getCatalogDetailsById',
  async (id: number, { getState }) => {
    const state: RootState = getState() as RootState;
    const {

    } = state.catalogue;
    const queryParams: TabDetailsRequest = {
      customerId: CUSTOMER_ID,

    };

    const response = await catalogueManagementService.getTabDetails(id, queryParams);
    return response;
  },
);

export const deleteCatalog = createAsyncThunk(
  '/deleteCatalog',
  async (id: number, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
    } = state.catalogue;
    const queryParams: TabDetailsRequest = {
      customerId: CUSTOMER_ID,

    };

    const response = await catalogueManagementService.deleteCatalog(id, queryParams);
    return response;
  },
);

export const getCataloguesSummary = createAsyncThunk(
  '/getCataloguesSummary',
  async () => {
    const queryParams: GetCatalogueRequest = {
      customerId: CUSTOMER_ID,
    };

    const response = await catalogueManagementService.getCataloguesSummary(queryParams);
    return response;
  },
);

//all lots changelogs per catalogue
export const getAllCatalogueLogs = createAsyncThunk(
  '/getAllCatalogueLogs',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const queryParams: PaginationRequest = {
      page: state.catalogue.changeLogCurrentPage + 1,
      limit: state.catalogue.changeLogLimit
    }
    const {
      changeLogCatalogueId
    } = state.catalogue;

    const response = await catalogueManagementService.getAllCatalogueLogs(changeLogCatalogueId, queryParams);
    return response;
  },
);

//lot changes in a catalogue by lotId
export const getCatalogueLogsById = createAsyncThunk(
  '/getCatalogueLogsById',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const {
      selectedCatalogueLotNo, catalogueChangeLogsByIdRequest
    } = state.catalogue;

    const response = await catalogueManagementService.getCatalogueLogsById(selectedCatalogueLotNo, catalogueChangeLogsByIdRequest);
    return response;
  },
);