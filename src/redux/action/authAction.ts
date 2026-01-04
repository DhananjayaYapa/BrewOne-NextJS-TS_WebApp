import { createAsyncThunk } from "@reduxjs/toolkit";
import { dataManagementService } from "../../service";

export const getFeatureList = createAsyncThunk(
    '/getFeatureList',
    async () => {
      const response = await dataManagementService.getFeatureList();
      return response;
    },
  );
  
export const getFeaturesByUserRole = createAsyncThunk(
    '/getFeaturesByUserRole',
    async () => {
      const response = await dataManagementService.getRoleWiseFeatures();
      return response;
    },
);
  