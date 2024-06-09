import { AlertProps } from "@mui/material";

export interface ISnackbar {
  isOpen: boolean;
  message: string;
  severity: AlertProps["severity"];
}
