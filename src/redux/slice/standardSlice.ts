import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  updateTeaLotDetails } from '../action/gradingAction';
import { getStandardTeaLotDetails } from '../action/standardAction';
import { StandardData } from '@/interfaces';
 
 
export interface StandardDataSliceState {
  standardData: StandardData[];
  isLoading: boolean;
      hasError: boolean;
}
 
 
const initialState: StandardDataSliceState=
  {
    standardData:[],
    isLoading: false,
      hasError: false,
  };
 
export { initialState as initialStandardDataSliceState };
 
export const standardSlice = createSlice({
  name: 'standard',
  initialState,
  reducers: {},
   
  extraReducers: (builder) => {
    builder
// get brokers
      .addCase(getStandardTeaLotDetails.pending, (state) => {
          state.isLoading = true;
          state.hasError = false;
        })
  .addCase(getStandardTeaLotDetails.fulfilled, (state, action) => {
    state.standardData = action.payload;
  
    state.isLoading = false;
    state.hasError = false;
  })
  .addCase(getStandardTeaLotDetails.rejected, (state) => {
    state.isLoading = false;
    state.hasError = true;
  })
  },
});
 

 
export default standardSlice.reducer;