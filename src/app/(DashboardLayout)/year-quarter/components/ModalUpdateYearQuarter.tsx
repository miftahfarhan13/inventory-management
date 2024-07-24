import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SnackbarAlert from "../../components/shared/SnackbarAlert";
import { ISnackbar } from "@/utils/interface/snackbar";
import { IconEdit } from "@tabler/icons-react";
import { fetchUpdateYearQuarter } from "@/networks/libs/yearQuarter";
import moment from "moment";
import { dataYear } from "@/utils/data";
import DatePickerRange from "../shared/DateRangePicker";

export default function ModalUpdateYearQuarter({
  data,
  onSuccess,
}: {
  data: any;
  onSuccess: () => void;
}) {
  const [year, setYear] = React.useState("");
  const [range1, setRange1] = React.useState<[Date, Date]>();
  const [range2, setRange2] = React.useState<[Date, Date]>();
  const [range3, setRange3] = React.useState<[Date, Date]>();
  const [range4, setRange4] = React.useState<[Date, Date]>();

  const [isLoading, setIsloading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<ISnackbar>({
    isOpen: false,
    message: "",
    severity: "info",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onUpdateYearQuarter = async () => {
    setIsloading(true);
    const token = localStorage.getItem("token") || "";
    const tw1 = range1 || [];
    const tw2 = range2 || [];
    const tw3 = range3 || [];
    const tw4 = range4 || [];

    const startTw1 = moment(new Date(tw1[0] || "")).format("yyyy-MM-DD");
    const endTw1 = moment(new Date(tw1[1] || "")).format("yyyy-MM-DD");

    const startTw2 = moment(new Date(tw2[0] || "")).format("yyyy-MM-DD");
    const endTw2 = moment(new Date(tw2[1] || "")).format("yyyy-MM-DD");

    const startTw3 = moment(new Date(tw3[0] || "")).format("yyyy-MM-DD");
    const endTw3 = moment(new Date(tw3[1] || "")).format("yyyy-MM-DD");

    const startTw4 = moment(new Date(tw4[0] || "")).format("yyyy-MM-DD");
    const endTw4 = moment(new Date(tw4[1] || "")).format("yyyy-MM-DD");

    await fetchUpdateYearQuarter(
      token,
      {
        year: year,
        start_tw_1: startTw1,
        end_tw_1: endTw1,
        start_tw_2: startTw2,
        end_tw_2: endTw2,
        start_tw_3: startTw3,
        end_tw_3: endTw3,
        start_tw_4: startTw4,
        end_tw_4: endTw4,
      },
      data?.id
    )
      .then((response) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil menambah Tahun!",
          severity: "success",
        });
        onSuccess();
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

  React.useEffect(() => {
    setYear(data?.year);

    const tw1 = [new Date(data?.start_tw_1), new Date(data?.end_tw_1)];
    // @ts-ignore
    setRange1(tw1);

    const tw2 = [new Date(data?.start_tw_2), new Date(data?.end_tw_2)];
    // @ts-ignore
    setRange2(tw2);

    const tw3 = [new Date(data?.start_tw_3), new Date(data?.end_tw_3)];
    // @ts-ignore
    setRange3(tw3);

    const tw4 = [new Date(data?.start_tw_4), new Date(data?.end_tw_4)];
    // @ts-ignore
    setRange4(tw4);
  }, [data]);

  return (
    <React.Fragment>
      <Button
        size="small"
        variant="outlined"
        startIcon={<IconEdit size="16" />}
        onClick={handleClickOpen}
      >
        Edit
      </Button>

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
      <Dialog
        style={{ zIndex: 5 }}
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            onUpdateYearQuarter();
            handleClose();
          },
        }}
      >
        <DialogTitle>Edit Tahun</DialogTitle>
        <DialogContent>
          <DialogContentText>Silahkan masukkan Tahun</DialogContentText>
          <Stack direction="column" spacing={2} mt={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tahun</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={year}
                label="Tahun"
                onChange={(event) => setYear(event.target.value)}
                required
              >
                {dataYear?.map((year: any) => (
                  <MenuItem value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePickerRange
              value={range1}
              onChange={(value) => setRange1(value)}
              placeholder="Rentang TW 1"
              disabled={year === ""}
              allowedRangeStart={`${year}-01-01`}
              allowedRangeEnd={`${year}-12-31`}
            />

            <DatePickerRange
              value={range2}
              onChange={(value) => setRange2(value)}
              placeholder="Rentang TW 2"
              disabled={!range1}
              allowedRangeStart={`${year}-01-01`}
              allowedRangeEnd={`${year}-12-31`}
            />

            <DatePickerRange
              value={range3}
              onChange={(value) => setRange3(value)}
              placeholder="Rentang TW 3"
              disabled={!range2}
              allowedRangeStart={`${year}-01-01`}
              allowedRangeEnd={`${year}-12-31`}
            />

            <DatePickerRange
              value={range4}
              onChange={(value) => setRange4(value)}
              placeholder="Rentang TW 4"
              disabled={!range3}
              allowedRangeStart={`${year}-01-01`}
              allowedRangeEnd={`${year}-12-31`}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            Simpan
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
