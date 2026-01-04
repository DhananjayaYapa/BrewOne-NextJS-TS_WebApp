import { createAsyncThunk } from "@reduxjs/toolkit";
import { brokerManagementService } from "../../service";
import { RootState } from "../store";
import { GetBrokerParams } from "@/interfaces";

export const getBrokers = createAsyncThunk(
  '/getBrokers',
  async (_, { getState }) => {
    const state: RootState = getState() as RootState;

    let getBrokerParamsObj: GetBrokerParams = {}

    if (state.createCatalogue.createCatalogueHeaderForm.catalogueType.value?.value) {
      getBrokerParamsObj = {
        catalogTypeId: Number(state.createCatalogue.createCatalogueHeaderForm.catalogueType.value?.value)
      }
    }

    const response = await brokerManagementService.getBrokers(getBrokerParamsObj);
    return response;
  },
);
