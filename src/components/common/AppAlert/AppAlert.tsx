import { Alert, Slide, Snackbar, Stack } from '@mui/material'
import React from 'react'

interface AppAlerts {
    openState: boolean
    severity: 'error' | 'info' | 'success' | 'warning'
    onClose: () => void;
    alertText: string
}
function AppAlert({
    openState,
    severity,
    onClose,
    alertText }: AppAlerts) {
    return (
        <Snackbar
            open={openState}
            onClose={onClose}
            TransitionComponent={(props) => <Slide {...props} direction='left' />}
            autoHideDuration={2000}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        >
            <Alert severity={severity} sx={{
                bgcolor: severity === 'success' ? '#388e3c' : '#DB1616',
                color: 'white',
                fontWeight: 'bold',
                '& .MuiAlert-icon': {
                    color: 'white',
                },
            }}>
                {alertText}
            </Alert>
        </Snackbar>
    )
}

export default AppAlert