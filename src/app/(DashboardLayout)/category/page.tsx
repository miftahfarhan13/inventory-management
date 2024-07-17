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
import { getCategories } from "@/networks/libs/category";
import ModalCreateCategory from "./components/ModalCreateCategory";
import ModalUpdateCategory from "./components/ModalUpdateCategory";
import ModalDeleteCategory from "./components/ModalDeleteCategory";
import useDebounce from "@/utils/hooks/useDebounce";

const Category = () => {
  const firstRun = useRef(true);
  const [show, setShow] = useState("10");
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchCategories = (page: string, show: string) => {
    const token = localStorage.getItem("token") || "";
    setIsLoading(true);
    getCategories("true", token, page, show, keyword)
      .then((response) => {
        setCategories(response?.data?.result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchCategories("1", show);
      firstRun.current = false;
    }
  }, []);

  // DeBounce Function
  useDebounce(
    () => {
      fetchCategories("1", show);
    },
    [keyword],
    500
  );

  return (
    <PageContainer title="Kategori Asset" description="Kategori Asset">
      <DashboardCard title="Kategori Asset">
        <Stack direction="column" spacing={2}>
          <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
            <Stack direction="row" spacing={2} justifyContent="space-between" pt="5px">
              <TextField
                size="small"
                label="Search"
                placeholder="Search nama kategori"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <ModalCreateCategory
                onSuccess={() => fetchCategories("1", show)}
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
                      Nama Kategori
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
                {categories?.data?.map((category: any, index: number) => (
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
                        <ModalUpdateCategory
                          data={category}
                          onSuccess={() => fetchCategories("1", show)}
                        />
                        <ModalDeleteCategory
                          id={category?.id}
                          onSuccess={() => fetchCategories("1", show)}
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
                  fetchCategories("1", value);
                }}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              onChange={(_, page) => fetchCategories(page.toString(), show)}
              count={categories?.last_page}
            />
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default Category;
