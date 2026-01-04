import { CatalogueLogVersions } from '@/interfaces';
import { ChangeLogById, ChangeLogByIdField } from '@/interfaces/blendSheet';
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

export interface CatalogueChangeLogPopup {
    open: boolean;
    onClose: () => void;
    dialogTitle: string;
    logData: CatalogueLogVersions[] | null;
    logDataIsLoading: boolean
}
export default function CatalogueChangeLogPopup(props: CatalogueChangeLogPopup) {

    const {
        open,
        onClose,
        dialogTitle,
        logData,
        logDataIsLoading } = props;

    return (
        <Dialog
            open={open}
            id="unsavedDataConfirmationMessage"
            data-testid="unsavedDataConfirmationMessage"
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle id="alert-dialog-title">
                <h3 id={"dialogHeading"}>{dialogTitle}</h3>

                <IconButton
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            {logDataIsLoading && (
                <DialogContent>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={50} />
                    </Box>
                </DialogContent>
            )}

            {logData && !logDataIsLoading && (
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell> #</TableCell>
                                    <TableCell> Changed Field</TableCell>
                                    <TableCell> Previous Value</TableCell>
                                    <TableCell> New Value </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logData && logData.map((header, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{header.fieldName}</TableCell>
                                        <TableCell>{header.previousValue ?? '-'}</TableCell>
                                        <TableCell>{header.currentValue ?? '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            )
            }
        </Dialog >
    )
}
