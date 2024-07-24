import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SnackbarAlert from "../../components/shared/SnackbarAlert";
import { ISnackbar } from "@/utils/interface/snackbar";
import { IconPlus } from "@tabler/icons-react";
import { fetchCreateStudyProgram } from "@/networks/libs/studyProgram";
import { fetchRegister } from "@/networks/libs/auth";
import { numberInputOnWheelPreventChange } from "@/utils/number";

export default function ModalCreateUser({
  onSuccess,
}: {
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

  const onCreateUser = async ({
    name,
    email,
    role,
    phoneNumber,
    password,
    cPassword,
  }: {
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    password: string;
    cPassword: string;
  }) => {
    setIsloading(true);
    const token = localStorage.getItem("token") || "";
    await fetchRegister(
      {
        name,
        email,
        role,
        phone_number: phoneNumber,
        password,
        c_password: cPassword,
      },
      token
    )
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil menambah User!",
          severity: "success",
        });
        onSuccess();
      })
      .catch((error) => {
        const message = error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: message,
          severity: "error",
        });
      });
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<IconPlus size="16" />}
      >
        Tambah User
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
            const email = formJson.email;
            const role = formJson.role;
            const phoneNumber = formJson.phoneNumber;
            const password = formJson.password;
            const cPassword = formJson.cPassword;

            onCreateUser({
              name,
              email,
              role,
              phoneNumber,
              password,
              cPassword,
            });
            handleClose();
          },
        }}
      >
        <DialogTitle>Tambah User</DialogTitle>
        <DialogContent>
          <DialogContentText>Silahkan masukkan data User</DialogContentText>
          <Stack spacing={2} direction="column" mt={1}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Nama User"
              type="text"
              fullWidth
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="phoneNumber"
              name="phoneNumber"
              label="Nomor Telepon"
              type="number"
              fullWidth
              onWheel={numberInputOnWheelPreventChange}
            />

            <FormControl style={{ minWidth: "100px" }}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select labelId="role-label" label="Role" name="role">
                <MenuItem value="admin-1">Admin 1</MenuItem>
                <MenuItem value="admin-2">Admin 2</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            <TextField
              autoFocus
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="cPassword"
              name="cPassword"
              label="Konfirmasi Password"
              type="password"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            Tambah
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
