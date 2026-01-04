  import { createSlice } from '@reduxjs/toolkit';
import { getBrokers } from '../action/brokerAction';
import { Broker } from '@/interfaces';

  export interface BrokerSliceState {
    data:{
      brokerData: Broker[],
      isLoading: boolean;
      hasError: boolean;
    },
  }

  const initialState: BrokerSliceState = {
    data:{
      brokerData: [],
      isLoading: false,
      hasError: false,
    },

  };

  export { initialState as initialBrokerSliceState };

  export const brokerSlice = createSlice({
    name: 'broker',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
      builder
        // get brokers
        .addCase(getBrokers.pending, (state) => {
          state.data.isLoading = true;
          state.data.hasError = false;
        })
        .addCase(getBrokers.fulfilled, (state, action) => {
          state.data.brokerData = action.payload;
          state.data.isLoading = false;
          state.data.hasError = false;
        })
        .addCase(getBrokers.rejected, (state) => {
          state.data.brokerData = initialState.data.brokerData;
          state.data.isLoading = false;
          state.data.hasError = true;
        })

    },
  });


  export default brokerSlice.reducer;
