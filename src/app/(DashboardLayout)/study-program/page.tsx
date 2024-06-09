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
import { getStudyProgram } from "@/networks/libs/studyProgram";
import ModalCreateStudyProgram from "./components/ModalCreateStudyProgram";
import ModalDeleteStudyProgram from "./components/ModalDeleteStudyProgram";
import ModalUpdateStudyProgram from "./components/ModalUpdateStudyProgram";

const StudyProgram = () => {
  const firstRun = useRef(true);
  const [show, setShow] = useState("10");
  const [keyword, setKeyword] = useState("");
  const [studyProgram, setStudyProgram] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchstudyProgram = (page: string, show: string) => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getStudyProgram("true", token, page, show, keyword)
      .then((response) => {
        setStudyProgram(response?.data?.result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchstudyProgram("1", show);
      firstRun.current = false;
    }
  }, []);

  // DeBounce Function
  useDebounce(
    () => {
      fetchstudyProgram("1", show);
    },
    [keyword],
    500
  );

  return (
    <PageContainer title="Program Studi" description="Program Studi">
      <DashboardCard title="Program Studi">
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
                placeholder="Search nama program studi"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <ModalCreateStudyProgram
                onSuccess={() => fetchstudyProgram("1", show)}
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
                      Nama Program Studi
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
                {studyProgram?.data?.map((category: any, index: number) => (
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
                        <ModalUpdateStudyProgram
                          data={category}
                          onSuccess={() => fetchstudyProgram("1", show)}
                        />
                        <ModalDeleteStudyProgram
                          id={category?.id}
                          onSuccess={() => fetchstudyProgram("1", show)}
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
                  fetchstudyProgram("1", value);
                }}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              onChange={(_, page) => fetchstudyProgram(page.toString(), show)}
              count={studyProgram?.last_page}
            />
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default StudyProgram;
