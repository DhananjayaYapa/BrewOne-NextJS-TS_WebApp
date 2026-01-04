import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {  teaLotManagementService } from "@/service";
import { BulkForm, GetTeaLotDetailsRequest, TeaLot } from "@/interfaces";
import { CUSTOMER_ID } from "@/constant";

export const getTeaLotDetails = createAsyncThunk(
    '/grading/getTeaLotDetails',
    async (_, { getState }) => {
      const state: RootState = getState() as RootState;
      const {
        limit,
         currentPage,
        searchText,
        tabStatus,
        isBuyingPlan
      } = state.grading;

      const {
        catalogueData
      } = state.catalogue

      const queryParams: GetTeaLotDetailsRequest = {
        brokerCode: catalogueData.catalogue.brokerCode,
        salesCode: catalogueData.catalogue.salesCode,
        catalogId:catalogueData.catalogue.catalogId,
        customerId: CUSTOMER_ID,
        page: currentPage + 1 ,
        limit: limit,
        statusId: tabStatus,
        filterBuyingPlan: isBuyingPlan,
        // statusId:catalogueData.catalogue.statusId.toString(),
        search: searchText,
      };
      const response = await teaLotManagementService.getTeaLotDetails(queryParams);
      return response;
    },
  );


  export const updateTeaLotDetails = createAsyncThunk(
    '/grading/UpdateTeaLotDetails',
    async (bodyParams: BulkForm[]) => {
      
      const response = await teaLotManagementService.updateBulkTeaLotDetails(bodyParams,1); //todo
      return response;
    },
  );

 