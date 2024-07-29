import { fetchUpdateAssetImprovement } from '@/networks/libs/assetImprovements';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect, useState } from 'react';
import UploadFile from './UploadFile';
import { numberInputOnWheelPreventChange } from '@/utils/number';
import { LoadingButton } from '@mui/lab';
import { ISnackbar } from '@/utils/interface/snackbar';
import SnackbarAlert from '@/app/(DashboardLayout)/components/shared/SnackbarAlert';
import { IconEdit } from '@tabler/icons-react';
import dayjs from 'dayjs';

export default function ModalUpdateAssetLog({
  asset,
  onSuccess
}: {
  asset: any;
  onSuccess: any;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [fileUrl, setfileUrl] = useState('');
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    setfileUrl(asset?.additional_document);
  }, [asset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onUpdateAsset = async ({
    description,
    reporter,
    contact_reporter,
    report_date,
    validation_by_laboratory_date,
    type,
    asset_needed_date,
    technician_name,
    improvement_price,
    urgency
  }: {
    description: string;
    reporter: string;
    contact_reporter: string;
    report_date: string;
    validation_by_laboratory_date: string;
    type: string;
    asset_needed_date: string;
    technician_name: string;
    improvement_price: number;
    urgency: string;
  }) => {
    if (!asset_needed_date) {
      return setSnackbar({
        isOpen: true,
        message: 'Silakan isi Waktu Aset Dibutuhkan',
        severity: 'error'
      });
    }

    setIsloading(true);
    const token = localStorage.getItem('token') || '';
    await fetchUpdateAssetImprovement(
      token,
      {
        status: 'Menunggu Persetujuan',
        description,
        reporter,
        contact_reporter,
        report_date,
        validation_by_laboratory_date,
        type,
        asset_needed_date,
        technician_name,
        improvement_price,
        additional_document: fileUrl,
        urgency
      },
      asset?.id
    )
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: 'Berhasil menambah Log Perbaikan Aset!',
          severity: 'success'
        });
        handleClose();
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
          severity: 'error'
        });
      });
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        startIcon={<IconEdit size="16" />}
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
              isOpen: false
            };
          })
        }
      />

      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const description = formJson.description;
            const reporter = formJson.reporter;
            const contact_reporter = formJson.contact_reporter;
            const report_date = formJson.report_date;
            const improvement_price = parseInt(formJson.improvement_price);
            const validation_by_laboratory_date =
              formJson.validation_by_laboratory_date;
            const type = formJson.type;
            const asset_needed_date = formJson.asset_needed_date;
            const technician_name = formJson.technician_name;
            const urgency = formJson.urgency;

            onUpdateAsset({
              description,
              reporter,
              contact_reporter,
              report_date,
              validation_by_laboratory_date,
              type,
              asset_needed_date,
              technician_name,
              improvement_price,
              urgency
            });
          }
        }}
      >
        <DialogTitle>Update Log Perbaikan</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={3}>
            <Stack
              direction="column"
              spacing={1}
              alignSelf="start"
              width="100%"
            >
              <Typography fontWeight={700}>Kode Aset</Typography>
              <TextField
                fullWidth
                placeholder="Kode Aset"
                label="Kode"
                name="assetCode"
                required
                disabled
                value={asset?.asset_code}
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Deskripsi Kerusakan</Typography>
              <TextField
                id="standard-multiline-static"
                label="Deskripsi Kerusakan"
                multiline
                rows={4}
                name="description"
                required
                defaultValue={asset?.description}
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Urgensi</Typography>
              <TextField
                id="standard-multiline-static"
                label="Urgensi"
                multiline
                rows={4}
                name="urgency"
                required
                defaultValue={asset?.urgency}
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Pelapor</Typography>
              <TextField
                fullWidth
                placeholder="Pelapor"
                label="Pelapor"
                name="reporter"
                required
                defaultValue={asset?.reporter}
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Kontak Pelapor</Typography>
              <TextField
                fullWidth
                placeholder="Kontak Pelapor"
                label="Kontak Pelapor"
                name="contact_reporter"
                required
                defaultValue={asset?.contact_reporter}
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Tanggal Pelaporan</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="report_date"
                  format="YYYY-MM-DD"
                  value={dayjs(new Date(asset?.report_date))}
                />
              </LocalizationProvider>
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>
                Tanggal Validasi oleh Laboran
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="validation_by_laboratory_date"
                  format="YYYY-MM-DD"
                  value={dayjs(new Date(asset?.validation_by_laboratory_date))}
                  //   defaultValue={asset?.validation_by_laboratory_date}
                />
              </LocalizationProvider>
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Jenis Perbaikan</Typography>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Jenis Perbaikan
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Jenis Perbaikan"
                  name="type"
                  required
                  defaultValue={asset?.type}
                >
                  <MenuItem value="Perbaikan Mandiri">
                    Perbaikan Mandiri
                  </MenuItem>
                  <MenuItem value="Perbaikan Vendor">Perbaikan Vendor</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Waktu Aset Dibutuhkan</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="asset_needed_date"
                  format="YYYY-MM-DD"
                  value={dayjs(new Date(asset?.asset_needed_date))}
                />
              </LocalizationProvider>
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Nama Teknisi</Typography>
              <TextField
                fullWidth
                placeholder="Nama Teknisi"
                label="Nama Teknisi"
                name="technician_name"
                required
                defaultValue={asset?.technician_name}
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Biaya Perbaikan</Typography>
              <TextField
                type="number"
                fullWidth
                placeholder="Biaya Perbaikan"
                required
                InputProps={{
                  startAdornment: <Typography mr={1}>Rp</Typography>
                }}
                onWheel={numberInputOnWheelPreventChange}
                name="improvement_price"
                defaultValue={asset?.improvement_price}
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography fontWeight={700}>Dokumen Tambahan</Typography>

              <UploadFile
                url={fileUrl}
                onChangeValue={(value) => setfileUrl(value)}
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
