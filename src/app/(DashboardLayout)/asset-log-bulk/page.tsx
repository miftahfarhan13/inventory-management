'use client';
import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useState } from 'react';
import { IconChevronRight, IconPlus, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { numberInputOnWheelPreventChange } from '@/utils/number';
import { LoadingButton } from '@mui/lab';
import { ISnackbar } from '@/utils/interface/snackbar';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SnackbarAlert from '@/app/(DashboardLayout)/components/shared/SnackbarAlert';
import {
  fetchCreateAssetImprovement,
  fetchCreateBulkAssetImprovement
} from '@/networks/libs/assetImprovements';
import UploadFile from '../asset-log/[id]/create/components/shared/UploadFile';
import { StyledIconButton } from '../asset/create/components/shared/StyledIconButton';
import { getAssetByUid } from '@/networks/libs/asset';

const CreateAssetLog = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const router = useRouter();

  const [assetUid, setAssetUid] = useState('');
  const [assetUids, setAssetUids] = useState(
    Array<{ id: string; uid: string; name: string }>()
  );
  const [isLoading, setIsloading] = useState(false);
  const [fileUrl, setfileUrl] = useState('');
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: '',
    severity: 'info'
  });

  const findAsset = (uid: string) => {
    const assets = [...assetUids];
    const asset = assets?.find((find) => find.uid === uid);
    return asset;
  };

  const handleAddAsset = ({
    id,
    uid,
    name
  }: {
    id: string;
    uid: string;
    name: string;
  }) => {
    const assets = [...assetUids];
    const asset = findAsset(uid);

    if (!asset) {
      assets.push({ id, uid, name });
      setAssetUids(assets);
    } else {
      setSnackbar({
        isOpen: true,
        message: 'Aset sudah ada dalam table',
        severity: 'warning'
      });
    }
  };

  const handleDeleteAsset = (index: number) => {
    const assets = [...assetUids];
    assets.splice(index, 1);
    setAssetUids(assets);
  };

  const fetchAsset = (assetUid: string) => {
    const token = localStorage.getItem('token') || '';
    getAssetByUid(assetUid, token)
      .then((response) => {
        const result = response?.data?.result;
        if (result) {
          handleAddAsset({
            id: result?.id,
            uid: result?.asset_uid,
            name: result?.name
          });
        } else {
          setSnackbar({
            isOpen: true,
            message: 'Aset tidak ditemukan',
            severity: 'error'
          });
        }
      })
      .catch((error) => {
        setSnackbar({
          isOpen: true,
          message: 'Aset tidak ditemukan',
          severity: 'error'
        });
      });
  };

  const onCreateAsset = async ({
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
    const assets = [...assetUids];
    const assetIds = assets?.map((asset) => asset?.id);

    if (assetIds && assetIds?.length === 0) {
      return setSnackbar({
        isOpen: true,
        message: 'Silakan tambahkan asset terlebih dahulu',
        severity: 'error'
      });
    }

    if (!asset_needed_date) {
      return setSnackbar({
        isOpen: true,
        message: 'Silakan isi Waktu Aset Dibutuhkan',
        severity: 'error'
      });
    }

    setIsloading(true);
    const token = localStorage.getItem('token') || '';
    await fetchCreateBulkAssetImprovement(token, {
      asset_ids: assetIds,
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
    })
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: 'Berhasil menambah Log Perbaikan Aset!',
          severity: 'success'
        });
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

  const handleClearSearch = () => {
    setAssetUid('');
  };

  return (
    <PageContainer
      title="Bulk Perbaikan Aset"
      description="Bulk Perbaikan Aset"
    >
      <DashboardCard title={`Bulk Perbaikan Aset`}>
        <Stack direction="column" spacing={2}>
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

          <form
            style={{ width: '100%' }}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();

              fetchAsset(assetUid);
            }}
          >
            <Stack
              direction="column"
              spacing={2}
              alignItems="center"
              width="100%"
            >
              <Typography fontWeight="700">
                Masukan UID atau Scan Tag RFID
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                width="100%"
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Masukan UID atau Scan Tag RFID"
                  placeholder="Masukan UID atau Scan Tag RFID"
                  name="uid"
                  value={assetUid}
                  onChange={(event) => setAssetUid(event.target.value)}
                />

                <StyledIconButton
                  color="default"
                  variant="outlined"
                  size="small"
                  onClick={handleClearSearch}
                >
                  <IconX width="20" height="20" />
                </StyledIconButton>
              </Stack>
            </Stack>
          </form>

          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    UID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Nama Barang
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Aksi
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assetUids?.map((asset, index) => {
                return (
                  <TableRow key={asset?.uid}>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: '15px',
                          fontWeight: '700'
                        }}
                      >
                        {asset?.uid}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="subtitle2">
                          {asset?.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={1} direction="row">
                        <StyledIconButton
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteAsset(index)}
                        >
                          <IconX width="20" height="20" />
                        </StyledIconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Divider />

          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography fontWeight={700}>
              Counter {assetUids?.length}
            </Typography>

            <Typography fontWeight={700}>
              {moment(new Date()).format('DD/MM/YYYY')}
            </Typography>
          </Stack>

          <Divider />

          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
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

              onCreateAsset({
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
            }}
          >
            <Stack direction="column" spacing={2}>
              <Stack direction="column" spacing={2} alignItems="center">
                <Grid container spacing={3}>
                  <Grid item xs={11.5} lg={3}>
                    <Stack direction="column" spacing={3}>
                      <Stack direction="column" spacing={1}>
                        <Typography fontWeight={700}>
                          Deskripsi Kerusakan
                        </Typography>
                        <TextField
                          id="standard-multiline-static"
                          label="Deskripsi Kerusakan"
                          multiline
                          rows={4}
                          name="description"
                          required
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
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={11.5} lg={3}>
                    <Stack direction="column" spacing={3}>
                      <Stack direction="column" spacing={1}>
                        <Typography fontWeight={700}>Pelapor</Typography>
                        <TextField
                          fullWidth
                          placeholder="Pelapor"
                          label="Pelapor"
                          name="reporter"
                          required
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
                        />
                      </Stack>

                      <Stack direction="column" spacing={1}>
                        <Typography fontWeight={700}>
                          Tanggal Pelaporan
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker name="report_date" format="YYYY-MM-DD" />
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
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={11.5} lg={3}>
                    <Stack direction="column" spacing={3}>
                      <Stack direction="column" spacing={1}>
                        <Typography fontWeight={700}>
                          Jenis Perbaikan
                        </Typography>

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
                          >
                            <MenuItem value="Perbaikan Mandiri">
                              Perbaikan Mandiri
                            </MenuItem>
                            <MenuItem value="Perbaikan Vendor">
                              Perbaikan Vendor
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>

                      <Stack direction="column" spacing={1}>
                        <Typography fontWeight={700}>
                          Waktu Aset Dibutuhkan
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name="asset_needed_date"
                            format="YYYY-MM-DD"
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
                        />
                      </Stack>

                      <Stack direction="column" spacing={1}>
                        <Typography fontWeight={700}>
                          Biaya Perbaikan
                        </Typography>
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
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={11.5} lg={3}>
                    <Stack direction="column" spacing={3}>
                      <Stack direction="column" spacing={1}>
                        <Typography fontWeight={700}>
                          Dokumen Tambahan
                        </Typography>

                        <UploadFile
                          url={fileUrl}
                          onChangeValue={(value) => setfileUrl(value)}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>

              <Divider />

              <Container style={{ maxWidth: '1000px', alignSelf: 'center' }}>
                <Stack direction="column" alignItems="end">
                  <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                  >
                    Simpan
                  </LoadingButton>
                </Stack>
              </Container>
            </Stack>
          </form>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default CreateAssetLog;
