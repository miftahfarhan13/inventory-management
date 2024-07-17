"use client";
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
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/utils/hooks/useDebounce";
import { IconChevronRight, IconDownload, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { formatter } from "@/utils/number";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import { getAssetImprovementsByAssetId } from "@/networks/libs/assetImprovements";
import ModalApprove from "./components/ModalApprove";
import { styled } from "@mui/system";
import { useReactToPrint } from "react-to-print";
import useGetMe from "@/utils/hooks/useGetMe";
import FilterAssetLog from "./components/FilterAssetLog";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  right: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 5,
}));

const StyledTableCellLeft = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  left: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 5,
}));

const AssetLogByAssetId = () => {
  const { id } = useParams();
  const componentPdf = useRef();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { user } = useGetMe();
  const firstRun = useRef(true);

  const [filtersData, setFiltersData] = useState<any>();
  const [show, setShow] = useState("10");
  const [keyword, setKeyword] = useState("");
  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchAsset = (page: string, show: string, filters: any) => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getAssetImprovementsByAssetId(
      "true",
      token,
      page,
      show,
      keyword,
      id.toString(),
      filters
    )
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
      fetchAsset("1", show, filtersData);
      firstRun.current = false;
    }
  }, []);

  // DeBounce Function
  useDebounce(
    () => {
      fetchAsset("1", show, filtersData);
    },
    [keyword],
    500
  );

  const onSaveFilter = (value: any) => {
    setFiltersData(value);
    fetchAsset("1", show, value);
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
    </Typography>,
  ];

  const generatePDF = useReactToPrint({
    // @ts-ignore
    content: () => componentPdf.current,
    documentTitle: "Asset Data Perbaikan",
  });

  return (
    <PageContainer title={`Log Perbaikan #${code}`} description="Log Perbaikan">
      <style type="text/css" media="print">
        {
          "\
        @page { size: landscape; }\
      "
        }
      </style>
      <DashboardCard title={`Log Perbaikan #${code}`}>
        <Stack direction="column" spacing={2}>
          <Breadcrumbs
            separator={<IconChevronRight fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>

          <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
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

              <Button
                href={`/asset-log/${id.toString()}/create?code=${code}`}
                variant="contained"
                startIcon={<IconPlus size="16" />}
                LinkComponent={Link}
              >
                Tambah Data Perbaikan
              </Button>
            </Stack>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer style={{ maxWidth: "calc(100vw - 420px)" }}>
                {/* @ts-ignore */}
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    whiteSpace: "nowrap",
                    mt: 2,
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
                      <StyledTableCellLeft>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Kode aset
                        </Typography>
                      </StyledTableCellLeft>
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
                          Rencana Waktu Perbaikan Selesai
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
                          Deskripsi
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Tanggal Pelaporan
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
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Persetujuan
                        </Typography>
                      </StyledTableCell>
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
                        "days"
                      );

                      return (
                        <TableRow key={asset?.id}>
                          <TableCell>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: "500",
                              }}
                            >
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <StyledTableCellLeft>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                #{asset?.asset?.asset_code}
                              </Typography>
                            </Box>
                          </StyledTableCellLeft>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {moment(
                                  new Date(asset?.repair_time_plan_date)
                                ).format("DD/MM/YYYY")}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {actualRepairStart.format("DD/MM/YYYY")}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {actualRepairFinish.format("DD/MM/YYYY")}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {actualRepairDay} Hari
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.description}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {moment(new Date(asset?.report_date)).format(
                                  "DD/MM/YYYY"
                                )}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {moment(
                                  new Date(asset?.validation_by_laboratory_date)
                                ).format("DD/MM/YYYY")}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {asset?.contact_technician}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                Rp {formatter.format(asset?.improvement_price)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              sx={{
                                px: "4px",
                                backgroundColor:
                                  asset?.status === "Setuju"
                                    ? "success.main"
                                    : "error.main",
                                color: "#fff",
                              }}
                              size="small"
                              label={
                                asset?.status
                                  ? asset?.status
                                  : "Menunggu Persetujuan"
                              }
                            ></Chip>
                          </TableCell>
                          <TableCell>
                            {asset?.additional_document && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
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
                          <StyledTableCell>
                            {user?.role === "admin" ? (
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
                          </StyledTableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <FormControl style={{ minWidth: "100px" }}>
              <InputLabel id="show-label">Show</InputLabel>
              <Select
                labelId="show-label"
                value={show}
                label="Show"
                size="small"
                onChange={(event) => {
                  const value = event?.target?.value;
                  setShow(event?.target?.value);
                  fetchAsset("1", value, filtersData);
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

export default AssetLogByAssetId;
