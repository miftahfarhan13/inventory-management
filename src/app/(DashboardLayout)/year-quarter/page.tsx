"use client";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/utils/hooks/useDebounce";
import { getYearQuarter } from "@/networks/libs/yearQuarter";
import ModalCreateYearQuarter from "./components/ModalCreateYearQuarter";
import ModalUpdateYearQuarter from "./components/ModalUpdateYearQuarter";
import ModalDeleteYearQuarter from "./components/ModalDeleteYearQuarter";
import moment from "moment";

const YearQuarter = () => {
  const firstRun = useRef(true);
  const [show, setShow] = useState("10");
  const [keyword, setKeyword] = useState("");
  const [yearQuarter, setyearQuarter] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchyearQuarter = (page: string, show: string) => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getYearQuarter("true", token, page, show, keyword)
      .then((response) => {
        setyearQuarter(response?.data?.result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchyearQuarter("1", show);
      firstRun.current = false;
    }
  }, []);

  // DeBounce Function
  useDebounce(
    () => {
      fetchyearQuarter("1", show);
    },
    [keyword],
    500
  );

  return (
    <PageContainer title="Tahun Kuartal" description="Tahun Kuartal">
      <DashboardCard title="Tahun Kuartal">
        <Stack direction="column" spacing={2}>
          <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              pt="5px"
            >
              <TextField
                size="small"
                label="Search"
                placeholder="Search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <ModalCreateYearQuarter
                onSuccess={() => fetchyearQuarter("1", show)}
              />
            </Stack>
            <Table
              aria-label="simple table"
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
                      Tahun
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Rentang TW 1
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Rentang TW 2
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Rentang TW 3
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Dibuat Oleh
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yearQuarter?.data?.map((category: any, index: number) => (
                  <TableRow key={category?.id}>
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
                          {category?.year}
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
                          {moment(new Date(category?.start_tw_1)).format(
                            "DD MMMM YYYY"
                          )}{" "}
                          -{" "}
                          {moment(new Date(category?.end_tw_1)).format(
                            "DD MMMM YYYY"
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
                          {moment(new Date(category?.start_tw_2)).format(
                            "DD MMMM YYYY"
                          )}{" "}
                          -{" "}
                          {moment(new Date(category?.end_tw_2)).format(
                            "DD MMMM YYYY"
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
                          {moment(new Date(category?.start_tw_3)).format(
                            "DD MMMM YYYY"
                          )}{" "}
                          -{" "}
                          {moment(new Date(category?.end_tw_3)).format(
                            "DD MMMM YYYY"
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {category?.user?.name} ({category?.user?.email})
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack spacing={1} direction="row" justifyContent="end">
                        <ModalUpdateYearQuarter
                          data={category}
                          onSuccess={() => fetchyearQuarter("1", show)}
                        />
                        <ModalDeleteYearQuarter
                          id={category?.id}
                          onSuccess={() => fetchyearQuarter("1", show)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  fetchyearQuarter("1", value);
                }}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              onChange={(_, page) => fetchyearQuarter(page.toString(), show)}
              count={yearQuarter?.last_page}
            />
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default YearQuarter;
