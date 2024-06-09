import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { fetchUpdateCategory } from "@/networks/libs/category";
import SnackbarAlert from "../../components/shared/SnackbarAlert";
import { ISnackbar } from "@/utils/interface/snackbar";
import { IconEdit } from "@tabler/icons-react";
import { fetchUpdateStudyProgram } from "@/networks/libs/studyProgram";

export default function ModalUpdateStudyProgram({
  data,
  onSuccess,
}: {
  data: any;
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

  const onCreateCategory = async ({ name }: { name: string }) => {
    setIsloading(true);
    const token = localStorage.getItem("token") || "";
    await fetchUpdateStudyProgram(
      token,
      {
        name: name,
      },
      data?.id
    )
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil merubah Program Studi!",
          severity: "success",
        });
        onSuccess();
      })
      .catch((error) => {
        console.log(error);
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Gagal merubah Program Studi!",
          severity: "error",
        });
      });
  };

  return (
    <React.Fragment>
      <Button
        size="small"
        variant="outlined"
        startIcon={<IconEdit size="16" />}
        onClick={handleClickOpen}
      >
        Edit
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
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const name = formJson.name;
            onCreateCategory({ name });
            handleClose();
          },
        }}
      >
        <DialogTitle>Edit Program Studi</DialogTitle>
        <DialogContent>
          <DialogContentText>Silahkan masukkan Program Studi</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Nama Program Studi"
            type="text"
            fullWidth
            defaultValue={data?.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            Simpan
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
