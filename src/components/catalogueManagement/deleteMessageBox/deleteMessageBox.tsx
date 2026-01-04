"use client";

import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Button, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MessageBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function MessageBox(
  { isOpen, onClose, onConfirm, onCancel }: MessageBoxProps
) {
  return (
    <Dialog
      open={isOpen}
      id="uploadFailedMessage"
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <h3 id="dialogHeading">Cancel Changes</h3>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the selected catalogue?
        </DialogContentText>
      </DialogContent>
      <IconButton
        sx={{ position: 'absolute', right: 1, top: 1 }}
        color="inherit"
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <DialogActions>
        <Button
          id="confirmationMessage"
          size="small"
          variant="outlined"
          onClick={onCancel}
        >
          NO
        </Button>
        <Button
          id="confirmationMessage"
          size="small"
          variant="contained"
          onClick={onConfirm}
        >
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
}
