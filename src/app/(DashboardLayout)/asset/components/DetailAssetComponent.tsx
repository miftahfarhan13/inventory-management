'use client';
import {
  Box,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useRef } from 'react';
import { IconDownload, IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import moment from 'moment';
import { formatter } from '@/utils/number';
import { useReactToPrint } from 'react-to-print';

export default function DetailAssetComponent({ asset }: { asset: any }) {
  const componentPdf = useRef(null);
  const generatePDF = useReactToPrint({
    // @ts-ignore
    content: () => componentPdf.current,
    documentTitle: `Asset Data ${asset?.asset_code}`
  });

  const price = asset?.price;
  const totalDepreciation = 0.05 * price;

  const currentYear = moment(new Date()).format('YYYY');
  const inputDataYear = moment(new Date(asset?.created_at)).format('YYYY');
  const assetAge = parseInt(currentYear) - parseInt(inputDataYear);

  const currentValue = price - assetAge * totalDepreciation;

  const assetImprovements = asset?.asset_improvements
    ? asset?.asset_improvements.sort(
        (a: any, b: any) => a?.created_at - b?.created_at
      )
    : [];

  const lastRepair = assetImprovements ? assetImprovements[0]?.created_at : '';

  const nextRepair = moment(new Date(lastRepair))
    .add(1, 'M')
    .format('DD/MM/YYYY');

  const totalLogPrice = assetImprovements?.reduce(
    (total: number, currentItem: any) => {
      return total + currentItem.improvement_price;
    },
    0
  );

  return (
    <>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" spacing={2} alignSelf="end">
          <Button
            variant="outlined"
            startIcon={<IconDownload size="16" />}
            onClick={generatePDF}
          >
            Cetak
          </Button>

          <Button
            variant="contained"
            startIcon={<IconEdit size="16" />}
            href={`/asset/${asset?.id}/update`}
            LinkComponent={Link}
          >
            Edit
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          spacing={4}
          ref={componentPdf}
        >
          <Stack direction="column" spacing={2} flexGrow={1}>
            <Table aria-label="simple table" size="small">
              <TableHead style={{ backgroundColor: '#5D87FF' }}>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={700} color="white">
                      Detail Aset
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="white">
                      {moment(new Date(asset?.created_at)).format('DD/MM/YYYY')}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Kode Aset
                  </TableCell>
                  <TableCell align="right">#{asset?.asset_code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    UID Aset
                  </TableCell>
                  <TableCell align="right">#{asset?.asset_uid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Kategori Aset
                  </TableCell>
                  <TableCell align="right">{asset?.category?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Nama Aset
                  </TableCell>
                  <TableCell align="right">{asset?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Asal Aset
                  </TableCell>
                  <TableCell align="right">{asset?.location?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Kepemilikan Program Studi
                  </TableCell>
                  <TableCell align="right">
                    {asset?.location?.study_program?.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Merk
                  </TableCell>
                  <TableCell align="right">{asset?.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Vendor Pembelian
                  </TableCell>
                  <TableCell align="right">{asset?.vendor}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tanggal Pembelian
                  </TableCell>
                  <TableCell align="right">
                    {moment(new Date(asset?.purchase_date)).format(
                      'DD/MM/YYYY'
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Nilai Pembelian
                  </TableCell>
                  <TableCell align="right">
                    Rp {formatter.format(price)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Total Depresiasi
                  </TableCell>
                  <TableCell align="right">
                    Rp {formatter.format(totalDepreciation)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Total Perbaikan
                  </TableCell>
                  <TableCell align="right">
                    {assetImprovements ? assetImprovements?.length : 0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Total Biaya Perbaikan
                  </TableCell>
                  <TableCell align="right">
                    Rp {formatter.format(totalLogPrice)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Nilai Sekarang
                  </TableCell>
                  <TableCell align="right">
                    Rp {formatter.format(currentValue)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Usia Aset
                  </TableCell>
                  <TableCell align="right">{assetAge} Tahun</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Waktu Perbaikan Rutin
                  </TableCell>
                  <TableCell align="right">
                    {asset?.routine_repair_time} Hari
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Perbaikan Terakhir
                  </TableCell>
                  <TableCell align="right">
                    {lastRepair
                      ? moment(new Date(lastRepair)).format('DD/MM/YYYY')
                      : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Perbaikan Selanjutnya
                  </TableCell>
                  <TableCell align="right">
                    {lastRepair ? nextRepair : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Status Aset
                  </TableCell>
                  <TableCell align="right">
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Button
              variant="outlined"
              href={`/asset-log/${asset?.id}?code=${asset?.asset_code}`}
            >
              Log Perbaikan
            </Button>
          </Stack>

          <Stack direction="column" alignItems="center" flexGrow={1}>
            <Box
              border="2px solid grey"
              padding="16px"
              borderRadius="10px"
              sx={{
                width: { xs: '100%', md: '400px' },
                height: { xs: '300px', md: '300px' }
              }}
            >
              <img
                src={asset?.image_url || '/images/default-image.jpeg'}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
