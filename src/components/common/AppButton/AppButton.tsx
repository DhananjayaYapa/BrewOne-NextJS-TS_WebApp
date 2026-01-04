import { CircularProgress } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { ReactNode } from "react";
interface AppButtonProps extends ButtonProps {
  buttonText: string;
  size: "small" | "medium" | "large";
  variant: "outlined" | "contained";
  color: "primary" | "secondary" | "error";
  isClicked?: boolean;
  onClick?: () => void;
  borderRadius?: string;
  type?: "button" | "submit" | "reset" | undefined
  disabled?:boolean
  endIcon?:ReactNode
  isLoading?: boolean
}

const AppButton = ({ buttonText, size, variant, color, isClicked = false, onClick,borderRadius, type, disabled, endIcon, isLoading}: AppButtonProps) => {
  return (
    <Button type={type} disabled={disabled} size={size} variant={isClicked ? 'contained' : variant} color={color} onClick={onClick} sx={{borderRadius:borderRadius}} endIcon={endIcon}>
      {isLoading && <CircularProgress size="12px" sx={{ color: 'white', marginRight: '10px' }} />}
      {buttonText}
    </Button>
  );
};

export default AppButton;
