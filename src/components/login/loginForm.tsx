"use client";

import { Box, FormControl, Grid, InputLabel, TextField, Typography, Alert } from "@mui/material";
import loginBgImage from '@/assets/loginBgImage.png'
import logo from '@/assets/brewone-logo.svg';
import Image from 'next/image';
import Cookies from 'js-cookie';
import AppButton from "../common/AppButton/AppButton";
import { confirmSignIn, signIn, signOut } from 'aws-amplify/auth';
import { SIGN_IN_MESSAGES, CHANGE_PASSWORD_MESSAGES } from "@/constant";
import {
    setUsername, setPassword, setNewPassword, setNewPasswordConfirmed, setCurrentPassword,
    resetErrors, setIsChangePasswordOpen, setUsernameError, setPasswordError, setSignInError,
    setCurrentPasswordError, setNewPasswordError, setConfirmedPasswordError, setUpdatePasswordError,
    setSuccessFullyUpdatedPassword, incrementAttemptCount
} from '@/redux/slice/authSlice';
import { useDispatch,useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getFeatureList, getFeaturesByUserRole } from "@/redux/action/authAction";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
 
export default function LoginForm() {
    const dispatch = useDispatch<AppDispatch>();

    const {
        username, password, newPassword, newPasswordConfirmed, currentPassword, isChangePasswordOpen,
        usernameError, passwordError, signInError, currentPasswordError, newPasswordError,
        confirmedPasswordError, updatePasswordError, successFullyUpdatedPassword, maxAttemptsReached,
        userRoleFeatureListReponse
    } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
 useEffect(() => {    
    const roles = Cookies.get('userRole')
    if(roles){
        router.push('/dashboard')
    }
  }, []);
    async function handleSignOut() {
        try {
          await signOut();
            dispatch(setIsChangePasswordOpen(false));
            dispatch(setPassword(''));
        } catch (error) {
          console.log(SIGN_IN_MESSAGES.SIGN_IN_OUT_ERROR, error);
        }
      }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(resetErrors());

        let hasError = false;

        if (!username) {
            dispatch(setUsernameError(SIGN_IN_MESSAGES.USERNAME_ERROR));
            hasError = true;
        }
        if (!password) {
            dispatch(setPasswordError(SIGN_IN_MESSAGES.PASSWORD_ERROR));
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            const signInResult = await signIn({ username, password });
            if(signInResult.isSignedIn){
                dispatch(setPassword(''));
                dispatch(setUsername(''));
                dispatch(setSuccessFullyUpdatedPassword(false));
                dispatch(getFeatureList())
                dispatch(getFeaturesByUserRole())
            }
            else if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
                dispatch(setIsChangePasswordOpen(true));
            } else {
                console.log("error")
            }
            
        } catch (error: any) {
            console.log(SIGN_IN_MESSAGES.SIGN_IN_ERROR, error);
            if (error.name === "NotAuthorizedException") {
                dispatch(incrementAttemptCount());
            }
            else {
                dispatch(setSignInError(SIGN_IN_MESSAGES.SIGN_IN_ERROR));
            }
        }
    };

    const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(resetErrors());

        let hasError = false;

        if (!currentPassword) {
            dispatch(setCurrentPasswordError(CHANGE_PASSWORD_MESSAGES.CURRENT_PASSWORD_REQUIRED));
            hasError = true;
        }

        if (!newPassword) {
            dispatch(setNewPasswordError(CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_REQUIRED));
            hasError = true;
        }

        if (!newPasswordConfirmed) {
            dispatch(setConfirmedPasswordError(CHANGE_PASSWORD_MESSAGES.CONFIRMED_PASSWORD_REQUIRED));
            hasError = true;
        }

        if(password !== currentPassword){
            dispatch(setUpdatePasswordError(CHANGE_PASSWORD_MESSAGES.CURRENT_PASSWORD_INCORRECT));
            hasError = true;
        }

        if(newPassword !== newPasswordConfirmed){
            dispatch(setUpdatePasswordError(CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_AND_CONFIRMATION_PASSWORD_NOT_MATCH));
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try{
            const ChallengeResponse = newPassword
            await confirmSignIn({ challengeResponse:ChallengeResponse });
            dispatch(setSuccessFullyUpdatedPassword(true));
            handleSignOut()
        } catch (error: any) {
            if (error.name === "InvalidPasswordException") {
                dispatch(setUpdatePasswordError(CHANGE_PASSWORD_MESSAGES.CHANGE_PASSWORD_ERROR));
                hasError = true;
            } else {
                dispatch(setUpdatePasswordError(CHANGE_PASSWORD_MESSAGES.ERROR_OCCURRED));
            }
        }
    }

    return (
        <>
            {isChangePasswordOpen ? (
                <Grid container>
                    <Grid 
                        item lg={7} xl={7} md={7} sm={6} xs={12} 
                        sx={{  
                            height: 'auto', 
                            '@media (max-width: 600px)': {marginBottom: '10px', height: '50vh'},
                            overflow:"hidden"
                        }}
                    >
                        <Image 
                            src={loginBgImage} 
                            alt="BrowOne Logo" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundRepeat: "no-repeat !important" }}
                        />
                    </Grid>
                
                    <Grid 
                        container
                        item lg={5} xl={5} md={5} sm={6} xs={12} 
                        direction="column"  
                        alignItems="" 
                        sx={{
                            pl:10,
                            pr:10,
                            marginTop:10, 
                            marginBottom: 10, 
                            '@media (max-width: 600px)': {marginBottom: '40px', marginTop:"30px", pl:2, pr:2}
                        }}
                    >
                        <div>
                            <div style={{backgroundRepeat: `no-repeat !important`,backgroundImage:`url(${logo.src})`, height:20, marginBottom: 10}}/>
                        
                            <Typography sx={{fontWeight:"500", fontSize:"25px", color:"#5F6D7E"}}>Change the Password</Typography>
                            <Box sx={{ position: 'relative', left: 0, width: '100px', height: '4px', backgroundColor: '#005893',marginBottom:2}} />

                            <form onSubmit={handleUpdatePassword}>
                                <Box display="flex" flexDirection="column">

                                    <FormControl variant="standard" sx={{marginBottom:3}}>
                                        <InputLabel shrink htmlFor="bootstrap-input" sx={{position:"relative", fontWeight:"500", fontSize:"18px"}}>
                                            Email<span style={{color:"red", fontWeight:"500"}}>*</span>
                                        </InputLabel>
                                        <TextField 
                                            fullWidth 
                                            label="Enter your email" 
                                            id="fullWidth" 
                                            size="medium" 
                                            name="email" 
                                            value={username}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                borderRadius: '16px',
                                                },
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl variant="standard" sx={{marginBottom:3}}>
                                        <InputLabel shrink htmlFor="bootstrap-input" sx={{position:"relative", fontWeight:"500", fontSize:"18px"}}>
                                            Old Password<span style={{color:"red", fontWeight:"500"}}>*</span>
                                        </InputLabel>
                                        <TextField 
                                            fullWidth 
                                            label="Enter your old password" 
                                            id="fullWidth" 
                                            size="medium"
                                            type="password" 
                                            name="password" 
                                            value={currentPassword}
                                            onChange={(e) => dispatch(setCurrentPassword(e.target.value))}
                                            error={!!currentPasswordError}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                borderRadius: '16px',
                                                },
                                            }}
                                        />

                                        {currentPasswordError && 
                                            (<p style={{ marginTop: 2, color:"red", fontWeight:"400" }}>
                                                {currentPasswordError}
                                            </p>)
                                        }
                                    </FormControl>

                                    <FormControl variant="standard" sx={{marginBottom:3}}>
                                        <InputLabel shrink htmlFor="bootstrap-input" sx={{position:"relative", fontWeight:"500", fontSize:"18px"}}>
                                            New Password<span style={{color:"red", fontWeight:"500"}}>*</span>
                                        </InputLabel>
                                        <TextField 
                                            fullWidth 
                                            label="Enter your new password" 
                                            id="fullWidth" 
                                            size="medium"
                                            type="password" 
                                            name="newPassword" 
                                            value={newPassword} 
                                            onChange={(e) => dispatch(setNewPassword(e.target.value))}
                                            error={!!newPasswordError}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                borderRadius: '16px',
                                                },
                                            }}
                                        />

                                        {newPasswordError && 
                                            (<p style={{ marginTop: 2, color:"red", fontWeight:"400" }}>
                                                {newPasswordError}
                                            </p>)
                                        }
                                    </FormControl>

                                    <FormControl variant="standard" sx={{marginBottom:3}}>
                                        <InputLabel shrink htmlFor="bootstrap-input" sx={{position:"relative", fontWeight:"500", fontSize:"18px"}}>
                                            Confirm the New Password<span style={{color:"red", fontWeight:"500"}}>*</span>
                                        </InputLabel>
                                        <TextField 
                                            fullWidth 
                                            label="Confirm your password" 
                                            id="fullWidth" 
                                            size="medium"
                                            type="password" 
                                            name="newPassword" 
                                            value={newPasswordConfirmed} 
                                            onChange={(e) => dispatch(setNewPasswordConfirmed(e.target.value))}
                                            error={!!confirmedPasswordError}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                borderRadius: '16px',
                                                },
                                            }}
                                        />

                                        {confirmedPasswordError && 
                                            (<p style={{ marginTop: 2, color:"red", fontWeight:"400" }}>
                                                {confirmedPasswordError}
                                            </p>)
                                        }
                                    </FormControl>

                                    {updatePasswordError && (
                                        <Alert variant="outlined" severity="error" sx={{ marginBottom: 3, color:"red", fontWeight:"400", borderRadius:"16px" }}>
                                            {updatePasswordError}
                                        </Alert>
                                    )}

                                    <AppButton
                                        buttonText={"Save"}
                                        size={"medium"}
                                        variant={"contained"}
                                        color={"primary"}
                                        borderRadius="16px"
                                        type="submit"
                                    />
                                </Box>
                            </form>
                        </div>
                    </Grid>
                </Grid>
            ): (
                <Grid container>
                    <Grid 
                        item lg={7} xl={7} md={7} sm={6} xs={12} 
                        sx={{ 
                            height: "100vh",  
                            '@media (max-width: 600px)': {marginBottom: '0px', height: '50vh'},
                            overflow: "hidden"
                        }}
                    >
                        <Image 
                            src={loginBgImage} 
                            alt="BrowOne Logo" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover',backgroundRepeat: "no-repeat !important" }}
                        />
                    </Grid>

                    <Grid 
                        container 
                        item lg={5} xl={5} md={5} sm={6} xs={12}  
                        direction="column"  
                        alignItems="" 
                        sx={{
                            pl:10,
                            pr:10,
                            marginTop:15, 
                            '@media (max-width: 600px)': {marginBottom: '40px', marginTop:"30px", pl:2, pr:2}
                        }}
                    >
                        <div>
                            <div style={{backgroundImage:`url(${logo.src})`, height:20, marginBottom:10,backgroundRepeat: `no-repeat`}}/>

                            <Typography sx={{fontWeight:"500", fontSize:"40px", color:"#5F6D7E"}}>Welcome Back</Typography>
                            <Box sx={{ position: 'relative', left: 0, width: '100px', height: '4px', backgroundColor: '#005893',marginBottom:2 }} />

                            <form onSubmit={handleSubmit}>
                                <Box display="flex" flexDirection="column">
                                    <FormControl variant="standard" sx={{marginBottom:3}}>
                                        <InputLabel shrink htmlFor="bootstrap-input" sx={{position:"relative", fontWeight:"500", fontSize:"18px"}}>
                                            Email<span style={{color:"red", fontWeight:"500"}}>*</span>
                                        </InputLabel>
                                        <TextField 
                                            fullWidth 
                                            label="Enter your email" 
                                            id="fullWidth" 
                                            size="medium" 
                                            name="email" 
                                            type="email"
                                            value={username} 
                                            onChange={(e) => dispatch(setUsername(e.target.value))}
                                            error={!!usernameError}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                borderRadius: '16px',
                                                },
                                            }}
                                             
                                        />
                                        {usernameError && 
                                            (<p style={{ marginTop: 2, color:"red", fontWeight:"400" }}>
                                                {usernameError}
                                            </p>)
                                        }
                                    </FormControl>

                                    <FormControl variant="standard" sx={{marginBottom:3}}>
                                        <InputLabel shrink htmlFor="bootstrap-input" sx={{position:"relative", fontWeight:"500", fontSize:"18px"}}>
                                            Password<span style={{color:"red", fontWeight:"500"}}>*</span>
                                        </InputLabel>
                                        <TextField 
                                            fullWidth 
                                            label="Enter your password" 
                                            id="fullWidth" 
                                            size="medium"
                                            type="password" 
                                            name="password" 
                                            value={password} 
                                            onChange={(e) => dispatch(setPassword(e.target.value))}
                                            error={!!passwordError}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                borderRadius: '16px',
                                                },
                                            }}
                                             
                                        />
                                        {passwordError && 
                                            (<p style={{ marginTop: 2, color:"red", fontWeight:"400" }}>
                                                {passwordError}
                                            </p>)
                                        }
                                    </FormControl>

                                    {signInError && (
                                        <Alert variant="outlined" severity="error" sx={{ marginBottom: 3, color:"red", fontWeight:"400", borderRadius:"16px" }}>
                                            {signInError}
                                        </Alert>
                                    )}

                                    {successFullyUpdatedPassword && (
                                        <Alert variant="outlined" severity="success" sx={{ marginBottom: 3, color:"green", fontWeight:"400", borderRadius:"16px" }}>
                                            {CHANGE_PASSWORD_MESSAGES.SUCCESSFULLY_UPDATED_PASSWORD}
                                        </Alert>
                                    )}


                                    <AppButton
                                        buttonText={"Log In"}
                                        size={"medium"}
                                        variant={"contained"}
                                        color={"primary"}
                                        borderRadius="16px"
                                        type="submit"
                                        disabled={maxAttemptsReached}
                                    />
                                </Box>
                            </form>
                        </div>
                    </Grid>
                </Grid>
            )}
        </>
    )
}