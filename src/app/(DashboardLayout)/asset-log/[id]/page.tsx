'use client';
import {
  Box,
  Breadcrumbs,
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
import {
  IconArrowsSort,
  IconChevronRight,
  IconDownload,
  IconEye
} from '@tabler/icons-react';
import Link from 'next/link';
import { IconPlus } from '@tabler/icons-react';
import { formatter } from '@/utils/number';
import moment from 'moment';
import { useParams, useSearchParams } from 'next/navigation';
import { getAssetImprovementsByAssetId } from '@/networks/libs/assetImprovements';
import ModalApprove from './components/ModalApprove';
import { styled } from '@mui/system';
import { useReactToPrint } from 'react-to-print';
import useGetMe from '@/utils/hooks/useGetMe';
import FilterAssetLog from './components/FilterAssetLog';
import FormUpdateDate from './components/FormUpdateDate';
import HoverPopover from './components/HoverPopover';
import ModalUpdateAssetLog from './create/components/shared/ModalUpdateAssetLog';
import Links from '../components/Links';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 5
}));

const AssetLogByAssetId = () => {
  const { id } = useParams();
  const componentPdf = useRef();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const { user } = useGetMe();
  const firstRun = useRef(true);

  const [page, setPage] = useState('1');
  const [filtersData, setFiltersData] = useState<any>();
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  const [show, setShow] = useState('10');
  const [keyword, setKeyword] = useState('');
  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetAssets = (data: any) => {
    let finalData = Array<any>();

    data?.data?.map((asset: any, index: number) => {
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

      finalData.push({
        id: asset?.id,
        asset_id: asset?.asset?.id,
        no: index + 1,
        asset_code: asset?.asset?.asset_code,
        asset_uid: asset?.asset?.asset_uid,
        brand: asset?.asset?.brand,
        name: asset?.asset?.name,
        asset_needed_date: asset?.asset_needed_date,
        report_date: asset?.report_date,
        urgency: asset?.urgency,
        description: asset?.description,
        reporter: asset?.reporter,
        contact_reporter: asset?.contact_reporter,
        validation_by_laboratory_date: asset?.validation_by_laboratory_date,
        type: asset?.type,
        technician_name: asset?.technician_name,
        improvement_price: formatter.format(asset?.improvement_price),
        target_repair_date: asset?.target_repair_date
          ? asset?.target_repair_date
          : '',

        actual_repair_start_date: asset?.actual_repair_start_date
          ? actualRepairStart.format('YYYY-MM-DD')
          : '',

        actual_repair_end_date: asset?.actual_repair_end_date
          ? actualRepairFinish.format('YYYY-MM-DD')
          : '',
        actual_repair_day: actualRepairDay,
        status: asset?.status,
        revision: asset?.revision,
        additional_document: asset?.additional_document,
        user_name: asset?.user?.name,
        approved_user_name: asset?.approved_user?.name
      });
    });

    setAsset({ data: finalData, last_page: data?.last_page });
  };

  const fetchAsset = (page: string, show: string, filters: any) => {
    const token = localStorage.getItem('token') || '';
    setIsLoading(true);
    getAssetImprovementsByAssetId(
      'true',
      token,
      page,
      show,
      keyword,
      id.toString(),
      filters
    )
      .then((response) => {
        handleSetAssets(response?.data?.result);
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

  const sortedAssets = [...(asset?.data || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const breadcrumbs = [
    <Link key="1" href="/asset">
      List Aset
    </Link>,
    <Link key="1" href={`/asset/${id.toString()}`}>
      Detail Aset
    </Link>,
    <Typography key="2" color="text.primary">
      Log Perbaikan
    </Typography>
  ];

  const generatePDF = useReactToPrint({
    // @ts-ignore
    content: () => componentPdf.current,
    documentTitle: 'Asset Data Perbaikan'
  });

  const isAdmin = user?.role === 'admin-1' || user?.role === 'admin-2';

  return (
    <PageContainer title={`Log Perbaikan #${code}`} description="Log Perbaikan">
      <style type="text/css" media="print">
        {
          '\
        @page { size: landscape; }\
      '
        }
      </style>
      <Stack direction="column" spacing={2}>
        <DashboardCard title={`Log Perbaikan #${code}`}>
          <Stack direction="column" spacing={2}>
            <Breadcrumbs
              separator={<IconChevronRight fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>

            <Box
              sx={{
                overflow: 'auto',
                width: { xs: 'calc(100vw - 80px)', sm: 'auto' }
              }}
            >
              <Stack
                spacing={2}
                justifyContent="space-between"
                pt="5px"
                sx={{
                  flexDirection: {
                    xs: 'column',
                    sm: 'column',
                    md: 'column',
                    lg: 'row'
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    size="small"
                    label="Search"
                    placeholder="Search nama aset"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                  <FilterAssetLog
                    onSaveFilter={(value) => onSaveFilter(value)}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<IconDownload size={16} />}
                    onClick={generatePDF}
                  >
                    Cetak
                  </Button>
                </Stack>

                <Button
                  href={`/asset-log/${id.toString()}/create?code=${code}`}
                  variant="contained"
                  startIcon={<IconPlus size="16" />}
                  LinkComponent={Link}
                >
                  Tambah Data Perbaikan
                </Button>
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
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('no')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            No &nbsp; <IconArrowsSort size="15" />
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
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('asset_code')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Kode aset &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('asset_uid')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Uid aset &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('brand')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Merk &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('name')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Nama aset &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('asset_needed_date')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Waktu Aset Dibutuhkan &nbsp;{' '}
                            <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('report_date')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Tanggal Pelaporan &nbsp;{' '}
                            <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('urgency')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Urgensi &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('description')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Deskripsi &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('reporter')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Pelapor &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('contact_reporter')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Kontak Pelapor &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            handleSort('validation_by_laboratory_date')
                          }
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Tanggal Validasi Oleh Laboran &nbsp;{' '}
                            <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('type')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Jenis Perbaikan &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('technician_name')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Nama Teknisi &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('improvement_price')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Biaya Perbaikan &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>

                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('target_repair_date')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Target Waktu Perbaikan &nbsp;{' '}
                            <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('actual_repair_start_date')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Realisasi Waktu Perbaikan &nbsp;{' '}
                            <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('actual_repair_end_date')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Realisasi Selesai &nbsp;{' '}
                            <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('actual_repair_day')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Durasi Perbaikan &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('status')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Status Persetujuan &nbsp;{' '}
                            <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Dokumen
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('user_name')}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Dibuat oleh &nbsp; <IconArrowsSort size="15" />
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Persetujuan
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
                      {sortedAssets?.map((asset: any) => {
                        return (
                          <TableRow key={asset?.id}>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: '15px',
                                  fontWeight: '500'
                                }}
                              >
                                {asset?.no}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  #{asset?.asset_code}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  #{asset?.asset_uid}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {asset?.brand}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {asset?.name}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {asset?.asset_needed_date}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {asset?.report_date}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {asset?.description
                                    ? asset?.description
                                    : '-'}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {asset?.validation_by_laboratory_date}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  Rp {asset?.improvement_price}
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
                                      {asset?.target_repair_date}
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    {asset?.status === 'Setuju' ? (
                                      <FormUpdateDate
                                        assetId={asset?.asset_id}
                                        id={asset?.id}
                                        name="target_repair_date"
                                        onSuccess={() => refreshData()}
                                      />
                                    ) : (
                                      '-'
                                    )}
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
                                      {asset?.actual_repair_start_date}
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    {asset?.status === 'Setuju' ? (
                                      <FormUpdateDate
                                        assetId={asset?.asset_id}
                                        id={asset?.id}
                                        name="actual_repair_start_date"
                                        onSuccess={() => refreshData()}
                                      />
                                    ) : (
                                      '-'
                                    )}
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
                                      {asset?.actual_repair_end_date}
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    {asset?.status === 'Setuju' ? (
                                      <FormUpdateDate
                                        assetId={asset?.asset_id}
                                        id={asset?.id}
                                        name="actual_repair_end_date"
                                        onSuccess={() => refreshData()}
                                      />
                                    ) : (
                                      '-'
                                    )}
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {asset?.actual_repair_end_date &&
                                  asset?.actual_repair_start_date
                                    ? `${asset?.actual_repair_day} Hari`
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
                              {asset?.additional_document ? (
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
                              ) : (
                                '-'
                              )}
                            </TableCell>

                            <TableCell>
                              <Typography
                                color="textSecondary"
                                variant="subtitle2"
                                fontWeight={400}
                              >
                                {asset?.user_name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {isAdmin ? (
                                <>
                                  {asset?.approved_user_name &&
                                  asset?.status === 'Setuju' ? (
                                    <>
                                      <Typography
                                        color="textSecondary"
                                        variant="subtitle2"
                                        fontWeight={400}
                                      >
                                        {asset?.approved_user_name}
                                      </Typography>
                                    </>
                                  ) : (
                                    <>
                                      <ModalApprove
                                        id={asset?.id}
                                        status={asset?.status}
                                        assetRevision={asset?.revision}
                                        onSuccess={() => refreshData()}
                                      />
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
                                    {asset?.approved_user_name &&
                                    asset?.status === 'Setuju'
                                      ? asset?.approved_user_name
                                      : '-'}
                                  </Typography>
                                </>
                              )}
                            </TableCell>
                            <TableCell>
                              {asset?.status === 'Tolak' && (
                                <>
                                  <ModalUpdateAssetLog
                                    asset={asset}
                                    onSuccess={() => refreshData()}
                                  />
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

        <DashboardCard title="Links">
          <Links />
        </DashboardCard>
      </Stack>
    </PageContainer>
  );
};

export default AssetLogByAssetId;
