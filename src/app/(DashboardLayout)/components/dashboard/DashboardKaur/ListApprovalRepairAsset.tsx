import HoverPopover from "@/app/(DashboardLayout)/asset-log/[id]/components/HoverPopover";
import ModalApprove from "@/app/(DashboardLayout)/asset-log/[id]/components/ModalApprove";
import { getAssetImprovements } from "@/networks/libs/assetImprovements";
import { getAssetImprovementsAdminKaur } from "@/networks/libs/dashboard";
import {
  Box,
  Button,
  Card,
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
  Typography,
} from "@mui/material";
import { IconDownload, IconEye } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";

export default function ListApprovalRepairAsset({ year }: { year: string }) {
  const firstRun = useRef(true);

  const [page, setPage] = useState("1");
  const [show, setShow] = useState("10");
  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetAssets = (data: any) => {
    let finalData = Array<any>();

    data?.data?.map((asset: any, index: number) => {
      finalData.push({
        id: asset?.id,
        asset_id: asset?.asset?.id,
        no: index + 1,
        asset_code: asset?.asset?.asset_code,
        name: asset?.asset?.name,
        location: `${asset?.asset?.location?.name} - ${asset?.asset?.location?.study_program?.name}`,
        asset_needed_date: asset?.asset_needed_date,
        urgency: asset?.urgency,
        status: asset?.status,
        revision: asset?.revision,
        additional_document: asset?.additional_document,
        user_name: asset?.user?.name,
        approved_user_name: asset?.approved_user?.name,
      });
    });

    setAsset({ data: finalData, last_page: data?.last_page });
  };

  const fetchAsset = (page: string, show: string) => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getAssetImprovementsAdminKaur("true", token, page, show, year)
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
      fetchAsset(page, show);
      firstRun.current = false;
    }
  }, []);

  const refreshData = () => {
    fetchAsset(page, show);
  };

  const getAssetStatus = (status: string) => {
    const assetStatus: any = {
      Setuju: "Disetujui",
      Tolak: "Revisi",
    };

    const currentStatus = assetStatus[status]
      ? assetStatus[status]
      : "Menunggu Persetujuan";

    return currentStatus;
  };

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rounded" width="100%" height={200} />
      ) : (
        <Card sx={{ height: "100%" }}>
          <Box p="20px" pr="40px">
            <Stack direction="column" spacing={2}>
              <Typography fontWeight="700" fontSize="20px">
                Daftar Persetujuan Perbaikan Aset
              </Typography>

              <Stack direction="column" spacing={2}>
                <Box
                  sx={{
                    overflow: "auto",
                    width: { xs: "calc(100vw - 80px)", sm: "auto" },
                  }}
                >
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer
                      sx={{
                        maxWidth: {
                          xs: "100%",
                          sm: "100%",
                          md: "100%",
                          lg: "calc(100vw - 420px)",
                        },
                      }}
                    >
                      {/* @ts-ignore */}
                      <Table
                        stickyHeader
                        aria-label="sticky table"
                        sx={{
                          whiteSpace: "nowrap",
                          mt: 2,
                        }}
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
                                Nama
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={600}>
                                Lokasi
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={600}>
                                Urgensi
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={600}>
                                Tanggal Dibutuhkan
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
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={600}>
                                Persetujuan
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {asset?.data?.map((asset: any) => {
                            return (
                              <TableRow key={asset?.id}>
                                <TableCell>
                                  <Typography
                                    sx={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {asset?.no}
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    position: { xs: "static", md: "sticky" },
                                    left: 0,
                                    backgroundColor: {
                                      xs: "transparent",
                                      md: "white",
                                    },
                                    zIndex: 5,
                                  }}
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
                                      display: "flex",
                                      alignItems: "center",
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
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                    >
                                      {asset?.urgency ? asset?.urgency : "-"}
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
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                    >
                                      {asset?.asset_needed_date}
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
                                        px: "4px",
                                        backgroundColor:
                                          asset?.status === "Setuju"
                                            ? "success.main"
                                            : "error.main",
                                        color: "#fff",
                                      }}
                                      size="small"
                                      label={getAssetStatus(asset?.status)}
                                    ></Chip>
                                    {asset?.revision && (
                                      <>
                                        <HoverPopover
                                          text={`Revisi: ${asset?.revision}`}
                                        >
                                          <IconEye width="20" height="20" />
                                        </HoverPopover>
                                      </>
                                    )}
                                  </Stack>
                                </TableCell>
                                <TableCell>
                                  {asset?.additional_document ? (
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
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>

                                <TableCell>
                                  {asset?.approved_user_name &&
                                  asset?.status === "Setuju" ? (
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
                        fetchAsset("1", value);
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
                      fetchAsset(page.toString(), show);
                    }}
                    count={asset?.last_page}
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Card>
      )}
    </>
  );
}
