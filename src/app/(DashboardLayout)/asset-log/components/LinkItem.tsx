import { fetchUpdateLinks } from '@/networks/libs/links';
import { showAlertConfirmation } from '@/utils/function';
import { ISnackbar } from '@/utils/interface/snackbar';
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SnackbarAlert from '../../components/shared/SnackbarAlert';

export default function LinkItem({ link }: { link: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(link?.url);
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    setUrl(link?.url);
  }, [link]);

  const onUpdateLinks = async () => {
    setIsLoading(true);

    const token = localStorage.getItem('token') || '';
    await fetchUpdateLinks(token, { url }, link?.id?.toString())
      .then((response) => {
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: 'Berhasil mengubah tanggal!',
          severity: 'success'
        });
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

  const confirmUpdateDates = () => {
    showAlertConfirmation(
      'Apakah anda yakin ingin mengubah link ini?',
      (confirmed: any) => {
        if (confirmed) {
          onUpdateLinks();
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
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography>{link?.name}: </Typography>
        <TextField
          size="small"
          placeholder="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <LoadingButton
          onClick={confirmUpdateDates}
          loading={isLoading}
          variant="contained"
          disabled={!url}
        >
          Save
        </LoadingButton>
      </Stack>
    </>
  );
}
