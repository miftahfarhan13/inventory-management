"use client";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
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
import { getAssets } from "@/networks/libs/asset";
import { IconDownload, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { formatter } from "@/utils/number";
import moment from "moment";
import { StyledIconButton } from "./create/components/shared/StyledIconButton";
import DetailAssetType from "./components/DetailAssetType";
import { StyledTableCell } from "../asset-log/[id]/page";
import FilterAsset from "./components/FilterAsset";
import { useReactToPrint } from "react-to-print";

const Asset = () => {
  const componentPdf = useRef();
  const firstRun = useRef(true);
  const [filtersData, setFiltersData] = useState<any>();
  const [show, setShow] = useState("10");
  const [keyword, setKeyword] = useState("");
  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchAsset = (page: string, show: string, filters: any) => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getAssets("true", token, page, show, keyword, filters)
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

  const getStatus = (assetImprovements: any) => {
    return assetImprovements && assetImprovements?.length > 0
      ? assetImprovements[0]?.type
      : "Baik";
  };

  const onSaveFilter = (value: any) => {
    setFiltersData(value);
    fetchAsset("1", show, value);
  };

  const generatePDF = useReactToPrint({
    // @ts-ignore
    content: () => componentPdf.current,
    documentTitle: "Asset Data",
  });

  return (
    <PageContainer title="Data Aset" description="Aset">
      <style type="text/css" media="print">
        {
          "\
        @page { size: landscape; }\
      "
        }
      </style>
      <DashboardCard title=" Data Aset">
        <Stack direction="column" spacing={2}>
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
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Kode aset
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Nama aset
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Lokasi aset
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Prodi
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Status Sekarang
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Total Perbaikan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Waktu Cek
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Dibuat Oleh
                        </Typography>
                      </TableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Action
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {asset?.data?.map((asset: any, index: number) => {
                      const assetImprovements =
                        asset?.asset_improvements &&
                        asset?.asset_improvements?.length > 0
                          ? asset?.asset_improvements
                          : [];

                      const status = getStatus(assetImprovements);

                      const totalLogPrice = assetImprovements?.reduce(
                        (total: number, currentItem: any) => {
                          return total + currentItem.improvement_price;
                        },
                        0
                      );

                      const lastRepair =
                        assetImprovements[0]?.actual_repair_end_date;
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
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                #{asset?.asset_code}
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
                                {asset?.name}
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
                                {asset?.location?.name}
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
                                {asset?.location?.study_program?.name}
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
                                  px: "4px",
                                  backgroundColor:
                                    status === "Baik"
                                      ? "success.main"
                                      : "error.main",
                                  color: "#fff",
                                }}
                                size="small"
                                label={status}
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
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                Rp {formatter.format(totalLogPrice)}
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
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {lastRepair
                                    ? moment(new Date(lastRepair)).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "-"}
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
                              {asset?.user?.name}
                            </Typography>
                          </TableCell>
                          <StyledTableCell>
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

export default Asset;
