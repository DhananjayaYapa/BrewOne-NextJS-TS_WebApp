
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UploadCatalogRequest } from "@/interfaces";
import { brokerManagementService, catalogueManagementService, teaLotManagementService } from "@/service";
import { RootState } from "../store";

export const uploadCatalogue = createAsyncThunk(
  "/uploadCatalogue",
  async (uploadCatalogRequest: UploadCatalogRequest) => {
    const response = await catalogueManagementService.uploadCatalogue(
      uploadCatalogRequest
    );
    return response;
  }
);

export const getTextFileFormatByBrokerCode = createAsyncThunk(
  "/getTextFileFormatByBrokerCode",
  async (_, {getState}) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBrokerCode
    } = state.uploadCatalog;
    const response = await brokerManagementService.getTextFileFormatByBrokerCode(
      selectedBrokerCode
    );
    return response;
  }
);

export const getTextFileCodesByBrokerCode = createAsyncThunk(
  '/getTextFileCodesByBrokerCode',
  async (_,{getState}) => {
    const state: RootState = getState() as RootState;
    const {
      selectedBrokerCode
    } = state.uploadCatalog;
    const response = await brokerManagementService.getTextFileCodesByBrokerCode(selectedBrokerCode);
    return response;
  },
);