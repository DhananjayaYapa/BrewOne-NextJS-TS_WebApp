"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface ConfirmationButtonProps {
  buttonText: string;
  onClick: () => void;
  design?: 'contained' | 'text' | 'outlined'
  isLoading?: boolean
}

interface ConfirmationMessageProps {
  dialogTitle?: string;
  dialogContentText?: string | number | ReactNode;
  open: boolean;
  onClose: () => void;
  buttons?: ConfirmationButtonProps[];
  showCloseButton?: boolean;
  color?: string
}

export default function ConfirmationMessage({
  dialogTitle,
  dialogContentText,
  open,
  onClose,
  buttons = [],
  showCloseButton = true,
  color,
}: ConfirmationMessageProps) {
  return (
    <Dialog
      open={open}
      id="unsavedDataConfirmationMessage"
      data-testid="unsavedDataConfirmationMessage"
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" color={color || "primary"}>
        <h3 id={"dialogHeading"}>{dialogTitle}</h3>
      </DialogTitle>
      {showCloseButton && (
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
      )}
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          <b>{dialogContentText}</b>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        {buttons?.map((button, index) => (
          <Button
            key={index}
            id={`confirmationMessageButton${index}`}
            size="large"
            sx={{ minWidth: "120px" }} //bugfix 390
            variant={button?.design ? button?.design : "contained"}
            onClick={() => {
              button.onClick();
            }}
          >
            {button.buttonText}
            {button.isLoading && (
              <CircularProgress size={20} color={"info"} />
            )}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}
