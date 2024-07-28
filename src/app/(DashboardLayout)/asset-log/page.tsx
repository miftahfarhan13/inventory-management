'use client';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '@/utils/hooks/useDebounce';
import { IconDownload } from '@tabler/icons-react';
import { formatter } from '@/utils/number';
import moment from 'moment';
import { getAssetImprovements } from '@/networks/libs/assetImprovements';
import { styled } from '@mui/system';
import { useReactToPrint } from 'react-to-print';
import FilterAssetLog from './[id]/components/FilterAssetLog';
import useGetMe from '@/utils/hooks/useGetMe';
import ModalApprove from './[id]/components/ModalApprove';
import HoverPopover from './[id]/components/HoverPopover';
import { IconEye } from '@tabler/icons-react';
import FormUpdateDate from './[id]/components/FormUpdateDate';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 5
}));

const AssetLogByAssetId = () => {
  const { user } = useGetMe();
  const componentPdf = useRef();

  const firstRun = useRef(true);

  const [page, setPage] = useState('1');
  const [filtersData, setFiltersData] = useState<any>();
  const [show, setShow] = useState('10');
  const [keyword, setKeyword] = useState('');
  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchAsset = (page: string, show: string, filters: any) => {
    const token = localStorage.getItem('token') || '';
    setIsLoading(true);
    getAssetImprovements('true', token, page, show, keyword, filters)
      .then((response) => {
        setAsset(response?.data?.result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchAsset(page, show, filtersData);
      firstRun.current = false;
    }
  }, []);

  // DeBounce Function
  useDebounce(
    () => {
      fetchAsset('1', show, filtersData);
    },
    [keyword],
    500
  );

  const onSaveFilter = (value: any) => {
    setFiltersData(value);
    fetchAsset('1', show, value);
  };

  const refreshData = () => {
    fetchAsset(page, show, filtersData);
  };

  const generatePDF = useReactToPrint({
    // @ts-ignore
    content: () => componentPdf.current,
    documentTitle: 'Asset Data Perbaikan'
  });

  const getAssetStatus = (status: string) => {
    const assetStatus: any = {
      Setuju: 'Disetujui',
      Tolak: 'Revisi'
    };

    const currentStatus = assetStatus[status]
      ? assetStatus[status]
      : 'Menunggu Persetujuan';

    return currentStatus;
  };

  return (
    <PageContainer
      title="Log Perbaikan Seluruh Aset"
      description="Log Perbaikan Seluruh Aset"
    >
      <style type="text/css" media="print">
        {
          '\
        @page { size: landscape; }\
      '
        }
      </style>
      <DashboardCard title="Log Perbaikan Seluruh Aset">
        <Stack direction="column" spacing={2}>
          <Box
            sx={{
              overflow: 'auto',
              width: { xs: 'calc(100vw - 80px)', sm: 'auto' }
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              pt="5px"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  size="small"
                  label="Search"
                  placeholder="Search nama aset"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
                <FilterAssetLog onSaveFilter={(value) => onSaveFilter(value)} />
                <Button
                  variant="outlined"
                  startIcon={<IconDownload size={16} />}
                  onClick={generatePDF}
                >
                  Cetak
                </Button>
              </Stack>
            </Stack>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer
                sx={{
                  maxWidth: {
                    xs: '100%',
                    sm: '100%',
                    md: '100%',
                    lg: 'calc(100vw - 420px)'
                  }
                }}
              >
                {/* @ts-ignore */}
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    whiteSpace: 'nowrap',
                    mt: 2
                  }}
                  ref={componentPdf}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          No
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          position: { xs: 'static', md: 'sticky' },
                          left: 0,
                          backgroundColor: {
                            xs: 'transparent',
                            md: 'white'
                          },
                          zIndex: 5
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          Kode aset
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Uid aset
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Merk
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Nama aset
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Waktu Aset Dibutuhkan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Tanggal Pelaporan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Urgensi
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Deskripsi
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Pelapor
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Kontak Pelapor
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Tanggal Validasi Oleh Laboran
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Jenis Perbaikan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Nama Teknisi
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Biaya Perbaikan
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Target Waktu Perbaikan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Realisasi Waktu Perbaikan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Realisasi Selesai
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Durasi Perbaikan
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Status Persetujuan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Dokumen
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" fontWeight={600}>
                          Dibuat oleh
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Persetujuan
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {asset?.data?.map((asset: any, index: number) => {
                      const actualRepairFinish = moment(
                        new Date(asset?.actual_repair_end_date)
                      );
                      const actualRepairStart = moment(
                        new Date(asset?.actual_repair_start_date)
                      );
                      const actualRepairDay = actualRepairFinish.diff(
                        actualRepairStart,
                        'days'
                      );

                      return (
                        <TableRow key={asset?.id}>
                          <TableCell>
                            <Typography
                              sx={{
                                fontSize: '15px',
                                fontWeight: '500'
                              }}
                            >
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              position: { xs: 'static', md: 'sticky' },
                              left: 0,
                              backgroundColor: {
                                xs: 'transparent',
                                md: 'white'
                              },
                              zIndex: 5
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                #{asset?.asset?.asset_code}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                #{asset?.asset?.asset_uid}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.asset?.brand}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.asset?.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {moment(
                                  new Date(asset?.asset_needed_date)
                                ).format('DD/MM/YYYY')}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {moment(new Date(asset?.report_date)).format(
                                  'DD/MM/YYYY'
                                )}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.urgency ? asset?.urgency : '-'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.description ? asset?.description : '-'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.reporter}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.contact_reporter}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {moment(
                                  new Date(asset?.validation_by_laboratory_date)
                                ).format('DD/MM/YYYY')}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.technician_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                Rp {formatter.format(asset?.improvement_price)}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {asset?.target_repair_date ? (
                                <>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                  >
                                    {moment(
                                      new Date(asset?.target_repair_date)
                                    ).format('DD/MM/YYYY')}
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <FormUpdateDate
                                    assetId={asset?.asset?.id}
                                    id={asset?.id}
                                    name="target_repair_date"
                                    onSuccess={() => refreshData()}
                                  />
                                </>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {asset?.actual_repair_start_date ? (
                                <>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                  >
                                    {actualRepairStart.format('DD/MM/YYYY')}
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <FormUpdateDate
                                    assetId={asset?.asset?.id}
                                    id={asset?.id}
                                    name="actual_repair_start_date"
                                    onSuccess={() => refreshData()}
                                  />
                                </>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {asset?.actual_repair_end_date ? (
                                <>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                  >
                                    {actualRepairFinish.format('DD/MM/YYYY')}
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <FormUpdateDate
                                    assetId={asset?.asset?.id}
                                    id={asset?.id}
                                    name="actual_repair_end_date"
                                    onSuccess={() => refreshData()}
                                  />
                                </>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.actual_repair_end_date &&
                                asset?.actual_repair_start_date
                                  ? `${actualRepairDay} Hari`
                                  : '-'}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Chip
                                sx={{
                                  px: '4px',
                                  backgroundColor:
                                    asset?.status === 'Setuju'
                                      ? 'success.main'
                                      : 'error.main',
                                  color: '#fff'
                                }}
                                size="small"
                                label={getAssetStatus(asset?.status)}
                              ></Chip>
                              {asset?.revision && (
                                <HoverPopover
                                  text={`Revisi: ${asset?.revision}`}
                                >
                                  <IconEye width="20" height="20" />
                                </HoverPopover>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {asset?.additional_document && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Button
                                  href={asset?.additional_document}
                                  startIcon={<IconDownload size={14} />}
                                >
                                  Cek Dokumen
                                </Button>
                              </Box>
                            )}
                          </TableCell>

                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="subtitle2"
                              fontWeight={400}
                            >
                              {asset?.user?.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {user?.role === 'admin-1' ||
                            user?.role === 'admin-2' ? (
                              <>
                                {asset?.approved_user?.name ? (
                                  <>
                                    <Typography
                                      color="textSecondary"
                                      variant="subtitle2"
                                      fontWeight={400}
                                    >
                                      {asset?.approved_user?.name}
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    <ModalApprove id={asset?.id} />
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  fontWeight={400}
                                >
                                  {asset?.approved_user?.name}
                                </Typography>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <FormControl style={{ minWidth: '100px' }}>
              <InputLabel id="show-label">Show</InputLabel>
              <Select
                labelId="show-label"
                value={show}
                label="Show"
                size="small"
                onChange={(event) => {
                  const value = event?.target?.value;
                  setShow(event?.target?.value);
                  fetchAsset('1', value, filtersData);
                }}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              onChange={(_, page) => {
                setPage(page.toString());
                fetchAsset(page.toString(), show, filtersData);
              }}
              count={asset?.last_page}
            />
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default AssetLogByAssetId;
