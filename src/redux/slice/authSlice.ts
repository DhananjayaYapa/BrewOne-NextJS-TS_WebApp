import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SIGN_IN_MESSAGES, MAX_SIGN_IN_ATTEMPTS, CHANGE_PASSWORD_MESSAGES } from '@/constant';
import { APIGetResponse, ResponseState } from '@/interfaces';
import { Feature, UserRoleFeature } from '@/interfaces/feature';
import { getFeatureList, getFeaturesByUserRole } from '../action/authAction';

interface AuthStateProps {
    username: string;
    password: string;
    newPassword: string;
    newPasswordConfirmed: string;
    currentPassword: string;
    isChangePasswordOpen: boolean;
    usernameError: string;
    passwordError: string;
    signInError: string;
    currentPasswordError: string;
    newPasswordError: string;
    confirmedPasswordError: string;
    updatePasswordError: string;
    successFullyUpdatedPassword: boolean;
    attemptCount: number;
    maxAttemptsReached: boolean;
    featureListReponse: ResponseState<Feature[]>
    userRoleFeatureListReponse: ResponseState<UserRoleFeature[]>
    currentUserFeatureList: string[] | null
}

const initialState: AuthStateProps = {
    username: '',
    password: '',
    newPassword: '',
    newPasswordConfirmed: '',
    currentPassword: '',
    isChangePasswordOpen: false,
    usernameError: '',
    passwordError: '',
    signInError: '',
    currentPasswordError: '',
    newPasswordError: '',
    confirmedPasswordError: '',
    updatePasswordError: '',
    successFullyUpdatedPassword: false,
    attemptCount: 0,
    maxAttemptsReached: false,
    featureListReponse:{
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: []
    },
    userRoleFeatureListReponse:{
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: []
    },
    currentUserFeatureList: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUserFeatureList: (state, action: PayloadAction<string[] | null>) => { 
          state.currentUserFeatureList = action.payload;
         },
        setUsername: (state, action: PayloadAction<string>) => { state.username = action.payload; },
        setPassword: (state, action: PayloadAction<string>) => { state.password = action.payload; },
        setNewPassword: (state, action: PayloadAction<string>) => { state.newPassword = action.payload; },
        setNewPasswordConfirmed: (state, action: PayloadAction<string>) => { state.newPasswordConfirmed = action.payload; },
        setCurrentPassword: (state, action: PayloadAction<string>) => { state.currentPassword = action.payload; },
        resetErrors: (state) => {
            state.usernameError = '';
            state.passwordError = '';
            state.signInError = '';
            state.currentPasswordError = '';
            state.newPasswordError = '';
            state.confirmedPasswordError = '';
            state.updatePasswordError = '';
        },
        setIsChangePasswordOpen: (state, action: PayloadAction<boolean>) => { state.isChangePasswordOpen = action.payload; },
        setUsernameError: (state, action: PayloadAction<string>) => { state.usernameError = action.payload; },
        setPasswordError: (state, action: PayloadAction<string>) => { state.passwordError = action.payload; },
        setSignInError: (state, action: PayloadAction<string>) => { state.signInError = action.payload; },
        setCurrentPasswordError: (state, action: PayloadAction<string>) => { state.currentPasswordError = action.payload; },
        setNewPasswordError: (state, action: PayloadAction<string>) => { state.newPasswordError = action.payload; },
        setConfirmedPasswordError: (state, action: PayloadAction<string>) => { state.confirmedPasswordError = action.payload; },
        setUpdatePasswordError: (state, action: PayloadAction<string>) => { state.updatePasswordError = action.payload; },
        setSuccessFullyUpdatedPassword: (state, action: PayloadAction<boolean>) => { state.successFullyUpdatedPassword = action.payload; },
        incrementAttemptCount: (state) => {
            state.attemptCount += 1;
            if (state.attemptCount >= MAX_SIGN_IN_ATTEMPTS) {
                state.maxAttemptsReached = true;
                state.signInError = SIGN_IN_MESSAGES.CONTACT_ADMIN;
                state.password = '';
                state.username = '';
            } else {
                state.signInError = SIGN_IN_MESSAGES.INCORRECT_CREDENTIAL(MAX_SIGN_IN_ATTEMPTS - state.attemptCount);
                state.password = '';
                state.username = '';
            }
        },
    },
    extraReducers: (builder) => {
        builder
    
          //get feature list
          .addCase(getFeatureList.pending, (state) => {
            state.featureListReponse.isLoading = true;
          })
          .addCase(getFeatureList.fulfilled, (state, action) => {
            state.featureListReponse.isLoading = false;
            state.featureListReponse.isSuccess = true;
            state.featureListReponse.data = action.payload;
          })
          .addCase(getFeatureList.rejected, (state, action) => {
            state.featureListReponse.isLoading = false;
            state.featureListReponse.hasError = true;
            state.featureListReponse.message = action.error.message;
          })
    
          //get role wise feature list
          .addCase(getFeaturesByUserRole.pending, (state) => {
            state.userRoleFeatureListReponse.isLoading = true;
          })
          .addCase(getFeaturesByUserRole.fulfilled, (state, action) => {
            state.userRoleFeatureListReponse.isLoading = false;
            state.userRoleFeatureListReponse.isSuccess = true;
            state.userRoleFeatureListReponse.data = action.payload;
          })
          .addCase(getFeaturesByUserRole.rejected, (state, action) => {
            state.userRoleFeatureListReponse.isLoading = false;
            state.userRoleFeatureListReponse.hasError = true;
            state.userRoleFeatureListReponse.message = action.error.message;
          })
    
        
      },
})

export const {
    setUsername, setPassword, setNewPassword, setNewPasswordConfirmed, setCurrentPassword,
    resetErrors, setIsChangePasswordOpen, setUsernameError, setPasswordError, setSignInError,
    setCurrentPasswordError, setNewPasswordError, setConfirmedPasswordError, setUpdatePasswordError,
    setSuccessFullyUpdatedPassword, incrementAttemptCount,
    setCurrentUserFeatureList
} = authSlice.actions;

export default authSlice.reducer;