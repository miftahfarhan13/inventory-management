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
import { IconEdit } from "@tabler/icons-react";
import { numberInputOnWheelPreventChange } from "@/utils/number";
import { fetchUpdateUser } from "@/networks/libs/auth";

export default function ModalUpdateUser({
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

  const onUpdateUser = async ({
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
    await fetchUpdateUser(
      {
        name,
        email,
        role,
        phone_number: phoneNumber,
        password,
        c_password: cPassword,
      },
      token,
      data?.id
    )
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil mengubah data User!",
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
            const email = formJson.email;
            const role = formJson.role;
            const phoneNumber = formJson.phoneNumber;
            const password = formJson.password;
            const cPassword = formJson.cPassword;

            onUpdateUser({
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
        <DialogTitle>Edit User</DialogTitle>
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
              defaultValue={data?.name}
            />

            {/* <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              defaultValue={data?.email}
            /> */}

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
              defaultValue={data?.phone_number}
            />

            <FormControl style={{ minWidth: "100px" }}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                defaultValue={data?.role}
                labelId="role-label"
                label="Role"
                name="role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            <TextField
              autoFocus
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
            />

            <TextField
              autoFocus
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
            Simpan
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
