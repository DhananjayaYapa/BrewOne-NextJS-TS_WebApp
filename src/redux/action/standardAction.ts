import { createAsyncThunk } from "@reduxjs/toolkit";
import { standardDataManagementService} from "@/service";



  export const getStandardTeaLotDetails = createAsyncThunk(
    '/grading/standardTeaLotDetails',
    async () => {
      const response = await standardDataManagementService.getStandardDataDetails();
      return response;
    },
  );