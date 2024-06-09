import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { fetchDeleteCategory } from "@/networks/libs/category";
import SnackbarAlert from "../../components/shared/SnackbarAlert";
import { ISnackbar } from "@/utils/interface/snackbar";
import { IconTrash } from "@tabler/icons-react";

export default function ModalDeleteCategory({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess: () => void;
}) {
  const [isLoading, setIsloading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<ISnackbar>({
    isOpen: false,
    message: "",
    severity: "info",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDelete = async () => {
    setIsloading(true);
    const token = localStorage.getItem("token") || "";
    await fetchDeleteCategory(token, id)
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil menghapus kategori asset!",
          severity: "success",
        });
        onSuccess();
      })
      .catch((error) => {
        console.log(error);
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Gagal menghapus kategori asset!",
          severity: "error",
        });
      });
  };

  return (
    <React.Fragment>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={handleClickOpen}
        startIcon={<IconTrash size="16" />}
      >
        Delete
      </Button>
      <SnackbarAlert
        message={snackbar.message}
        severity={snackbar.severity}
        open={snackbar.isOpen}
        onClose={() =>
          setSnackbar((prev) => {
            return {
              ...prev,
              isOpen: false,
            };
          })
        }
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onDelete();
            handleClose();
          },
        }}
      >
        <DialogTitle>Hapus Data Kategori</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah anda yakin ingin menghapus data kategori?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
              color="error"
            >
              Hapus
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
