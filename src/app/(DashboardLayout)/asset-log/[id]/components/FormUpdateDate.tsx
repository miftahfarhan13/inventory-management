import SnackbarAlert from '@/app/(DashboardLayout)/components/shared/SnackbarAlert';
import { fetchUpdateAssetImprovementDates } from '@/networks/libs/assetImprovements';
import { showAlertConfirmation } from '@/utils/function';
import { ISnackbar } from '@/utils/interface/snackbar';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import React, { useState } from 'react';

export default function FormUpdateDate({
  assetId,
  id,
  onSuccess,
  name
}: {
  assetId: string;
  id: string;
  onSuccess: any;
  name: string;
}) {
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: '',
    severity: 'info'
  });

  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const onUpdateDates = async () => {
    setIsLoading(true);

    const data: any = {};
    const dynamicKey = name;
    data[dynamicKey] = date;
    data['asset_id'] = assetId;

    const token = localStorage.getItem('token') || '';
    await fetchUpdateAssetImprovementDates(token, data, id.toString())
      .then((response) => {
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: 'Berhasil mengubah tanggal!',
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

  const confirmUpdateDates = () => {
    showAlertConfirmation(
      'Apakah anda yakin ingin mengubah tanggal ini?',
      (confirmed: any) => {
        if (confirmed) {
          onUpdateDates();
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

      <Stack direction="row" alignItems="center" spacing={2} minWidth="300px">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            name="dates"
            format="YYYY-MM-DD"
            onChange={(event) => {
              const date: string = event?.toString() || '';
              const momentDate = moment(new Date(date)).format('YYYY-MM-DD');
              setDate(momentDate);
            }}
          />
        </LocalizationProvider>
        <LoadingButton
          variant="outlined"
          onClick={confirmUpdateDates}
          loading={isLoading}
          disabled={!date}
        >
          Simpan
        </LoadingButton>
      </Stack>
    </>
  );
}
