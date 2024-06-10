"use client";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useRef, useState } from "react";
import { getAsset } from "@/networks/libs/asset";
import { IconChevronRight, IconDownload, IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import moment from "moment";
import { formatter } from "@/utils/number";

const DetailAsset = () => {
  const { id } = useParams();
  const firstRun = useRef(true);
  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchAsset = () => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getAsset(id.toString(), token)
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
      fetchAsset();
      firstRun.current = false;
    }
  }, []);

  const price = asset?.price;
  const totalDepreciation = 0.05 * price;

  const currentYear = moment(new Date()).format("YYYY");
  const inputDataYear = moment(new Date(asset?.created_at)).format("YYYY");
  const assetAge = parseInt(currentYear) - parseInt(inputDataYear);

  const currentValue = price - assetAge * totalDepreciation;

  const assetImprovements = asset?.asset_improvements
    ? asset?.asset_improvements.sort(
        (a: any, b: any) => a?.created_at - b?.created_at
      )
    : [];

  const lastRepair = assetImprovements ? assetImprovements[0]?.created_at : "";

  const nextRepair = moment(new Date(lastRepair))
    .add(1, "M")
    .format("DD/MM/YYYY");

  const totalLogPrice = assetImprovements?.reduce(
    (total: number, currentItem: any) => {
      return total + currentItem.improvement_price;
    },
    0
  );

  const status =
    assetImprovements && assetImprovements?.length > 0
      ? assetImprovements[0]?.type
      : "Baik";

  const breadcrumbs = [
    <Link key="1" href="/asset">
      List Aset
    </Link>,
    <Typography key="2" color="text.primary">
      Detail Aset
    </Typography>,
  ];

  return (
    <PageContainer title="Detail Aset" description="Detail Aset">
      <DashboardCard title="Detail Aset">
        <Stack direction="column" spacing={2}>
          <Breadcrumbs
            separator={<IconChevronRight fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>

          <Stack direction="column" spacing={3}>
            <Stack direction="row" spacing={2} alignSelf="end">
              <Button variant="outlined" startIcon={<IconDownload size="16" />}>
                Cetak
              </Button>

              <Button
                variant="contained"
                startIcon={<IconEdit size="16" />}
                href={`/asset/${id}/update`}
                LinkComponent={Link}
              >
                Edit
              </Button>
            </Stack>

            <Stack direction={{ xs: "column-reverse", md: "row" }} spacing={4}>
              <Stack direction="column" spacing={2} flexGrow={1}>
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#5D87FF" }}>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight={700} color="white">
                          Detail Aset
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="white">
                          {moment(new Date(asset?.created_at)).format(
                            "DD/MM/YYYY"
                          )}
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
                        Nama Aset
                      </TableCell>
                      <TableCell align="right">{asset?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Asal Aset
                      </TableCell>
                      <TableCell align="right">
                        {asset?.location?.name}
                      </TableCell>
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
                          "DD/MM/YYYY"
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
                          ? moment(new Date(lastRepair)).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Perbaikan Selanjutnya
                      </TableCell>
                      <TableCell align="right">
                        {lastRepair ? nextRepair : "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Kondisi Aset Sekarang
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          sx={{
                            px: "4px",
                            backgroundColor:
                              status === "Baik" ? "success.main" : "error.main",
                            color: "#fff",
                          }}
                          size="small"
                          label={status}
                        ></Chip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Button
                  variant="outlined"
                  href={`/asset-log/create/${asset?.id}`}
                >
                  Log Perbaikan
                </Button>
              </Stack>

              <Stack direction="column" alignItems="center" flexGrow={1}>
                <Box border="2px solid grey" padding="16px" borderRadius="10px">
                  <img
                    src={asset?.image_url || "/images/default-image.jpeg"}
                    width={400}
                    height={300}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} style={{ padding: 0 }}></Grid>
              <Grid item xs={12} lg={6} style={{ padding: 0 }}></Grid>
            </Grid>
          </Stack>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default DetailAsset;
