import { getNearestSchedulesRepairAsset } from "@/networks/libs/dashboard";
import {
  Box,
  Card,
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
import React, { useEffect, useRef, useState } from "react";

export default function ListClosestRepairSchedule({ year }: { year: string }) {
  const firstRun = useRef(true);

  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetAssets = (data: any) => {
    let finalData = Array<any>();

    data?.map((asset: any, index: number) => {
      finalData.push({
        no: index + 1,
        asset_code: asset?.asset_code,
        name: asset?.name,
        date: asset?.date,
        dateNext: asset?.dateNext,
      });
    });

    setAsset(finalData);
  };

  const fetchAsset = () => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getNearestSchedulesRepairAsset(token, year)
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
      fetchAsset();
      firstRun.current = false;
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rounded" width="100%" height={200} />
      ) : (
        <Card sx={{ height: "100%" }}>
          <Box p="20px" pr="40px">
            <Stack direction="column" spacing={2}>
              <Typography fontWeight="700" fontSize="20px">
                Daftar Jadwal Perbaikan Aset Terdekat
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
                                Perbaikan Selanjutnya
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {asset?.map((asset: any) => {
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
                                      {asset?.dateNext}
                                    </Typography>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Card>
      )}
    </>
  );
}
