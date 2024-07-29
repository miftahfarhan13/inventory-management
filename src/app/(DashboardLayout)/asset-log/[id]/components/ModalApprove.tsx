import SnackbarAlert from '@/app/(DashboardLayout)/components/shared/SnackbarAlert';
import { fetchUpdateAssetImprovementApproval } from '@/networks/libs/assetImprovements';
import { showAlertConfirmation } from '@/utils/function';
import { ISnackbar } from '@/utils/interface/snackbar';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextareaAutosize
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ModalApprove({
  id,
  status,
  assetRevision,
  onSuccess
}: {
  id: number;
  status: string;
  assetRevision: string;
  onSuccess: any;
}) {
  const router = useRouter();
  const [approve, setApprove] = useState('');
  const [revision, setRevision] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const currentStatus = status !== 'Menunggu Persetujuan' ? status : '';
    if (currentStatus) setApprove(currentStatus);
    if (assetRevision) setRevision(assetRevision);
  }, [status, assetRevision]);

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: '',
    severity: 'info'
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onUpdateStatus = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token') || '';
    await fetchUpdateAssetImprovementApproval(
      token,
      {
        status: approve,
        revision
      },
      id.toString()
    )
      .then((response) => {
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: 'Berhasil mengubah Status Persetujuan Aset!',
          severity: 'success'
        });
        onSuccess();
      })
      .catch((error) => {
        const message = error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: message,
          severity: 'error'
        });
      });
  };

  const handleChangeApprove = () => {
    showAlertConfirmation(
      'Apakah anda yakin ingin mengubah status persetujuan?',
      (confirmed: any) => {
        if (confirmed) {
          onUpdateStatus();
        } else {
          console.log('Canceled');
        }
      }
    );
  };

  return (
    <>
      <SnackbarAlert
        message={snackbar.message}
        severity={snackbar.severity}
        open={snackbar.isOpen}
        onClose={() =>
          setSnackbar((prev) => {
            return {
              ...prev,
              isOpen: false
            };
          })
        }
      />
      <Button variant="outlined" onClick={handleClickOpen}>
        Persetujuan
      </Button>

      <Dialog
        style={{ zIndex: 5 }}
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleChangeApprove();
            handleClose();
          }
        }}
      >
        <DialogTitle>Persetujuan</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={1}>
              <DialogContentText>Pilih Persetujuan</DialogContentText>
              <FormControl style={{ minWidth: '130px' }}>
                <InputLabel id="demo-simple-select-label" size="small">
                  Persetujuan
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={approve}
                  label="Persetujuan"
                  size="small"
                  onChange={(event) => setApprove(event.target.value)}
                >
                  <MenuItem value="Setuju">Setuju</MenuItem>
                  <MenuItem value="Tolak">Tolak</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="column" spacing={1}>
              <DialogContentText>Revisi</DialogContentText>
              <TextareaAutosize
                disabled={!approve || approve === 'Setuju'}
                autoFocus
                required
                id="revision"
                name="revision"
                placeholder="Revisi"
                value={revision}
                onChange={(event) => setRevision(event.target.value)}
                minRows={3}
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            Simpan
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
