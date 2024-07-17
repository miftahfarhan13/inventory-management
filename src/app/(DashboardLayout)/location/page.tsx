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
import { getLocation } from "@/networks/libs/location";
import ModalCreateLocation from "./components/ModalCreateLocation";
import ModalDeleteLocation from "./components/ModalDeleteLocation";
import ModalUpdateLocation from "./components/ModalUpdateLocation";

const Location = () => {
  const firstRun = useRef(true);
  const [show, setShow] = useState("10");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchLocation = (page: string, show: string) => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getLocation("true", token, page, show, keyword)
      .then((response) => {
        setLocation(response?.data?.result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchLocation("1", show);
      firstRun.current = false;
    }
  }, []);

  // DeBounce Function
  useDebounce(
    () => {
      fetchLocation("1", show);
    },
    [keyword],
    500
  );

  return (
    <PageContainer title="Lokasi" description="Lokasi">
      <DashboardCard title="Lokasi">
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
                placeholder="Search nama Lokasi"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <ModalCreateLocation onSuccess={() => fetchLocation("1", show)} />
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
                      Nama Lokasi
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Program Studi
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Dibuat Oleh
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Aksi
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {location?.data?.map((category: any, index: number) => (
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
                          {category?.name}
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
                          {category?.study_program?.name}
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
                        <ModalUpdateLocation
                          data={category}
                          onSuccess={() => fetchLocation("1", show)}
                        />
                        <ModalDeleteLocation
                          id={category?.id}
                          onSuccess={() => fetchLocation("1", show)}
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
                  fetchLocation("1", value);
                }}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              onChange={(_, page) => fetchLocation(page.toString(), show)}
              count={location?.last_page}
            />
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default Location;
