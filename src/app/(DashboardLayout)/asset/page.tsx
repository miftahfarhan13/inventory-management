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
  Skeleton,
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
import { getAssets } from '@/networks/libs/asset';
import { IconArrowsSort, IconDownload, IconEye } from '@tabler/icons-react';
import Link from 'next/link';
import { IconPlus } from '@tabler/icons-react';
import { formatter } from '@/utils/number';
import moment from 'moment';
import { StyledIconButton } from './create/components/shared/StyledIconButton';
import DetailAssetType from './components/DetailAssetType';
import { StyledTableCell } from '../asset-log/[id]/page';
import FilterAsset from './components/FilterAsset';
import { useReactToPrint } from 'react-to-print';

const Asset = () => {
  const componentPdf = useRef();
  const firstRun = useRef(true);
  const [filtersData, setFiltersData] = useState<any>();
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  const [show, setShow] = useState('10');
  const [keyword, setKeyword] = useState('');
  const [asset, setAsset] = useState<any>();

  const handleSetAssets = (data: any) => {
    let finalData = Array<any>();

    data?.data?.map((asset: any, index: number) => {
      const assetImprovements =
        asset?.asset_improvements && asset?.asset_improvements?.length > 0
          ? asset?.asset_improvements
          : [];

      const totalLogPrice = assetImprovements?.reduce(
        (total: number, currentItem: any) => {
          return total + currentItem.improvement_price;
        },
        0
      );

      const lastRepair = assetImprovements[0]?.actual_repair_end_date;

      finalData.push({
        id: asset?.id,
        no: index + 1,
        asset_code: asset?.asset_code,
        asset_uid: asset?.asset_uid,
        name: asset?.name,
        location: asset?.location?.name,
        study_program: asset?.location?.study_program?.name,
        status: asset?.status,
        total_price: totalLogPrice,
        last_repair: lastRepair
          ? moment(new Date(lastRepair)).format('DD/MM/YYYY')
          : '-',
        created_by: asset?.user?.name
      });
    });

    setAsset(finalData);
  };

  const [isLoading, setIsLoading] = useState(false);
  const fetchAsset = (page: string, show: string, filters: any) => {
    const token = localStorage.getItem('token') || '';
    setIsLoading(true);
    getAssets('true', token, page, show, keyword, filters)
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
      fetchAsset('1', show, filtersData);
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

  const generatePDF = useReactToPrint({
    // @ts-ignore
    content: () => componentPdf.current,
    documentTitle: 'Asset Data'
  });

  const sortedAssets = [...(asset || [])].sort((a, b) => {
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

  return (
    <PageContainer title="Data Aset" description="Aset">
      <style type="text/css" media="print">
        {
          '\
        @page { size: landscape; }\
      '
        }
      </style>
      <DashboardCard title=" Data Aset">
        <Stack direction="column" spacing={2}>
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
                <FilterAsset onSaveFilter={(value) => onSaveFilter(value)} />
                <Button
                  variant="outlined"
                  startIcon={<IconDownload size={16} />}
                  onClick={generatePDF}
                >
                  Cetak
                </Button>
              </Stack>
              <Button
                href="/asset/create"
                variant="contained"
                startIcon={<IconPlus size="16" />}
                LinkComponent={Link}
              >
                Tambah Aset
              </Button>
            </Stack>
            {isLoading ? (
              <>
                <Skeleton width="100%" height="300px" />
              </>
            ) : (
              <>
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
                              UID aset &nbsp; <IconArrowsSort size="15" />
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
                            onClick={() => handleSort('location.name')}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Lokasi aset &nbsp; <IconArrowsSort size="15" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              handleSort('location.study_program.name')
                            }
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Prodi &nbsp; <IconArrowsSort size="15" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('status')}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Status Aset &nbsp; <IconArrowsSort size="15" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('total_price')}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Total Perbaikan &nbsp;{' '}
                              <IconArrowsSort size="15" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('last_repair')}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Waktu Cek &nbsp; <IconArrowsSort size="15" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('created_by')}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Dibuat Oleh &nbsp; <IconArrowsSort size="15" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              position: { xs: 'static', md: 'sticky' },
                              right: 0,
                              backgroundColor: {
                                xs: 'transparent',
                                md: 'white'
                              },
                              zIndex: 5
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Aksi
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedAssets?.map((asset: any, index: number) => {
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
                                    {asset?.location}
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
                                    {asset?.study_program}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={0.2}
                                >
                                  <Chip
                                    sx={{
                                      px: '4px',
                                      backgroundColor:
                                        asset?.status === 'Baik'
                                          ? 'success.main'
                                          : 'error.main',
                                      color: '#fff'
                                    }}
                                    size="small"
                                    label={asset?.status}
                                  ></Chip>

                                  {asset?.asset_improvements &&
                                    asset?.asset_improvements?.length > 0 && (
                                      <DetailAssetType
                                        assetImprovements={
                                          asset?.asset_improvements
                                        }
                                      />
                                    )}
                                </Stack>
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
                                    Rp {formatter.format(asset?.total_price)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={0.2}
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
                                      {asset?.last_repair}
                                    </Typography>
                                  </Box>

                                  {asset?.asset_improvements &&
                                    asset?.asset_improvements?.length > 0 && (
                                      <DetailAssetType
                                        assetImprovements={
                                          asset?.asset_improvements
                                        }
                                      />
                                    )}
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  fontWeight={400}
                                >
                                  {asset?.created_by}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  position: { xs: 'static', md: 'sticky' },
                                  right: 0,
                                  backgroundColor: {
                                    xs: 'transparent',
                                    md: 'white'
                                  },
                                  zIndex: 5
                                }}
                              >
                                <Stack
                                  spacing={1}
                                  direction="row"
                                  justifyContent="end"
                                >
                                  <Link href={`/asset/${asset?.id}`}>
                                    <StyledIconButton
                                      variant="outlined"
                                      size="small"
                                    >
                                      <IconEye width="20" height="20" />
                                    </StyledIconButton>
                                  </Link>

                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={`/asset/${asset?.id}/update`}
                                    LinkComponent={Link}
                                  >
                                    Edit
                                  </Button>

                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={`/asset-log/${asset?.id}?code=${asset?.asset_code}`}
                                    LinkComponent={Link}
                                  >
                                    Log Perbaikan
                                  </Button>
                                  {/* <ModalUpdateAsset
                          data={Asset}
                          onSuccess={() => fetchAsset("1", show)}
                        />
                        <ModalDeleteAsset
                          id={asset?.id}
                          onSuccess={() => fetchAsset("1", show)}
                        /> */}
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            )}
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
              onChange={(_, page) =>
                fetchAsset(page.toString(), show, filtersData)
              }
              count={asset?.last_page}
            />
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default Asset;
