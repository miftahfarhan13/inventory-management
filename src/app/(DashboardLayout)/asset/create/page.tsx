"use client";
import {
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { numberInputOnWheelPreventChange } from "@/utils/number";
import SelectCategory from "./components/shared/SelectCategory";
import { LoadingButton } from "@mui/lab";
import { ISnackbar } from "@/utils/interface/snackbar";
import { fetchCreateAsset } from "@/networks/libs/asset";
import SelectLocation from "./components/shared/SelectLocation";
import SnackbarAlert from "../../components/shared/SnackbarAlert";
import { useRouter } from "next/navigation";
import UploadFoto from "./components/shared/UploadFoto";

const CreateAsset = () => {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: "",
    severity: "info",
  });

  const onCreateAsset = async ({
    assetCode,
    name,
    categoryId,
    locationId,
    price,
    brand,
    vendor,
    purchaseDate,
    repairDate,
  }: {
    assetCode: string;
    name: string;
    categoryId: number;
    locationId: number;
    price: number;
    brand: string;
    vendor: string;
    purchaseDate: string;
    repairDate: string;
  }) => {
    setIsloading(true);
    const token = localStorage.getItem("token") || "";
    await fetchCreateAsset(token, {
      category_id: categoryId,
      location_id: locationId,
      asset_code: assetCode,
      name,
      price,
      brand,
      vendor,
      purchase_date: purchaseDate,
      repair_date: repairDate,
      image_url: imageUrl,
    })
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil menambah Aset!",
          severity: "success",
        });
        router.push("/asset");
      })
      .catch((error) => {
        const message = error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: message,
          severity: "error",
        });
      });
  };

  const breadcrumbs = [
    <Link key="1" href="/asset">
      List Aset
    </Link>,
    <Typography key="2" color="text.primary">
      Tambah Aset Baru
    </Typography>,
  ];

  return (
    <PageContainer
      title="Input Data Aset Baru"
      description="Input Data Aset Baru"
    >
      <DashboardCard title="Input Data Aset Baru">
        <Stack direction="column" spacing={2}>
          <SnackbarAlert
            message={snackbar.message}
            severity={snackbar.severity}
            open={snackbar.isOpen}
            onClose={() =>
              setSnackbar((prev) => {
                return {
                  ...prev,
                  isOpen: false,
                };
              })
            }
          />
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Breadcrumbs
              separator={<IconChevronRight fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>

            <Typography fontWeight={700}>
              {moment(new Date()).format("DD/MM/YYYY")}
            </Typography>
          </Stack>

          <Divider />

          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const name = formJson.name;
              const assetCode = formJson.assetCode;
              const categoryId = parseInt(formJson.categoryId);
              const locationId = parseInt(formJson.locationId);
              const price = parseInt(formJson.price);
              const brand = formJson.brand;
              const vendor = formJson.vendor;
              const purchaseDate = formJson.purchaseDate;
              const repairDate = formJson.repairDate;

              onCreateAsset({
                assetCode,
                name,
                categoryId,
                locationId,
                price,
                brand,
                vendor,
                purchaseDate,
                repairDate,
              });
            }}
          >
            <Stack direction="column" spacing={2}>
              <Container style={{ maxWidth: "1000px", alignSelf: "center" }}>
                <Stack direction="column" spacing={2} alignItems="center">
                  <Stack direction="column" spacing={1} alignItems="center">
                    <Typography fontWeight={700}>Foto Aset</Typography>
                    <UploadFoto
                      url={imageUrl}
                      onChangeValue={(value) => setImageUrl(value)}
                    />
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                      <Stack direction="column" spacing={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>Kode Aset</Typography>
                          <TextField
                            fullWidth
                            placeholder="Kode Aset"
                            label="Kode"
                            name="assetCode"
                            required
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>Nama Aset</Typography>
                          <TextField
                            fullWidth
                            placeholder="Nama Aset"
                            label="Nama"
                            name="name"
                            required
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>Lokasi Aset</Typography>
                          <SelectLocation name="locationId" />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>
                            Kategori Aset
                          </Typography>
                          <SelectCategory name="categoryId" />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>Merk</Typography>
                          <TextField
                            fullWidth
                            placeholder="Merk"
                            label="Merk"
                            name="brand"
                            required
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Stack direction="column" spacing={3}>
                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>
                            Vendor Pembelian
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Vendor Pembelian"
                            label="Vendor"
                            name="vendor"
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>
                            Nilai Pembelian
                          </Typography>
                          <TextField
                            type="number"
                            fullWidth
                            placeholder="Nilai Pembelian"
                            required
                            InputProps={{
                              startAdornment: (
                                <Typography mr={1}>Rp</Typography>
                              ),
                            }}
                            onWheel={numberInputOnWheelPreventChange}
                            name="price"
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>
                            Tanggal Pembelian
                          </Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              name="purchaseDate"
                              format="YYYY-MM-DD"
                            />
                          </LocalizationProvider>
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>
                            Waktu Perbaikan Rutin
                          </Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker name="repairDate" format="YYYY-MM-DD" />
                          </LocalizationProvider>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Container>

              <Divider />

              <Container style={{ maxWidth: "1000px", alignSelf: "center" }}>
                <Stack direction="column" alignItems="end">
                  <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                  >
                    Simpan
                  </LoadingButton>
                </Stack>
              </Container>
            </Stack>
          </form>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default CreateAsset;
