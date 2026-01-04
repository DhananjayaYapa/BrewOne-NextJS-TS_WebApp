import { createSlice } from "@reduxjs/toolkit";
import { getBlendShipmentReport } from "../action/readyForShipmentAction";
import { BlendShipmentReportResponse } from "@/service/readyForShipmentService";

interface ReadyForShipmentState {
  data: BlendShipmentReportResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ReadyForShipmentState = {
  data: [],
  loading: false,
  error: null,
};

export const readyForShipmentSlice = createSlice({
  name: "readyForShipment",
  initialState,
  reducers: {
    clearShipmentReport: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlendShipmentReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlendShipmentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload];
      })
      .addCase(getBlendShipmentReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch shipment report";
      });
  },
});

// Export the action
export const { clearShipmentReport } = readyForShipmentSlice.actions;

export default readyForShipmentSlice.reducer;