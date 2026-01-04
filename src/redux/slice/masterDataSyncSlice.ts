import { createSlice } from "@reduxjs/toolkit"
import { getSyncMasterDataDetails, syncMasterData } from "../action/dataAction";
import { MasterDataSync } from "@/interfaces";

export interface MasterDataSyncState {
    data: MasterDataSync | undefined
    isLoading: boolean
    masterDataSyncResponse: {
        isLoading: boolean;
        hasError: boolean;
        isSuccess: boolean;
        message: string | undefined;
    }
    selectedMasterDataType: string
}


const initialState: MasterDataSyncState = {
    data: undefined,
    isLoading: false,
    masterDataSyncResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        message: undefined,
    },
    selectedMasterDataType: ''
}


export const masterDataSyncSlice = createSlice({
    name: "masterDataSync",
    initialState,
    reducers: {
        setSelectedMasterDataType: (state, action) => {
            state.selectedMasterDataType = action.payload;
        },
        resetMaserDataSyncState: (state) => {
            state.masterDataSyncResponse = initialState.masterDataSyncResponse
        },
    },
    extraReducers: (builder) => {
        builder
            //get master sync details
            .addCase(getSyncMasterDataDetails.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getSyncMasterDataDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
            })
            .addCase(getSyncMasterDataDetails.rejected, (state) => {
                state.isLoading = false
                state.data = initialState.data
            })
            // sync master data
            .addCase(syncMasterData.pending, (state) => {
                state.masterDataSyncResponse.isLoading = true;
            })
            .addCase(syncMasterData.fulfilled, (state, action) => {
                state.masterDataSyncResponse.isLoading = false
                state.masterDataSyncResponse.message = action.payload.message
                state.masterDataSyncResponse.isSuccess = true
            })
            .addCase(syncMasterData.rejected, (state, action) => {
                state.masterDataSyncResponse.isLoading = false
                state.masterDataSyncResponse.message = action.error.message
                state.masterDataSyncResponse.hasError = true
            })
    }
})

export const {
    setSelectedMasterDataType,
    resetMaserDataSyncState
} = masterDataSyncSlice.actions;

export default masterDataSyncSlice.reducer;