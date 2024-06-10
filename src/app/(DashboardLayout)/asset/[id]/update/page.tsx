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
import { useEffect, useRef, useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { numberInputOnWheelPreventChange } from "@/utils/number";
import { LoadingButton } from "@mui/lab";
import { ISnackbar } from "@/utils/interface/snackbar";
import { fetchUpdateAsset, getAsset } from "@/networks/libs/asset";
import SnackbarAlert from "../../../components/shared/SnackbarAlert";
import { useParams, useRouter } from "next/navigation";
import UploadFoto from "../../create/components/shared/UploadFoto";
import SelectLocation from "../../create/components/shared/SelectLocation";
import SelectCategory from "../../create/components/shared/SelectCategory";
import dayjs from "dayjs";

const CreateAsset = () => {
  const firstRun = useRef(true);
  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setIsloading] = useState(false);
  const [locationId, setLocationId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: "",
    severity: "info",
  });

  const handleChangeLocationId = (value: any) => {
    setLocationId(parseInt(value));
  };

  const handleChangeCategoryId = (value: any) => {
    setCategoryId(parseInt(value));
  };

  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [asset, setAsset] = useState<any>();
  const fetchAsset = () => {
    const token = localStorage.getItem("token") || "";
    setIsLoadingGet(true);
    getAsset(id.toString(), token)
      .then((response) => {
        setAsset(response?.data?.result);
        setImageUrl(response?.data?.result?.image_url);
        setLocationId(response?.data?.result?.location_id);
        setCategoryId(response?.data?.result?.category_id);

        setIsLoadingGet(false);
      })
      .catch((error) => {
        setIsLoadingGet(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchAsset();
      firstRun.current = false;
    }
  }, []);

  const onCreateAsset = async ({
    assetCode,
    name,
    categoryId,
    locationId,
    price,
    brand,
    vendor,
    purchaseDate,
    routineRepairTime,
  }: {
    assetCode: string;
    name: string;
    categoryId: number;
    locationId: number;
    price: number;
    brand: string;
    vendor: string;
    purchaseDate: string;
    routineRepairTime: string;
  }) => {
    setIsloading(true);
    const token = localStorage.getItem("token") || "";
    await fetchUpdateAsset(
      token,
      {
        category_id: categoryId,
        location_id: locationId,
        asset_code: assetCode,
        name,
        price,
        brand,
        vendor,
        purchase_date: purchaseDate,
        routine_repair_time: routineRepairTime,
        image_url: imageUrl,
      },
      id.toString()
    )
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil menambah Aset!",
          severity: "success",
        });
        router.push(`/asset/${id.toString()}`);
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
    <Link key="1" href={`/asset/${id.toString()}`}>
      Detail Aset
    </Link>,
    <Typography key="2" color="text.primary">
      Edit Aset
    </Typography>,
  ];

  return (
    <PageContainer title="Edit Aset" description="Edit Aset">
      <DashboardCard title="Edit Aset">
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
              const routineRepairTime = formJson.routineRepairTime;

              onCreateAsset({
                assetCode,
                name,
                categoryId,
                locationId,
                price,
                brand,
                vendor,
                purchaseDate,
                routineRepairTime,
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
                            name="assetCode"
                            required
                            defaultValue={asset?.asset_code}
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>Nama Aset</Typography>
                          <TextField
                            fullWidth
                            placeholder="Nama Aset"
                            name="name"
                            required
                            defaultValue={asset?.name}
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>Lokasi Aset</Typography>
                          <SelectLocation
                            name="locationId"
                            value={locationId}
                            onChange={(event) =>
                              handleChangeLocationId(event.target.value)
                            }
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>
                            Kategori Aset
                          </Typography>
                          <SelectCategory
                            name="categoryId"
                            value={categoryId}
                            onChange={(event) =>
                              handleChangeCategoryId(event.target.value)
                            }
                          />
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>Merk</Typography>
                          <TextField
                            fullWidth
                            placeholder="Merk"
                            name="brand"
                            required
                            defaultValue={asset?.brand}
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
                            name="vendor"
                            defaultValue={asset?.vendor}
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
                            defaultValue={asset?.price}
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
                              value={dayjs(new Date(asset?.purchase_date))}
                            />
                          </LocalizationProvider>
                        </Stack>

                        <Stack direction="column" spacing={1}>
                          <Typography fontWeight={700}>
                            Waktu Perbaikan Rutin
                          </Typography>
                          <TextField
                            type="number"
                            fullWidth
                            placeholder="Waktu Perbaikan Rutin"
                            required
                            InputProps={{
                              endAdornment: (
                                <Typography mr={1}>Hari</Typography>
                              ),
                            }}
                            onWheel={numberInputOnWheelPreventChange}
                            name="routineRepairTime"
                            defaultValue={asset?.routine_repair_time}
                          />
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
