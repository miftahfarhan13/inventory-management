import { Alert, AlertProps, Snackbar } from "@mui/material";
import React from "react";

function SnackbarAlert({
  message,
  severity,
  open,
  onClose,
}: {
  message: string;
  severity: AlertProps["severity"];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={5000}
        onClose={onClose}
      >
        <Alert
          onClose={onClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SnackbarAlert;
