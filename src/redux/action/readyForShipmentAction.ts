import { createAsyncThunk } from "@reduxjs/toolkit";
import { reportService } from "@/service/readyForShipmentService";
import { BlendShipmentReportRequest } from "@/service/readyForShipmentService";

export const getBlendShipmentReport = createAsyncThunk(
  "/getBlendShipmentReport",
  async (payload: BlendShipmentReportRequest) => {
    if (!payload.startDate || !payload.endDate) {
      throw new Error("Start and end date are required");
    }

    const response = await reportService.getBlendShipmentReport(payload);
    return response;
  }
);
