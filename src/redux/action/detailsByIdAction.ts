import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { GetCatalogueRequest, TabDetailsRequest } from "@/interfaces";
import { catalogueManagementService } from "@/service";

  // export const getTabDetails = createAsyncThunk(
  //   '/getCatalogues',
  //   async (id:number, { getState }) => {
  //     const state: RootState = getState() as RootState;
  //     const {
        
  //     } = state.catalogue;
  //     const queryParams: TabDetailsRequest = {
  //       customerId: 1, //TODO
        
  //     };
  //     const response = await catalogueManagementService.getTabDetails(id, queryParams);
  //     return response;
  //   },
  // );